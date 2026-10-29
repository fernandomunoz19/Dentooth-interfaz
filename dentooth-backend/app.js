const express = require("express");
const cors = require('cors');
const mysql = require("mysql2");
const bcrypt = require('bcrypt')

const app = express();
const puerto = 3000;

app.use(cors());              // 2. Lo activas antes de las rutas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const conexion = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "Adrsan891904",
    database: "Datos_dentooth"
});
const conexionPromesa = conexion.promise();

conexion.connect((err)=>{
    if(err){
        console.error("Error al conectar a la base de datos de MySql:",err);
        return;
    }
console.log("¡Conexion exitosa a la base de datos MySql Workbench!");
});

app.get("/",(req,res)=>{
    res.json({estado:"ok", mensaje:"¡Servidor de Dentooth conectado y activo"});
});

app.post("/login", (req, res) => {
    const { correo, password } = req.body;

    // Consulta SQL para verificar el correo y la contraseña en la tabla usuarios
    const sql = "SELECT * FROM usuarios WHERE correo = ? AND password = ?";

    conexion.query(sql, [correo, password], (err, resultados) => {
        if (err) {
            console.error("Error al consultar la base de datos:", err);
            return res.status(500).json({ estado: "error", mensaje: "Error en el servidor" });
        }

        // Si se encuentra un registro, las credenciales son correctas
        if (resultados.length > 0) {
            const usuario = resultados[0];

            // Si es paciente, buscamos su idPaciente real en la tabla paciente
            if (usuario.rol === 'paciente') {
                const sqlPaciente = "SELECT idPaciente FROM paciente WHERE id_usuario = ?";
                conexion.query(sqlPaciente, [usuario.id_usuario], (errPaciente, resPaciente) => {
                    let idPacienteReal = null;
                    if (!errPaciente && resPaciente.length > 0) {
                        idPacienteReal = resPaciente[0].idPaciente;
                    }

                    // Respondemos al login enviando también el idPaciente
                    res.json({
                        estado: "ok",
                        mensaje: "¡Bienvenido a Dentooth!",
                        rol: usuario.rol,
                        idPaciente: idPacienteReal
                    });
                });
            } else {
                // Si es odontólogo o asistente, responde normal sin idPaciente
                res.json({
                    estado: "ok",
                    mensaje: "¡Bienvenido a Dentooth!",
                    rol: usuario.rol
                });
            }

        } else {
            res.status(401).json({ estado: "error", mensaje: "Correo o contraseña incorrectos" });
        }
    });
});
// ruta de asistente----------------------------------======================================================
app.post('/api/pacientes/registrar', async (req, res) => {
    const {
        nombres,apellidos,cedula,fecha_nacimiento, genero, telefono, direccion, correo, eps, 
        contacto_emergencia, tel_emergencia, observaciones
    } = req.body;

    try {//==========================================================
   //==========================================================
        console.log("Cédula recibida desde el frontend:", cedula);

        if (!cedula) {
            return res.status(400).json({ 
                estado: "error", 
                mensaje: "La cédula es requerida para generar la contraseña inicial." 
            });
        }
        //==============================================================================
        //==============================================================================
       // const salt = await bcrypt.genSalt(10);//
        //*const password = await cedula;

        //const sqlUsuario = `INSERT INTO usuarios (correo, password, rol)values(?, ?, 'paciente')`;
        //const [resultadoUsuario] = await conexionPromesa.query(sqlUsuario,[correo, cedula]);
        const passwordPlano = String(cedula).trim();

        const sqlUsuario = `INSERT INTO usuarios (correo, password, rol) VALUES (?, ?, 'paciente')`;
        // Asegúrate de pasar passwordPlano aquí:
        const [resultadoUsuario] = await conexionPromesa.query(sqlUsuario, [correo, passwordPlano]);
        
        const idUsuarioCreado = resultadoUsuario.insertId;

        const sqlPaciente = `
            INSERT INTO paciente 
            (nombres, apellidos, cedula, fecha_nacimiento, genero, telefono, 
            direccion, eps, contacto_emergencia, tel_emergencia, observaciones, id_usuario) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await conexionPromesa.query(sqlPaciente, [
            nombres, apellidos, cedula, fecha_nacimiento, genero, telefono, direccion,
            eps, contacto_emergencia, tel_emergencia, observaciones, idUsuarioCreado
        ]);
        res.status (200).json({ok: true, mensaje: '¡Paciente registrado con exito'});
    } catch (error) {
        console.error('Error detallado al registrar paciente:', error);
        res.status(500).json({ ok: false, mensaje: 'Error interno en el servidor al registrar el paciente.' });
    }
});

//=========================================================================================
//=================modulo agendamiento de cita usuario========================================================================

app.get('/api/odontologos', async (req, res) => {
    try {
        const sql = `
            SELECT idOdontologo, Nombre
            FROM odontologo
            ORDER BY Nombre
        `;

        const [odontologos] = await conexionPromesa.query(sql);

        res.json(odontologos);
    } catch (error) {
        console.error('Error al consultar odontólogos:', error);
        res.status(500).json({
            mensaje: 'Error al cargar los odontólogos'
        });
    }
});

app.post('/api/citas/agendar', async (req, res) => {
    const { fecha, hora_inicio, especialidad, idPaciente, idOdontologo } = req.body;

    // 1. Validar los datos recibidos
    if (!fecha || !hora_inicio || !especialidad || !idPaciente || !idOdontologo) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Faltan datos para agendar la cita.'
        });
    }

    try {
        // 2. Preparar la consulta SQL
        const sql = `
            INSERT INTO cita
                (fecha, hora_inicio, especialidad, Estado, Paciente_idPaciente, odontologo_idOdontologo)
            VALUES (?, ?, ?, 'Pendiente', ?, ?)
        `;

        // 3. Enviar los cuatro valores correspondientes
        const [resultado] = await conexionPromesa.query(sql, [
            fecha,
            hora_inicio,
            especialidad,
            idPaciente,
            idOdontologo
        ]);

        // 4. Confirmar que se insertó el registro
        if (resultado.affectedRows !== 1) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se pudo registrar la cita.'
            });
        }

        return res.status(201).json({
            ok: true,
            mensaje: '¡Cita agendada con éxito!',
            idCita: resultado.insertId
        });

    } catch (error) {
        console.error('Error al agendar cita:', error);

        return res.status(500).json({
            ok: false,
            mensaje: 'Error al agendar la cita en el servidor.'
        });
    }
});

// cierre del servidor
app.listen(3000,() =>{
    console.log("Servidor ejecutandose correctamente en: http://localhost:${3000}");
});