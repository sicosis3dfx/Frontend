/* Ubicación: /js/script.js */
let mascotas = JSON.parse(localStorage.getItem('veterinaria_db')) || [];
let editando = false;
let indiceEdit = null;

// --- LÓGICA CARRUSEL ---
const imgs = [
    "source/img/ie5uinl8cqaf1.png",
    "source/img/mmmaverick_4x.png",
    "source/img/megaman-background-j6rgyc9yuki4tog3_4x.png",
    "source/img/megamanx5banner_4x.png"
];
let idImg = 0;

function cambiarImg(n) {
    const el = document.getElementById("imagenCarrusel");
    if(!el) return;
    idImg = (idImg + n + imgs.length) % imgs.length;
    el.classList.add("fade-out");
    setTimeout(() => {
        el.src = imgs[idImg];
        el.classList.remove("fade-out");
    }, 500);
}

window.siguienteImagen = () => cambiarImg(1);
window.anteriorImagen = () => cambiarImg(-1);

// --- LÓGICA CRUD MASCOTAS ---
const render = (datos = mascotas) => {
    const tbody = document.querySelector('#tablaMascotas tbody');
    if(!tbody) return;
    tbody.innerHTML = '';
    datos.forEach((m, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="fw-bold text-primary">${m.n}</td>
            <td>${m.d}</td>
            <td>${m.e} años</td>
            <td><span class="badge bg-secondary">${m.t}</span></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-warning me-1" onclick="prepararEdicion(${i})">✏️</button>
                <button class="btn btn-sm btn-outline-danger" onclick="eliminar(${i})">🗑️</button>
            </td>`;
        tbody.appendChild(tr);
    });
};

const formulario = document.getElementById('formMascota');
if(formulario) {
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const n = document.getElementById('nombreMascota').value.trim();
        const d = document.getElementById('nombreDueno').value.trim();
        const eVal = document.getElementById('edadMascota').value;
        const t = document.getElementById('tipoMascota').value;

        // VALIDACIÓN: Expresión regular para solo letras, tildes y espacios
        const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

        if (!soloLetras.test(n)) {
            alert("El nombre de la mascota no puede contener números.");
            return;
        }

        if (!soloLetras.test(d)) {
            alert("El nombre del dueño no puede contener números.");
            return;
        }

        const item = { n, d, e: eVal, t };

        if(editando) {
            mascotas[indiceEdit] = item;
            editando = false;
            document.getElementById('btnGuardar').textContent = "Guardar Registro";
        } else {
            mascotas.push(item);
        }

        localStorage.setItem('veterinaria_db', JSON.stringify(mascotas));
        render();
        e.target.reset();
    });
}

const buscador = document.getElementById('filtroTipo');
if(buscador) {
    buscador.addEventListener('input', (e) => {
        const val = e.target.value.toLowerCase();
        render(mascotas.filter(m => m.t.toLowerCase().includes(val)));
    });
}

window.eliminar = (i) => {
    if(confirm("¿Seguro que quieres eliminar este registro?")) {
        mascotas.splice(i, 1);
        localStorage.setItem('veterinaria_db', JSON.stringify(mascotas));
        render();
    }
};

window.prepararEdicion = (i) => {
    const m = mascotas[i];
    document.getElementById('nombreMascota').value = m.n;
    document.getElementById('nombreDueno').value = m.d;
    document.getElementById('edadMascota').value = m.e;
    document.getElementById('tipoMascota').value = m.t;
    editando = true;
    indiceEdit = i;
    document.getElementById('btnGuardar').textContent = "Actualizar Datos";
    window.scrollTo(0,0);
};

document.addEventListener('DOMContentLoaded', () => {
    render();
    setInterval(siguienteImagen, 6000);
});