function cargarNav(){
    let rutaAbsoluta = window.location.pathname.includes("/pages/")
    ? "../components/nav.html"
    : "components/nav.html";

    fetch(rutaAbsoluta)
    .then(res => res.text())
    .then(data => {
        document.getElementById("nav-container").innerHTML = data
    })
}

function cargarFooter(){
    let rutaAbsoluta = window.location.pathname.includes("/pages/")
    ? "../components/footer.html"
    : "components/footer.html";

    fetch(rutaAbsoluta)
    .then(res => res.text())
    .then(data => {
        document.getElementById("footer-container").innerHTML = data
    })
}

document.addEventListener("DOMContentLoaded", () => {
    cargarNav();
    cargarFooter();
})