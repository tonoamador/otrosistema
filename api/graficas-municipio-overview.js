document.addEventListener("DOMContentLoaded", fetchData);
if (
  !token ||
  (token.user_type !== "admin") ||
  isTokenExpired(token)
) {
  window.location.replace("index.html");
}
function isTokenExpired(token) {
  const currentTime = Date.now() / 1000;
  return token.exp < currentTime;
}
function fetchData() {
  fetch("https://hcpboca.ddns.net:3050/api/getMovilizadores/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((posts) => {
      displayData(posts);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function displayData(posts) {
  const tableBody = document.querySelector("#contenido-tabla");

  // Limpiar cualquier fila existente en la tabla
  tableBody.innerHTML = "";

  // Iterar sobre los posts y agregarlos a la tabla
  posts.forEach((post) => {
    const row = `
            
        
        <tr>
            <td>
              <a href="grafica-municipio-seccional.html?=" class="text-gray-600 mb-1 text-hover-primary">*NUMERO DE SECCIONAL*</a>
            </td>
            <td>
              <a href="grafica-municipio-seccional.html?=" class="text-gray-600 mb-1 text-hover-primary">Consultar</a>
            </td>
            

        </tr>
    <!--end::Table body-->
            
        `;
    tableBody.innerHTML += row;
  });
}
