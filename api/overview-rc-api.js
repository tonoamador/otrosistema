const toastElement = document.getElementById("kt_docs_toast_toggle");
const toast = bootstrap.Toast.getOrCreateInstance(toastElement);
var state = false;
var serverUrl = window.serverUrl;
//Funcion Login
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

document.querySelector("#nombre").innerHTML =
  token.paterno + " " + token.materno + " " + token.nombre;
document.querySelector("#seccion").innerHTML = token.casilla.seccion.numero;
document.querySelector("#municipio").innerHTML =
  token.casilla.seccion.municipio.nombre;
document.querySelector("#casilla").innerHTML = token.casilla.nombre;
console.log(token)
if(token.casilla.open){
  window.location.replace("ciudadanos-rc.html")
}


function OpenBox() {
  const id = token.casilla._id;
  $.ajax({
    url: `${serverUrl}api/openCasilla/${id}`,
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
