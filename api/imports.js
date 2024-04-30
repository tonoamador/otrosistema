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

    loadContent("menu", "menu.html");
    loadContent("submenu", "submenu.html");
});