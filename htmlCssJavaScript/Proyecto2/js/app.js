function cargarComponentes(id, archivo){
    const subcarpeta = window.location.pathname.includes("/pages/");
    const ruta = subcarpeta
    ? `../components/${archivo}`
    :`components/${archivo}`;

    fetch(ruta)
    .then((res=> res.text()))
    .then((html) => {
        document.getElementById(id).innerHTML = html
    })
    .catch(() => console.warn(`No se cargo el ${archivo}`));

}

document.addEventListener("DOMContentLoaded", () => {
    cargarComponentes("nav-container", "nav.html");
    cargarComponentes("footer-container", "footer.html");
})