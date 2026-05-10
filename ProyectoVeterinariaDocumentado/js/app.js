/*
 * app.js - Carga dinámica de componentes comunes (navbar y footer).
 * Se ejecuta cuando el DOM está completamente cargado.
 */

/*
 * Función cargarComponente: carga un archivo HTML y lo inserta dentro del elemento con el id indicado.
 * Parámetros:
 *   id     : string con el id del contenedor donde se insertará el HTML.
 *   archivo: nombre del archivo (ej: "nav.html") ubicado en la carpeta "components".
 *
 * Funcionamiento:
 *   1. Determina la ruta correcta al archivo según si la página actual está en la raíz o en /pages/.
 *   2. Realiza una petición HTTP con fetch para obtener el contenido del archivo.
 *   3. Convierte la respuesta a texto.
 *   4. Inserta ese HTML dentro del contenedor con id 'id'.
 *   5. Si hay error, lo muestra en consola.
 */
function cargarComponente(id, archivo) {
    /*
     * window.location.pathname devuelve la ruta de la URL actual (ej: "/index.html" o "/pages/contacto.html").
     * .includes("/pages/") verifica si la ruta contiene "/pages/".
     * Si la página está dentro de /pages/, la ruta del componente será "../components/archivo".
     * Si está en la raíz, la ruta será "components/archivo".
     */
    let ruta = window.location.pathname.includes("/pages/") 
        ? `../components/${archivo}` 
        : `components/${archivo}`;
    
    /*
     * fetch es una API moderna para hacer peticiones HTTP.
     * Devuelve una Promesa.
     * .then(res => res.text()) : convierte la respuesta en texto (HTML).
     * .then(data => { ... })   : recibe el texto y lo asigna como contenido interno del elemento.
     * .catch(err => ...)       : captura errores de red o de lectura.
     */
    fetch(ruta)
        .then(res => res.text())
        .then(data => { document.getElementById(id).innerHTML = data; })
        .catch(err => console.error("Error cargando componente:", err));
}

/*
 * Evento DOMContentLoaded: se dispara cuando el HTML inicial ha sido completamente cargado y parseado,
 * sin esperar a hojas de estilo, imágenes o subframes.
 * Es el momento ideal para manipular el DOM.
 * Aquí se cargan el nav y el footer llamando a cargarComponente con los ids definidos en el HTML.
 */
document.addEventListener("DOMContentLoaded", () => {
    cargarComponente("nav-container", "nav.html");
    cargarComponente("footer-container", "footer.html");
});