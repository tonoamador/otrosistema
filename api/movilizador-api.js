document.addEventListener('DOMContentLoaded', fetchData);

function fetchData() {
    fetch('https://hcpboca.ddns.net:3050/api/getMovilizadores/', {
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
console.log(post)
        const row = `
            
        
        <tr>
            <td>
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input class="form-check-input" type="checkbox" value="1" />
                </div>
            </td>
            <td>
                <a href="#" class="text-gray-600 text-hover-primary mb-1">${post.username}</a>
            </td>
            <td>
                <a href="#" class="text-gray-600 text-hover-primary mb-1">123</a>
            </td>
            <td>
                <a href="#" class="text-gray-600 text-hover-primary mb-1">2291529343</a>
            </td>
            <td>
                <p class="text-gray-600 mb-1">123</p>
            </td>
            <td>
                <p class="text-gray-600 mb-1">Boca del Río</p>
            </td>
            <td>
                <p class="text-gray-600 mb-1">Juan</p>
            </td>
        </tr>
    <!--end::Table body-->
            
        `;
        tableBody.innerHTML += row;
    });
}