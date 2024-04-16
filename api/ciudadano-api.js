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
    console.log(post);
    const row = `
            
        
        <tr>
            <td>
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input class="form-check-input" type="checkbox" value="1" />
                </div>
            </td>
            <td>
                <p class="text-gray-600 text-hover-primary mb-1">${
                  post.nombre + " " + post.paterno + " " + post.materno
                }</p>
            </td>
            <td>
                <a href="#" class="text-gray-600 text-hover-primary mb-1">${
                  post.calle +
                  " " +
                  post.direccion_ext +
                  " " +
                  post.direccion_int +
                  ", " +
                  post.colonia +
                  ", " +
                  post.c_postal
                }</a>
            </td>
            <td>
                <a href="#" class="text-gray-600 text-hover-primary mb-1">${
                  post.telefono
                }</a>
            </td>
            <td>
                <p class="text-gray-600 mb-1">${post.seccion["numero"]}</p>
            </td>
            <td>
                <p class="text-gray-600 mb-1">${post.municipio["nombre"]}</p>
            </td>
            <td>
                <a href="overview-movilizador.html?=${post.movilizador[0]['_id']}" class="text-gray-600 mb-1 text-hover-primary">${post.movilizador[0]['nombre']+" "+ post.movilizador[0]['paterno']+" "+post.movilizador[0]['materno']}</a>
            </td>
            <td>
                <a href="overview-lider.html?=" class="text-gray-600 mb-1">Santiago(Consultar)</a>
            </td>
            <td>
                <!--begin::Badges-->
                <div class="badge badge-light-danger">No votó</div>
                <!--end::Badges-->
            </td>
        </tr>
    <!--end::Table body-->
            
        `;
    tableBody.innerHTML += row;
  });
}
