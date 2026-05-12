/*
 * app.js - Este archivo se encarga de "armar" la página.
 * Trae las partes que se repiten (menú y pie de página) sin que tengamos que escribirlas 10 veces.
 */

/*
 * Función cargarComponente: busca un pedazo de HTML y lo mete en la página.
 * - id: es el hueco o contenedor donde vamos a poner el código.
 * - archivo: es el nombre de la pieza que queremos traer (ej: el menú).
 */
function cargarComponente(id, archivo) {
    /*
     * Aquí el programa revisa en qué carpeta estamos. 
     * Si estamos en una página secundaria (dentro de /pages/), tiene que retroceder un paso (../) 
     * para encontrar la carpeta de los componentes.
     */
    let ruta = window.location.pathname.includes("/pages/") 
        ? `../components/${archivo}` 
        : `components/${archivo}`;
    
    /*
     * fetch: es como mandar un recadero a buscar el archivo.
     * 1. Va a buscar el archivo a la carpeta.
     * 2. Recibe el contenido y lo convierte en texto.
     * 3. Busca el hueco en la página (id) y pega ese texto adentro.
     * 4. Si el archivo no existe o se pierde el recadero, avisa del error.
     */
    fetch(ruta)
        .then(res => res.text())
        .then(data => { document.getElementById(id).innerHTML = data; })
        .catch(err => console.error("No se pudo cargar la pieza:", err));
}

/*
 * Esto le dice al navegador: "Apenas termines de leer el HTML, haz esto".
 * Aquí es donde mandamos a llamar a la función de arriba para cargar el menú y el footer.
 */
document.addEventListener("DOMContentLoaded", () => {
    cargarComponente("nav-container", "nav.html");
    cargarComponente("footer-container", "footer.html");
});