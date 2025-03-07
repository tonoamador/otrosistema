document.addEventListener("DOMContentLoaded", fetchData);
var serverUrl = window.serverUrl;
const token = JSON.parse(localStorage.getItem("token"));
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
  const params = new URLSearchParams(window.location.search);
  const id = params.get("");
  fetch(serverUrl + "api/getRg/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((posts) => {
      document.querySelector("#nombreOVMov").innerHTML =
        posts.paterno + " " + posts.materno + " " + posts.nombre;
      document.querySelector("#direccionOVMov").innerHTML =
        posts.calle +
        " " +
        posts.direccion_ext +
        ", " +
        posts.direccion_int +
        ", " +
        posts.colonia +
        ", " +
        posts.c_postal;
      document.querySelector("#telefonoOVMov").innerHTML = posts.telefono;

      displayData(posts.rcs);
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
                  post.paterno + " " + post.materno + " " + post.nombre
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
            <a href="#" class="text-gray-600 text-hover-primary mb-1">${[
              ...new Set(
                post.casilla.flatMap((casillaItem) =>
                  casillaItem.seccion.map((section) => section.numero)
                )
              ),
            ].join(", ")}</a>
            </td>
            <td>
            <a href="#" class="text-gray-600 text-hover-primary mb-1">${[
              ...new Set(post.casilla.map((x) => x.nombre)),
            ].join(", ")}</a>
            </td>
            <td>
            <a href="https://www.google.com/maps/search/?api=1&query=${[
              ...new Set(
                post.casilla.flatMap((casillaItem) =>
                  casillaItem.seccion.map(
                    (section) => section.lat + "," + section.long
                  )
                )
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
