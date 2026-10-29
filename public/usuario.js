console.log("¡El script de agendamiento está conectado correctamente!");
async function cargarOdontologos() {
    const selector = document.getElementById('odontologo');

    try {
        const respuesta = await fetch(
            'http://localhost:3000/api/odontologos'
        );

        if (!respuesta.ok) {
            throw new Error('Error al consultar odontólogos');
        }

        const odontologos = await respuesta.json();

        selector.innerHTML =
            '<option value="">Selecciona un odontólogo</option>';

        odontologos.forEach(odontologo => {
            const opcion = document.createElement('option');

            opcion.value = odontologo.idOdontologo;
            opcion.textContent = odontologo.Nombre;

            selector.appendChild(opcion);
        });

    } catch (error) {
        console.error('Error al cargar odontólogos:', error);

        selector.innerHTML =
            '<option value="">No se pudieron cargar</option>';
    }
}

cargarOdontologos();

document.getElementById('formCita').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const especialidad = document.getElementById('Especialidad').value;
    const fecha = document.getElementById('fechaCita').value;
    const hora_inicio = document.getElementById('horaCita').value;
    const idOdontologo = document.getElementById('odontologo').value;
    // Recuperamos el ID del paciente logueado del navegador
    const idPaciente = localStorage.getItem('idPaciente');

    if (!idPaciente) {
        alert('Error: No se encontró la sesión del paciente. Por favor inicie sesión de nuevo.');
        return;
    }
    if (!idOdontologo) {
        alert('por favor, selecciona un odontologo.');
        return;
    }

    const datosCita = {
        especialidad,
        fecha,
        hora_inicio,
        idPaciente,
        idOdontologo
    };

    try {
        const respuesta = await fetch('http://localhost:3000/api/citas/agendar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosCita)
        });

        const resultado = await respuesta.json();
        
        if (resultado.ok && resultado.ok) {
            alert('¡Cita agendada correctamente!');
            console.log("Cita guardada con éxito.");
        } else {
            alert('Error: ' + (resultado.mensaje || 'No se pudo agendar la cita.'));
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('No se pudo conectar con el servidor.');
    }
});
