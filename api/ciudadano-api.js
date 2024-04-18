document.addEventListener("DOMContentLoaded", fetchData);

function fetchData() {
  fetch("https://hcpboca.ddns.net:3050/api/getCiudadanos/", {
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
                <p class="text-gray-600 text-hover-primary mb-1">${
                  post.paterno + " " + post.materno+ " " + post.nombre
                }</p>
            </td>
            <td>
                <p class="text-gray-600 text-hover-primary mb-1">${
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
                <p class="text-gray-600 text-hover-primary mb-1">${
                  post.telefono
                }</p>
            </td>
            <td>
                <p class="text-gray-600 text-hover-primary mb-1">${post.seccion
                  .map((x) => x.numero)
                  .join(", ")}</p>
            </td>
            <td>
                <p class="text-gray-600 text-hover-primary mb-1">${post.municipio[0]["nombre"]}</p>
            </td>
            <td>
                <a href="overview-movilizador.html?=${post.movilizador[0]._id}" class="text-gray-600 mb-1 text-hover-primary">${post.movilizador[0]['paterno']+" "+ post.movilizador[0]['materno']+" "+post.movilizador[0]['nombre']}</a>
            </td>
            <td>
                <a href="overview-lider.html?=${post.lider[0]['_id']}" class="text-gray-600 mb-1">${post.lider[0]['paterno']+" "+ post.lider[0]['materno']+" "+post.lider[0]['nombre']}</a>
            </td>
            <td>
                <!--begin::Badges-->
                <div class="badge badge-light-${post.voto ? 'success' : 'danger'}">${post.voto ? 'Votó' : 'Sin voto'}</div>
                <!--end::Badges-->
            </td>
        </tr>
    <!--end::Table body-->
            
        `;
    tableBody.innerHTML += row;
  });
}
