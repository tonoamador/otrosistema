document.addEventListener("DOMContentLoaded", fetchData);

function fetchData() {
  fetch("https://hcpboca.ddns.net:3050/api/getRcs/", {
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
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input class="form-check-input" type="checkbox" value="1" />
                </div>
            </td>
            <td>
                <p  class="text-gray-600 mb-1">${
                  post.paterno + " " + post.materno + " " + post.nombre
                }</p>
            </td>
            <td>
                <p class="text-gray-600 mb-1">${
                  post.calle +
                  " " +
                  post.direccion_ext +
                  " " +
                  post.direccion_int +
                  ", " +
                  post.colonia +
                  ", " +
                  post.c_postal
                }</p>
            </td>
            <td>
                <p class="text-gray-600 mb-1">${post.telefono}</p>
            </td>
            <td>
                <p class="text-gray-600 mb-1">${post.seccion
                  .map((x) => x.numero)
                  .join(", ")}</p>
            </td>
            
            <td>
                <p class="text-gray-600 mb-1">${post.casilla.nombre}</p>
            </td>
            <td>
                <p class="text-gray-600 mb-1">${[
                  ...new Set(post.municipios.map((x) => x.nombre)),
                ].join(", ")}</p>
            </td>
            
            <td>
            <a href="https://www.google.com/maps/search/?api=1&query=${[
              ...new Set(
                post.seccion.map((section) => section.lat + "," + section.long)
              ),
            ].join(
              ", "
            )}" class="btn btn-icon btn-primary" target="_blank"><i class="fas fa-search-location fs-4 "></i></a>
            </td>
           
        </tr>
    <!--end::Table body-->
            
        `;
    tableBody.innerHTML += row;
  });
}
