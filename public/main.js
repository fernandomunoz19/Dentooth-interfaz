document.getElementById("formInicio").addEventListener("submit", async function(event) {
    event.preventDefault(); // Evita que la página se recargue sola
    console.log("¡El formulario fue interceptado por JS con éxito!"); // <--- Revisa si esto sale en la consola

    const correoInput = document.getElementById("Usuario").value;
    const passwordInput = document.getElementById("password").value;
    console.log("Intentando enviar correo:", correoInput); // <--- Revisa si lee los inputs

    try {
        // Hacemos la petición POST a nuestro servidor de Node.js
        const respuesta = await fetch("http://127.0.0.1:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: correoInput,
                password: passwordInput
            })
        });

        const resultado = await respuesta.json();
        console.log("Respuesta del servidor:", resultado); // <--- Revisa qué devuelve Node.js

        if (resultado.estado === "ok") {
            // Evaluamos el rol real que viene de la base de datos
            if (resultado.rol === "odontologo") {
                window.location.href = "Odontologo.html";
            } else if (resultado.rol === "asistente") {
                window.location.href = "Asistente.html";
            } else if (resultado.rol === "paciente") {
                localStorage.setItem('idPaciente', resultado.idPaciente);
                window.location.href = "usuario.html";
            }
        } else {
            // Si el correo o clave fallan en la BD
            alert(resultado.mensaje);
        }

    } catch (error) {
        console.error("Error al conectar con el servidor:", error);
        alert("No se pudo conectar con el servidor backend.");
    }
})

    // Botón de Inicio / Salir para limpiar sesión al hacer clic en el diente o salir
    const botonHome = document.querySelector('.Home');
    if (botonHome) {
        botonHome.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    };