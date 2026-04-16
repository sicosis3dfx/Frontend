function toggleMenu() {
      const menu = document.getElementById("menuOpciones");
      menu.classList.toggle("activo");
    }

const imagenes = [
  "source/img/ie5uinl8cqaf1.png",
  "source/img/mmmaverick_4x.png",
  "source/img/megaman-background-j6rgyc9yuki4tog3_4x.png",
  "source/img/megamanx5banner_4x.png"
];
let indice = 0;

function actualizarImagen() {
  const img = document.getElementById("imagenCarrusel");

  img.classList.add("fade-out");

  setTimeout(() =>{
    img.src = imagenes[indice];

    img.classList.remove("fade-out")
  }, 500);
}

function siguienteImagen() {
  indice = (indice + 1) % imagenes.length;
  actualizarImagen();
}

function anteriorImagen() {
  indice = (indice - 1 + imagenes.length) % imagenes.length;
  actualizarImagen();
}

function mostrar(id) {
  const secciones = document.querySelectorAll("#contenido > *");
  secciones.forEach(sec => sec.classList.add("oculto"));
  document.getElementById(id).classList.remove("oculto");
}

function iniciarCarruselAutomatico(){
  setInterval(() =>{
    siguienteImagen();    
  }, 3000);

}

let modoEdicion = false;
let indiceEdicion = null;

document.addEventListener('DOMContentLoaded', () => {
  actualizarImagen();
  iniciarCarruselAutomatico();

  const form = document.getElementById('formContacto');
  const mensaje = document.getElementById('mensajeGuardado');

  function obtenerContactos(){
    const contactos = localStorage.getItem('contactos');
    return contactos ? JSON.parse(contactos) : [];    
  }

  function mostrarContactos(){
    contactos = obtenerContactos();
    if(contactos.length == 0){
      mensaje.textContent = "No hay Contactos guardados.";
      return;
    }

    mensaje.innerHTML = "<strong>Contactos Guardado:</strong><ul>" +
    contactos.map(c => `<li>${c.nombre} (${c.correo})</li>`).join('') + "</ul>";
  }

  form.addEventListener('submit', (e) =>{
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;

    const contactos = obtenerContactos();
    contactos.push({nombre, correo});

    localStorage.setItem('contactos', JSON.stringify(contactos));

    mensaje.textContent = "¡Contacto guardado exitosamente!";

    form.reset();
    mostrarContactos();
  });

  mostrarContactos();  

  function cargarTablaContactos(){
    const tabla = document.getElementById('tablaContactos').querySelector('tbody');
    tabla.innerHTML = '';

    const contactos = obtenerContactos();
    contactos.forEach((c, index) => {
      const fila = document.createElement('tr');

      fila.innerHTML = `
      <td>${index + 1}</td>
      <td>${c.nombre}</td>
      <td>${c.correo}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="eliminarContacto(${index})" >Eliminar</button>
      </td>
      `;

      tabla.appendChild(fila);
    });
  }

  function cargarTablaEditar(){
    const tabla = document.getElementById('tablaEditar').querySelector('tbody');
    tabla.innerHTML = '';

    const contactos = obtenerContactos();
    contactos.forEach((c, index) =>{
      const fila = document.createElement('tr');
      fila.innerHTML = `
      <td>${index + 1 }</td>
      <td>${c.nombre}</td>
      <td>${c.correo}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editarContacto" >Editar Contacto</button>
      </td>
      `;
      tabla.appendChild(fila);
    });
  }

  document.getElementById('menuOpciones').addEventListener('click', (e) =>{
    if (e.target.innerText === 'Eliminar Contactos'){
      cargarTablaContactos();
    }else if (e.target.innerHTML === 'Editar Contacto'){
      cargarTablaEditar();
    }
  });

  window.eliminarContacto = function(index) {
    const contactos = obtenerContactos();
    contactos.splice(index, 1);
    localStorage.setItem('contactos', JSON.stringify(contactos));
    cargarTablaContactos();
  };

  window.editarContacto = function(index){
    const contactos = obtenerContactos();
    document.getElementById('nombre').value = contactos[index].nombre;
    document.getElementById('correo').value = contactos[index].correo;

    modoEdicion = true;
    indiceEdicion = index;
    mostrar('header');
  };
});