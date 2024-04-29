const toastElement = document.getElementById("kt_docs_toast_toggle");
const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
var state = false;
const token = JSON.parse(localStorage.getItem("token"));
if (
  !token ||
  (token.user_type !== "rc" && token.user_type !== "admin") ||
  isTokenExpired(token)
) {
  window.location.replace("index.html");
}

function isTokenExpired(token) {
  const currentTime = Date.now() / 1000;
  return token.exp < currentTime;
}
$(function() {
  $("#sameNavbar").load("./navbar.html");
});
document.querySelector("#nombre").textContent =
  token.paterno + " " + token.materno + " " + token.nombre;
document.querySelector("#seccion").textContent = token.casilla.seccion.numero;
document.querySelector("#municipio").textContent =
  token.casilla.seccion.municipio.nombre;
document.querySelector("#casilla").textContent = token.casilla.nombre;
if (window.location.hash) {
  const params = new URLSearchParams(window.location.search);
  const idRc = params.get("id");
}



function OpenBox() {
  const id = token.casilla._id;
  $.ajax({
    url: `https://hcpboca.ddns.net:3050/api/openCasilla/${id}`,
    dataType: "JSON",
    method: "POST",
    async: false,
    success: function (i) {
      state = i.data["open"];
    },
  });
  return state;
}

function loadingPage() {
  const loadingEl = document.createElement("div");
  loadingEl.className = "page-loader flex-column bg-dark bg-opacity-25";
  loadingEl.innerHTML = `
        <span class="spinner-border text-primary" role="status"></span>
        <span class="text-gray-800 fs-6 fw-semibold mt-5">Cargando...</span>
    `;
  document.body.prepend(loadingEl);
  KTApp.showPageLoading();
  setTimeout(function () {
    KTApp.hidePageLoading();
    loadingEl.remove();
    if (!window.location.hash) {
      window.location.replace("ciudadanos-rc.html");
    }
  }, 3000);
}
