/*
 * script.js - Aquí está toda la lógica de la página.
 * Controla: las fotos que pasan solas, guardar mascotas, borrarlas y editarlas.
 */

/* ==================== CONFIGURACIÓN INICIAL ==================== */

/*
 * mascotas: es nuestra "lista oficial" de animales.
 * Intentamos leer lo que hay guardado en el disco duro del navegador (localStorage).
 * JSON.parse: traduce la lista de "idioma texto" a "idioma lista de programación".
 * Si la lista está vacía o es la primera vez, empezamos con una lista nueva [].
 */
let mascotas = JSON.parse(localStorage.getItem('veterinaria_db')) || [];

/* Estas variables sirven para avisarle al programa si estamos creando alguien nuevo o editando a alguien que ya existe. */
let editando = false;
let idEditando = null;

/* ==================== FOTOS QUE PASAN (CARRUSEL) ==================== */

/* Lista de fotos que tenemos guardadas en la carpeta de imágenes. */
const imgs = [
    "source/img/1.jpg",
    "source/img/2.jpg",
    "source/img/3.jpg",
    "source/img/4.jpg"
];

/* Es el número de la foto que se está viendo ahora (empieza en 0). */
let idImg = 0;

/* Función para cambiar la foto cuando apretamos las flechas. */
function cambiarImg(n) {
    const el = document.getElementById("imagenCarrusel");
    if (!el) return; // Si no hay fotos en esta página, no hagas nada.
    
    /* Esta cuenta matemática hace que cuando llegues a la última foto, la siguiente sea la primera otra vez. */
    idImg = (idImg + n + imgs.length) % imgs.length;
    
    /* Le ponemos un efecto de "fundido" (se vuelve transparente) para que el cambio no sea brusco. */
    el.classList.add("fade-out");
    
    /* Esperamos medio segundo (500ms) a que se ponga transparente para cambiar la foto y volver a mostrarla. */
    setTimeout(() => {
        el.src = imgs[idImg];              
        el.classList.remove("fade-out");   
    }, 500);
}

/* Dejamos estas funciones listas para que los botones de las flechas en el HTML las puedan usar. */
window.siguienteImagen = () => cambiarImg(1);
window.anteriorImagen = () => cambiarImg(-1);

/* ==================== CONTROL DEL FORMULARIO ==================== */

/* Función que va al formulario y recolecta todo lo que el usuario escribió, quitando espacios de sobra. */
function obtenerCampos() {
    return {
        nombreMascota: document.getElementById('nombreMascota').value.trim(),
        nombreDueno: document.getElementById('nombreDueno').value.trim(),
        telefono: document.getElementById('telefonoDueno')?.value.trim() || '',
        edad: document.getElementById('edadMascota').value.trim(),
        tipo: document.getElementById('tipoMascota').value
    };
}

/* Función "Guardia de Seguridad": revisa que no falte nada y que los datos sean correctos. */
function validar({ nombreMascota, nombreDueno, telefono, edad, tipo }) {
    let ok = true; 
  
    /* Antes de empezar, borramos todos los mensajes de error rojos que quedaron de la vez anterior. */
    document.querySelectorAll('.error-campo').forEach(e => e.textContent = '');

    /* Reglas para el nombre de la mascota y del dueño: que no sea una sola letra y que no lleve números. */
    if (nombreMascota.length < 2) {
        mostrarError('errorNombre', 'Mínimo 2 caracteres.');
        ok = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreMascota)) {
        mostrarError('errorNombre', 'Solo letras y espacios.');
        ok = false;
    }

    if (nombreDueno.length < 2) {
        mostrarError('errorDueno', 'Mínimo 2 caracteres.');
        ok = false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombreDueno)) {
        mostrarError('errorDueno', 'Solo letras y espacios.');
        ok = false;
    }

    /* Regla para la edad: tiene que ser un número entre 1 y 100. */
    const edadNum = parseInt(edad, 10);
    if (!edad || isNaN(edadNum) || edadNum < 1 || edadNum > 100) {
        mostrarError('errorEdad', 'Edad inválida (1-100).');
        ok = false;
    }

    if (!tipo) {
        mostrarError('errorTipo', 'Seleccione un tipo.');
        ok = false;
    }

    /* Regla para el teléfono: que tenga entre 8 y 15 números seguidos. */
    if (telefono !== undefined && !/^\d{8,15}$/.test(telefono)) {
        mostrarError('errorTelefono', 'Teléfono inválido (8-15 dígitos).');
        ok = false;
    }

    return ok;
}

/* Función para poner el texto rojo de error donde corresponda. */
function mostrarError(idSpan, mensaje) {
    const span = document.getElementById(idSpan);
    if (span) span.textContent = mensaje;
}

/* ==================== GUARDADO Y CREACIÓN ==================== */

/* Guarda nuestra lista de mascotas en la memoria del navegador. */
function guardarStorage() {
    /* Traducimos la lista de "idioma programa" a "idioma texto" para que el navegador la pueda guardar. */
    localStorage.setItem('veterinaria_db', JSON.stringify(mascotas));
}

/* Esta función fabrica una "ficha" nueva para una mascota. */
function crearMascota(datos) {
    return {
        id: Date.now(), // Le pone un código único basado en la hora exacta (milisegundos).
        nombreMascota: datos.nombreMascota,
        nombreDueno: datos.nombreDueno,
        telefono: datos.telefono || '',
        edad: parseInt(datos.edad, 10),
        tipo: datos.tipo
    };
}

/* ==================== DIBUJAR LA TABLA (RENDER) ==================== */

/* Esta función toma la lista de mascotas y la dibuja en la pantalla. */
function render(datos = mascotas) {
    const tbody = document.querySelector('#tablaMascotas tbody');
    if (!tbody) return; 
    
    tbody.innerHTML = ''; // Borramos lo que había antes para no repetir los nombres.
    
    /* Por cada mascota en nuestra lista, fabricamos una fila de la tabla. */
    datos.forEach(m => {
        const tr = document.createElement('tr');
        /* Aquí "armamos" la fila con los datos de la mascota y los botones de editar/borrar. */
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
        tbody.appendChild(tr); // Pegamos la fila terminada en la tabla.
    });
}

/* Cuando la página termina de cargar, activamos las funciones de los botones de la tabla. */
document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('#tablaMascotas tbody');
    if (tbody) {
        tbody.addEventListener('click', (e) => {
            /* Buscamos si el clic fue en un botón de editar o borrar. */
            const btn = e.target.closest('button');
            if (!btn) return; 
            
            const id = parseInt(btn.dataset.id, 10); // Obtenemos código de la mascota.
            
            if (btn.classList.contains('btn-editar')) prepararEdicion(id);
            if (btn.classList.contains('btn-eliminar')) eliminar(id);
        });
    }

    render(); // Dibujamos la lista apenas entramos.
    
    /* Configuración para que las fotos pasen solas cada 6 segundos. */
    setInterval(siguienteImagen, 6000);
});

/* ==================== BOTÓN GUARDAR ==================== */

const formulario = document.getElementById('formMascota');
if (formulario) {
    /* Cuando el usuario aprieta "Guardar Registro": */
    formulario.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página se recargue sola.
        const datos = obtenerCampos();
        if (!validar(datos)) return; // Si hay errores, no sigas.

        if (editando && idEditando) {
            /* Si estamos editando, buscamos a la mascota en la lista y cambiamos sus datos antiguos por los nuevos. */
            const idx = mascotas.findIndex(m => m.id === idEditando);
            if (idx !== -1) {
                mascotas[idx] = { ...mascotas[idx], ...datos, edad: parseInt(datos.edad, 10) };
            }
            editando = false;
            idEditando = null;
            document.getElementById('btnGuardar').textContent = 'Guardar Registro';
        } else {
            /* Si no estamos editando, simplemente agregamos a la mascota nueva al final de la lista. */
            mascotas.push(crearMascota(datos));
        }

        guardarStorage(); // Guardamos los cambios.
        render(); // Actualizamos la tabla en pantalla.
        formulario.reset(); // Limpiamos el formulario.
    });
}

/* ==================== FILTRAR / BUSCAR ==================== */

const buscador = document.getElementById('filtroTipo');
if (buscador) {
    /* Mientras el usuario escribe en el buscador: */
    buscador.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase(); // Lo que escribió el usuario en minúsculas.
        
        /* Creamos una lista temporal que solo tenga a las mascotas que coincidan con lo escrito. */
        const filtrados = mascotas.filter(m => {
            return m.nombreMascota.toLowerCase().includes(val) || 
                   m.nombreDueno.toLowerCase().includes(val) || 
                   m.tipo.toLowerCase().includes(val) || 
                   m.telefono.toString().includes(val);
        });

        render(filtrados); // Dibujamos solo los que encontramos.
    });
}

/* ==================== BORRAR UNA MASCOTA ==================== */

window.eliminar = (id) => {
    /* Preguntamos si está seguro antes de borrar. */
    if (confirm('¿Seguro que quieres eliminar este registro?')) {
        /* Filtramos la lista para dejar fuera a la mascota que queremos borrar. */
        mascotas = mascotas.filter(m => m.id !== id);
        
        /* Si estábamos editando justo a esa mascota, cancelamos la edición. */
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

/* ==================== EDITAR UNA MASCOTA ==================== */

window.prepararEdicion = (id) => {
    /* Buscamos a la mascota en la lista usando su código único. */
    const m = mascotas.find(m => m.id === id);
    if (!m) return;
    
    /* Ponemos sus datos actuales de vuelta en las cajitas del formulario para poder cambiarlos. */
    document.getElementById('nombreMascota').value = m.nombreMascota;
    document.getElementById('nombreDueno').value = m.nombreDueno;
    if (document.getElementById('telefonoDueno')) {
        document.getElementById('telefonoDueno').value = m.telefono || '';
    }
    document.getElementById('edadMascota').value = m.edad;
    document.getElementById('tipoMascota').value = m.tipo;
    
    /* Le avisamos al programa que ahora estamos en "Modo Edición". */
    editando = true;
    idEditando = id;
    document.getElementById('btnGuardar').textContent = 'Actualizar Datos';
};