document.addEventListener('DOMContentLoaded', fetchData);

function fetchData() {
    fetch('https://hcpboca.ddns.net:3050/api/getAllUsers/', {
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
            <td>
                <p class="text-gray-600 mb-1">Santiago</p>
            </td>
            <td>
                <!--begin::Badges-->
                <div class="badge badge-light-danger">No votó</div>
                <!--end::Badges-->
            </td>
            <td class="text-end">
                <a href="#" class="btn btn-sm btn-light btn-flex btn-center btn-active-light-primary" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">Opciones 
                <i class="ki-outline ki-down fs-5 ms-1"></i></a>
                <!--begin::Menu-->
                <div class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4" data-kt-menu="true">
                    <!--begin::Menu item-->
                    <div class="menu-item px-3">
                        <a href="apps/customers/view.html" class="menu-link px-3">View</a>
                    </div>
                    <!--end::Menu item-->
                    <!--begin::Menu item-->
                    <div class="menu-item px-3">
                        <a href="#" class="menu-link px-3" data-kt-customer-table-filter="delete_row">Delete</a>
                    </div>
                    <!--end::Menu item-->
                </div>
                <!--end::Menu-->
            </td>
        </tr>
    <!--end::Table body-->
            
        `;
        tableBody.innerHTML += row;
    });
}