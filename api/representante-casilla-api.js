document.addEventListener('DOMContentLoaded', fetchData, KTCustomersList);

// KTUtil.onDOMContentLoaded(function () {
//     KTCustomersList.init();
// });

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
                <p  class="text-gray-600 mb-1">${
                    post.paterno + " " + post.materno+ " " + post.nombre
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
                <p class="text-gray-600 mb-1">${
                    post.telefono
                  }</p>
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

function KTCustomersList() {
    var datatable;
    var table;

    // Private functions
    var initCustomerList = function () {
        // Set date data order
        const tableRows = table.querySelectorAll('tbody tr');

        // tableRows.forEach(row => {
        //     const dateRow = row.querySelectorAll('td');
        //     const realDate = moment(dateRow[5].innerHTML, "DD MMM YYYY, LT").format(); // select date from 5th column in table
        //     dateRow[5].setAttribute('data-order', realDate);
        // });

        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable({
            "info": false,
            'order': [],
            'columnDefs': [
                { orderable: false, targets: 0 }, // Disable ordering on column 0 (checkbox)
                { orderable: false, targets: 6 }, // Disable ordering on column 6 (actions)
            ]
        });

        // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
        datatable.on('draw', function () {
            // initToggleToolbar();
            // handleDeleteRows();
            // toggleToolbars();
            //KTMenu.init(); // reinit KTMenu instances 
        });
    }

    var handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-customer-table-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            datatable.search(e.target.value).draw();
        });
    }

    // Public methods
    initCustomerList();
    handleSearchDatatable();
}

// var KTCustomersList = function () {
//     var datatable;
//     var table;

//     // Private functions
//     var initCustomerList = function () {
//         // Set date data order
//         const tableRows = table.querySelectorAll('tbody tr');

//         // tableRows.forEach(row => {
//         //     const dateRow = row.querySelectorAll('td');
//         //     const realDate = moment(dateRow[5].innerHTML, "DD MMM YYYY, LT").format(); // select date from 5th column in table
//         //     dateRow[5].setAttribute('data-order', realDate);
//         // });

//         // Init datatable --- more info on datatables: https://datatables.net/manual/
//         datatable = $(table).DataTable({
//             "info": false,
//             'order': [],
//             'columnDefs': [
//                 { orderable: false, targets: 0 }, // Disable ordering on column 0 (checkbox)
//                 { orderable: false, targets: 6 }, // Disable ordering on column 6 (actions)
//             ]
//         });

//         // Re-init functions on every table re-draw -- more info: https://datatables.net/reference/event/draw
//         datatable.on('draw', function () {
//             // initToggleToolbar();
//             // handleDeleteRows();
//             // toggleToolbars();
//             //KTMenu.init(); // reinit KTMenu instances 
//         });
//     }

//     var handleSearchDatatable = () => {
//         const filterSearch = document.querySelector('[data-kt-customer-table-filter="search"]');
//         filterSearch.addEventListener('keyup', function (e) {
//             datatable.search(e.target.value).draw();
//         });
//     }

//     // Public methods
//     return {
//         init: function () {
//             table = document.querySelector('#kt_customers_table');
            
//             if (!table) {
//                 return;
//             }

//             initCustomerList();
//             handleSearchDatatable();

//         }
//     }
// }();