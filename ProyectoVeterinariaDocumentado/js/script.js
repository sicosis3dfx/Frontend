/*
 * script.js - Lógica de la aplicación de gestión de mascotas (index.html).
 * Incluye:
 *   - Carrusel de imágenes manual/automático.
 *   - CRUD completo usando localStorage.
 *   - Validación de campos antes de guardar.
 *   - Renderizado dinámico de la tabla con eventos delegados.
 *   - Filtro por cualquier campo.
 */

/* ==================== INICIALIZACIÓN DE DATOS ==================== */

/*
 * mascotas: array que contiene todos los registros.
 * Se inicializa desde localStorage. Si existe la clave 'veterinaria_db',
 * se convierte de JSON a objeto JS con JSON.parse.
 * Si no existe (primera visita), se asigna un array vacío [].
 * 
 * localStorage es un almacenamiento persistente en el navegador (sobrevive a recargas).
 * Los datos se guardan como string, por eso usamos JSON.stringify al guardar y JSON.parse al leer.
 */
let mascotas = JSON.parse(localStorage.getItem('veterinaria_db')) || [];

/*
 * Variables de control de edición:
 * - editando (boolean): indica si el formulario está en modo edición.
 * - idEditando (number): guarda el id de la mascota que se está editando.
 *   Se usan para saber si al enviar el formulario debemos actualizar o crear un nuevo registro.
 */
let editando = false;
let idEditando = null;

/* ==================== CARRUSEL DE IMÁGENES ==================== */

/*
 * Array con las rutas de las imágenes del carrusel.
 * Se muestran en secuencia.
 */
const imgs = [
    "source/img/1.jpg",
    "source/img/2.jpg",
    "source/img/3.jpg",
    "source/img/4.jpg"
];

/*
 * idImg: índice de la imagen actualmente visible.
 */
let idImg = 0;

/*
 * Función cambiarImg: cambia la imagen del carrusel.
 * Parámetro n: número de posiciones a avanzar (1 para siguiente, -1 para anterior).
 *
 * Lógica:
 *   1. Obtiene el elemento <img> con id "imagenCarrusel".
 *   2. Calcula el nuevo índice. La fórmula matemática (idImg + n + imgs.length) % imgs.length
 *      hace que el índice sea cíclico (si pasa del último vuelve al primero y viceversa).
 *      % es el operador módulo (resto de división).
 *   3. Añade la clase "fade-out" para hacer la imagen transparente (transición CSS).
 *   4. Espera 500ms (lo que dura la transición) y luego cambia el src y quita "fade-out".
 */
function cambiarImg(n) {
    const el = document.getElementById("imagenCarrusel");
    if (!el) return; // Si no existe el elemento (otras páginas), sale de la función.
    
    idImg = (idImg + n + imgs.length) % imgs.length;
    
    // Inicia el fundido de salida
    el.classList.add("fade-out");
    
    /*
     * setTimeout ejecuta una función después de un retardo (en milisegundos).
     * Aquí espera 500ms para que el fade-out termine antes de cambiar la imagen.
     */
    setTimeout(() => {
        el.src = imgs[idImg];              // Cambia la fuente de la imagen
        el.classList.remove("fade-out");   // Quita la clase para que vuelva a ser opaca
    }, 500);
}

/*
 * Se asignan las funciones al objeto window para que sean accesibles desde el onclick en HTML.
 * Las funciones flecha (arrow functions) son una forma corta de escribir funciones anónimas.
 * () => cambiarImg(1) es lo mismo que function() { cambiarImg(1); }
 */
window.siguienteImagen = () => cambiarImg(1);
window.anteriorImagen = () => cambiarImg(-1);

/* ==================== MANEJO DEL FORMULARIO ==================== */

/*
 * obtenerCampos: Retorna un objeto con los valores actuales de los inputs del formulario,
 * aplicando .trim() (quita espacios en blanco al inicio y final).
 * Se usa tanto para crear como para actualizar.
 */
function obtenerCampos() {
    return {
        nombreMascota: document.getElementById('nombreMascota').value.trim(),
        nombreDueno: document.getElementById('nombreDueno').value.trim(),
        telefono: document.getElementById('telefonoDueno')?.value.trim() || '',
        edad: document.getElementById('edadMascota').value.trim(),
        tipo: document.getElementById('tipoMascota').value
    };
}

/*
 * validar: Recibe los datos y comprueba que cumplan las reglas.
 * Retorna true si todo es válido, false en caso contrario.
 * También muestra mensajes de error en los <small> correspondientes.
 */
function validar({ nombreMascota, nombreDueno, telefono, edad, tipo }) {
    let ok = true; // Bandera para saber si hay errores.
  
    // Limpia todos los mensajes de error previos (elementos con clase .error-campo).
    document.querySelectorAll('.error-campo').forEach(e => e.textContent = '');

    /*
     * Validación del nombre de la mascota:
     * - Debe tener al menos 2 caracteres.
     * - Solo puede contener letras y espacios (expresión regular /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).
     *   ^ : inicio, $ : fin, [] : clase de caracteres, + : uno o más.
     */
    if (nombreMascota.length < 2) {
        mostrarError('errorNombre', 'Mínimo 2 caracteres.');
        ok = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreMascota)) {
        mostrarError('errorNombre', 'Solo letras y espacios.');
        ok = false;
    }

    // Validación del nombre del dueño (misma lógica)
    if (nombreDueno.length < 2) {
        mostrarError('errorDueno', 'Mínimo 2 caracteres.');
        ok = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreDueno)) {
        mostrarError('errorDueno', 'Solo letras y espacios.');
        ok = false;
    }

    /*
     * Validación de edad:
     * - parseInt convierte el string a número entero (base 10).
     * - isNaN comprueba si es "Not a Number".
     * - Debe ser un número entre 1 y 30 inclusive.
     */
    const edadNum = parseInt(edad, 10);
    if (!edad || isNaN(edadNum) || edadNum < 1 || edadNum > 30) {
        mostrarError('errorEdad', 'Edad inválida (1-30).');
        ok = false;
    }

    if (!tipo) {
        mostrarError('errorTipo', 'Seleccione un tipo.');
        ok = false;
    }

    /*
     * Validación del teléfono (si existe el campo):
     * - /^\d{8,15}$/ : \d significa dígito (0-9), {8,15} indica entre 8 y 15 dígitos.
     * - .test() comprueba si el string cumple el patrón.
     * Si no cumple, muestra error.
     */
    if (telefono !== undefined && !/^\d{8,15}$/.test(telefono)) {
        mostrarError('errorTelefono', 'Teléfono inválido (8-15 dígitos).');
        ok = false;
    }

    return ok;
}

/*
 * mostrarError: escribe un mensaje de error en el <small> con el id dado.
 */
function mostrarError(idSpan, mensaje) {
    const span = document.getElementById(idSpan);
    if (span) span.textContent = mensaje;
}

/* ==================== ALMACENAMIENTO ==================== */

/*
 * guardarStorage: convierte el array 'mascotas' a JSON y lo guarda en localStorage.
 * JSON.stringify convierte un objeto/array JS a string.
 * Se llama cada vez que hay cambios (crear, editar, eliminar).
 */
function guardarStorage() {
    localStorage.setItem('veterinaria_db', JSON.stringify(mascotas));
}

/*
 * crearMascota: Recibe los datos del formulario y devuelve un objeto nuevo con un id único.
 * Date.now() retorna el número de milisegundos desde el 1 de enero de 1970 (suficiente como id único).
 */
function crearMascota(datos) {
    return {
        id: Date.now(),
        nombreMascota: datos.nombreMascota,
        nombreDueno: datos.nombreDueno,
        telefono: datos.telefono || '',
        edad: parseInt(datos.edad, 10),
        tipo: datos.tipo
    };
}

/* ==================== RENDERIZADO DE LA TABLA ==================== */

/*
 * render: pinta la tabla con los datos proporcionados (por defecto, 'mascotas').
 * - Vacía el tbody.
 * - Recorre el array con forEach.
 * - Crea un elemento <tr> y lo llena con innerHTML.
 * - Las últimas dos celdas son botones con data-id para identificar el registro.
 * - Usa clases Bootstrap: table, fw-bold, text-primary, badge, btn, btn-sm, etc.
 */
function render(datos = mascotas) {
    const tbody = document.querySelector('#tablaMascotas tbody');
    if (!tbody) return; // Si no hay tabla (otras páginas), no hace nada.
    
    tbody.innerHTML = ''; // Limpiar tabla
    
    datos.forEach(m => {
        const tr = document.createElement('tr');
        // Se usa template literal con variables ${}. En teléfono, si está vacío muestra "—".
        tr.innerHTML = `
            <td class="fw-bold text-primary">${m.nombreMascota}</td>
            <td>${m.nombreDueno}</td>
            <td>${m.telefono || '—'}</td>
            <td>${m.edad} años</td>
            <td><span class="badge bg-secondary">${m.tipo}</span></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-warning me-1 btn-editar" data-id="${m.id}">✏️</button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${m.id}">🗑️</button>
            </td>`;
        tbody.appendChild(tr);
    });
}

/* 
 * Evento delegado sobre el tbody: en lugar de poner listener a cada botón (que aún no existen),
 * escuchamos el click en el tbody y detectamos qué botón fue clickeado usando closest().
 * closest('button') sube por los ancestros hasta encontrar un button.
 * 
 * dataset.id obtiene el valor del atributo data-id del botón, convertido a número.
 * Luego según la clase del botón, llamamos a prepararEdicion o eliminar.
 */
document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#tablaMascotas tbody');
    if (tbody) {
        tbody.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return; // Si no se hizo clic en un botón, salir.
            
            const id = parseInt(btn.dataset.id, 10);
            
            // btn.classList.contains verifica si el botón tiene esa clase.
            if (btn.classList.contains('btn-editar')) prepararEdicion(id);
            if (btn.classList.contains('btn-eliminar')) eliminar(id);
        });
    }

    // Render inicial de la tabla
    render();
    
    // Carrusel automático: cambia de imagen cada 6 segundos (6000 ms).
    setInterval(siguienteImagen, 6000);
});

/* ==================== ENVÍO DEL FORMULARIO (CREAR/EDITAR) ==================== */

const formulario = document.getElementById('formMascota');
if (formulario) {
    /*
     * Escucha el evento submit del formulario.
     * e.preventDefault() evita que se recargue la página.
     * Obtiene los datos, valida. Si no es válido, se detiene.
     * Si está en modo edición, busca el índice del registro con findIndex
     * y actualiza el objeto con el operador spread (...).
     * Si es nuevo, lo agrega al array con push.
     * Finalmente guarda en localStorage, vuelve a renderizar y resetea el formulario.
     */
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        const datos = obtenerCampos();
        if (!validar(datos)) return;

        if (editando && idEditando) {
            // Buscar el índice del elemento que coincide con idEditando
            const idx = mascotas.findIndex(m => m.id === idEditando);
            if (idx !== -1) {
                // Mezcla los datos antiguos con los nuevos (sobrescribe los campos)
                mascotas[idx] = { ...mascotas[idx], ...datos, edad: parseInt(datos.edad, 10) };
            }
            // Salir del modo edición
            editando = false;
            idEditando = null;
            document.getElementById('btnGuardar').textContent = 'Guardar Registro';
        } else {
            // Agregar nueva mascota
            mascotas.push(crearMascota(datos));
        }

        guardarStorage();
        render();
        formulario.reset(); // Limpia los campos del formulario
    });
}

/* ==================== FILTRO DE BÚSQUEDA ==================== */

const buscador = document.getElementById('filtroTipo');
if (buscador) {
    /*
     * Cada vez que se escribe en el campo de filtro (evento 'input'),
     * se filtra el array mascotas.
     * Se convierten a minúsculas todas las cadenas a comparar.
     * filter devuelve un nuevo array con los elementos que cumplen la condición.
     * La condición: el texto escrito esté incluido en nombre, dueño, tipo o teléfono.
     * Luego se renderiza solo con los filtrados.
     */
    buscador.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        
        const filtrados = mascotas.filter(m => {
            const nombreM = m.nombreMascota.toLowerCase();
            const nombreD = m.nombreDueno.toLowerCase();
            const tipoM = m.tipo.toLowerCase();
            const telM = m.telefono.toString();

            return nombreM.includes(val) || 
                   nombreD.includes(val) || 
                   tipoM.includes(val) || 
                   telM.includes(val);
        });

        render(filtrados);
    });
}

/* ==================== ELIMINAR REGISTRO ==================== */

/*
 * Se asigna a window para ser accesible desde el onclick (aunque aquí se llama desde el evento delegado).
 * Pide confirmación con confirm() (ventana de diálogo).
 * Si el usuario acepta, elimina del array con filter (crea uno nuevo sin el id dado).
 * Si se estaba editando ese mismo registro, sale del modo edición.
 */
window.eliminar = (id) => {
    if (confirm('¿Seguro que quieres eliminar este registro?')) {
        mascotas = mascotas.filter(m => m.id !== id);
        
        // Si el registro eliminado era el que estábamos editando, reseteamos el formulario
        if (idEditando === id) {
            editando = false;
            idEditando = null;
            document.getElementById('btnGuardar').textContent = 'Guardar Registro';
            formulario.reset();
        }
        guardarStorage();
        render();
    }
};

/* ==================== PREPARAR EDICIÓN ==================== */

/*
 * Carga los datos del registro seleccionado en el formulario.
 * Cambia el texto del botón a "Actualizar Datos".
 * Establece las variables de edición.
 */
window.prepararEdicion = (id) => {
    const m = mascotas.find(m => m.id === id);
    if (!m) return;
    
    // Rellenar campos con los valores actuales
    document.getElementById('nombreMascota').value = m.nombreMascota;
    document.getElementById('nombreDueno').value = m.nombreDueno;
    if (document.getElementById('telefonoDueno')) {
        document.getElementById('telefonoDueno').value = m.telefono || '';
    }
    document.getElementById('edadMascota').value = m.edad;
    document.getElementById('tipoMascota').value = m.tipo;
    
    // Activar modo edición
    editando = true;
    idEditando = id;
    document.getElementById('btnGuardar').textContent = 'Actualizar Datos';
};