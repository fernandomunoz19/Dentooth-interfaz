document.addEventListener('DOMContentLoaded',() => {
    const formulario = document.querySelector('#formPaciente');

    if (formulario){
        formulario.addEventListener ('submit', async (e) =>{
            e.preventDefault();

            const datosFormulario = new FormData (formulario);
            const datosPaciente = Object.fromEntries(datosFormulario.entries());

            try {// enviamos datos con fetch
                const respuesta = await fetch('http://localhost:3000/api/pacientes/registrar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datosPaciente)
                });

                const textoRespuesta = await respuesta.text();

                console.log('Estado HTTP:', respuesta.status);
                console.log('Respuesta del servidor:', textoRespuesta);
                

                let resultado;

            try {
                resultado = JSON.parse(textoRespuesta);
            } catch {
                throw new Error(
                    'El servidor no devolvió una respuesta JSON válida.'
                );
            }
            if (respuesta.ok) {
                alert('¡Paciente registrado exitosamente!');
                formulario.reset();
            } else {
                alert('Error: ' + resultado.mensaje);
            }

            
            } catch (error) {
                console.error('Error de red o conexión:', error);
                alert('No se pudo establecer conexión con el servidor.');
            }
        });
    }
});