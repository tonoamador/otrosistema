document.addEventListener("DOMContentLoaded", fetchData);

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
              <p class="text-gray-600 mb-1 text-hover-primary">*CASILLA*</a>
            </td>
            <td>
              <div class="badge badge-light-success">Abierta</div>
            </td>
            

        </tr>
    <!--end::Table body-->
            
        `;
    tableBody.innerHTML += row;
  });
}
