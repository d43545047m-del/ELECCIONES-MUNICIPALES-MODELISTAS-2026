document.addEventListener('DOMContentLoaded', function () {
    // 1. URL de la App de Google Apps Script donde se guardan los votos
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzlM_LWSnbePRLDPV4fPBKdVzivIuPoG-JvGqF-tQV_2jaSX6RRSh_s33M6nZpuHtQ0fw/exec";

    // 2. Inicialización del Carrusel Swiper
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
        }
    });

    // 3. Selección de la opción/tarjeta
    const slides = document.querySelectorAll('.swiper-slide');
    const inputVoto = document.getElementById('voto-seleccionado');

    slides.forEach(slide => {
        slide.addEventListener('click', function () {
            slides.forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            const voto = this.getAttribute('data-voto');
            inputVoto.value = voto;
        });
    });

    // 4. Envío del Formulario
    const formulario = document.getElementById('formulario-voto');
    const botonVotar = document.getElementById('boton-votar');

    formulario.addEventListener('submit', function (e) {
        e.preventDefault();

        const grado = document.getElementById('grado').value;
        const voto = inputVoto.value;

        if (!grado) {
            Swal.fire('Atención', 'Por favor, selecciona tu grado.', 'warning');
            return;
        }

        if (!voto) {
            Swal.fire('Atención', 'Por favor, haz clic sobre una lista para seleccionarla.', 'warning');
            return;
        }

        // Confirmación
        Swal.fire({
            title: '¿Confirmar voto?',
            text: `Grado: ${grado} | Opción: ${voto}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#1e3c72',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, emitir voto',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                botonVotar.disabled = true;
                botonVotar.innerText = "Registrando voto...";

                const data = new URLSearchParams();
                data.append('grado', grado);
                data.append('voto', voto);

                fetch(SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: data
                })
                .then(() => {
                    Swal.fire({
                        title: '¡Voto Registrado!',
                        text: 'Gracias por participar en la jornada electoral.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    }).then(() => {
                        formulario.reset();
                        slides.forEach(s => s.classList.remove('selected'));
                        inputVoto.value = '';
                        botonVotar.disabled = false;
                        botonVotar.innerText = "CONFIRMAR MI VOTO";
                    });
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire('Error', 'No se pudo enviar tu voto. Revisa tu conexión a internet.', 'error');
                    botonVotar.disabled = false;
                    botonVotar.innerText = "CONFIRMAR MI VOTO";
                });
            }
        });
    });
});
