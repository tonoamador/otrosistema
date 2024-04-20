document.addEventListener('DOMContentLoaded', fetchData);

function fetchData() {
    fetch('https://hcpboca.ddns.net:3050/api/getRcs/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(posts => {
        displayData(posts);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
}

function displayData(posts) {
    const tableBody = document.querySelector('#contenido-tabla');

    // Limpiar cualquier fila existente en la tabla
    tableBody.innerHTML = '';

    // Iterar sobre los posts y agregarlos a la tabla
    posts.forEach(post => {
        const row = `
            
        
        <tr>
            <td>
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input class="form-check-input" type="checkbox" value="1" />
                </div>
            </td>
            <td>
                <a href="overview-rc.html?=${post._id}" class="text-gray-600 text-hover-primary mb-1">${
                    post.paterno + " " + post.materno+ " " + post.nombre
                  }</a>
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
                <p class="text-gray-600 mb-1">${post.seccion
                    .map((x) => x.numero)
                    .join(", ")}</p>
            </td>
            
            <td>
                <p class="text-gray-600 mb-1">${
                    post.casilla.nombre
                  }</p>
            </td>
            <td>
                <p class="text-gray-600 mb-1">${
                    [...new Set(post.municipios.map(x => x.nombre))].join(', ')
                  }</p>
            </td>
            <td>Ubicacion
            </td>
           
        </tr>
    <!--end::Table body-->
            
        `;
        tableBody.innerHTML += row;
    });
}