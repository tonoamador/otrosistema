window.serverUrl = 'https://interna.ddns.net:3050/';
document.addEventListener("DOMContentLoaded", function () {
  function loadContent(elementId, filePath) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          document.getElementById(elementId).innerHTML = xhr.responseText;
        } else {
          console.error("Error al cargar: " + filePath + " - " + xhr.status);
        }
      }
    };
    xhr.open("GET", filePath, true);
    xhr.send();
  }
  const token = JSON.parse(localStorage.getItem("token"));
  if (!token || token.user_type !== "admin") {
    loadContent("submenu", "submenu.html");
    document.getElementById("kt_app_sidebar_wrapper").style.display = 'none';
  } else {
    loadContent("menu", "menu.html");
    loadContent("submenu", "submenu.html");
  }
});
function doSomething() {
  localStorage.clear();
  window.location.replace("index.html");
}
