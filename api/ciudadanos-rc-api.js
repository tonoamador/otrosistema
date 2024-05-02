"use strict";

// Class definition
var KTDatatablesServerSide = (function () {
  // Shared variables
  var table;
  var dt;
  var source;
  var filterPayment;
  const token = JSON.parse(localStorage.getItem("token"));
  
  
  function isTokenExpired(token) {
    const currentTime = Date.now() / 1000;
    return token.exp < currentTime;
  }
  if (
    !token ||
    (token.user_type !== "rc" && token.user_type !== "admin") ||
    isTokenExpired(token) ||
    token == undefined
  ) {
    window.location.replace("index.html");
  } else{
    var idCasilla = token.casilla._id
  } 

  var getData = function () {
    $.ajax({
      url: "https://hcpboca.ddns.net:3050/api/getCiudadanosByCasilla",
      contentType: "application/json",
      type: "POST",
      data: JSON.stringify({
        id: idCasilla
      }),
      success: data => {
        displayData(data)
        // data.forEach((d) => {
        //   console.log(d._id)
        //   displayData(d)
        // })
        initDatatable();
      }
    });
  };

  function displayData(posts) {
    const tableBody = document.querySelector("#contenido-tabla");
  
    // Limpiar cualquier fila existente en la tabla
    tableBody.innerHTML = "";
  
    // Iterar sobre los posts y agregarlos a la tabla
    posts.forEach((post) => {
      const row = `
              
          
          <tr>
              <td></td>
              <td>${post.paterno + " " + post.materno + " " + post.nombre}</td>
              <td>${post._id}</td>
          </tr>          
      <!--end::Table body-->
              
          `;
      tableBody.innerHTML += row;
    });
  }

  var initDatatable = function () {
    dt = $("#rc-table").DataTable({
      searchDelay: 500,
      processing: true,
      order: [[1, "desc"]],
      serverSide: false,
      drawCallback: function () {
        $('.dt-toolbar').parent().addClass('hidden')
      }
      // stateSave: true,
    })
    table = dt.$;
    dt.on("draw", function () {
      KTMenu.createInstances();
    });
  }

  // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
  var handleSearchDatatable = function () {
    const filterSearch = document.querySelector(
      '[data-kt-docs-table-filter="search"]'
    );
    filterSearch.addEventListener("keyup", function (e) {
      dt.search(e.target.value).draw();
    });
  };

  // Filter Datatable
  var handleFilterDatatable = () => {
    // Select filter options
    filterPayment = document.querySelectorAll(
      '[data-kt-docs-table-filter="payment_type"] [name="payment_type"]'
    );
    const filterButton = document.querySelector(
      '[data-kt-docs-table-filter="filter"]'
    );

    // Filter datatable on submit
    // filterButton.addEventListener('click', function () {
    //     // Get filter values
    //     let paymentValue = '';

    //     // Get payment value
    //     filterPayment.forEach(r => {
    //         if (r.checked) {
    //             paymentValue = r.value;
    //         }

    //         // Reset payment value if "All" is selected
    //         if (paymentValue === 'all') {
    //             paymentValue = '';
    //         }
    //     });

    //     // Filter datatable --- official docs reference: https://datatables.net/reference/api/search()
    //     dt.search(paymentValue).draw();
    // });
  };

  // Delete customer
  var handleDeleteRows = () => {
    // Select all delete buttons
    const deleteButtons = document.querySelectorAll(
      '[data-kt-docs-table-filter="delete_row"]'
    );

    deleteButtons.forEach((d) => {
      // Delete button on click
      d.addEventListener("click", function (e) {
        e.preventDefault();

        // Select parent row
        const parent = e.target.closest("tr");

        // Get customer name
        const customerName = parent.querySelectorAll("td")[1].innerText;

        // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
        Swal.fire({
          text: "Are you sure you want to delete " + customerName + "?",
          icon: "warning",
          showCancelButton: true,
          buttonsStyling: false,
          confirmButtonText: "Yes, delete!",
          cancelButtonText: "No, cancel",
          customClass: {
            confirmButton: "btn fw-bold btn-danger",
            cancelButton: "btn fw-bold btn-active-light-primary",
          },
        }).then(function (result) {
          if (result.value) {
            // Simulate delete request -- for demo purpose only
            Swal.fire({
              text: "Deleting " + customerName,
              icon: "info",
              buttonsStyling: false,
              showConfirmButton: false,
              timer: 2000,
            }).then(function () {
              Swal.fire({
                text: "You have deleted " + customerName + "!.",
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                customClass: {
                  confirmButton: "btn fw-bold btn-primary",
                },
              }).then(function () {
                // delete row data from server and re-draw datatable
                dt.draw();
              });
            });
          } else if (result.dismiss === "cancel") {
            Swal.fire({
              text: customerName + " was not deleted.",
              icon: "error",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              customClass: {
                confirmButton: "btn fw-bold btn-primary",
              },
            });
          }
        });
      });
    });
  };

  // Reset Filter
  var handleResetForm = () => {
    // Select reset button
    const resetButton = document.querySelector(
      '[data-kt-docs-table-filter="reset"]'
    );

    // Reset datatable
    resetButton.addEventListener("click", function () {
      // Reset payment type
      filterPayment[0].checked = true;

      // Reset datatable --- official docs reference: https://datatables.net/reference/api/search()
      dt.search("").draw();
    });
  };

  // Init toggle toolbar
  var initToggleToolbar = function () {
    // Toggle selected action toolbar
    // Select all checkboxes
    const container = document.querySelector("#rc-table");
    const checkboxes = container.querySelectorAll('[type="checkbox"]');

    // Select elements
    const deleteSelected = document.querySelector(
      '[data-kt-docs-table-select="delete_selected"]'
    );

    // Toggle delete selected toolbar
    checkboxes.forEach((c) => {
      // Checkbox on click event
      c.addEventListener("click", function () {
        setTimeout(function () {
          toggleToolbars();
        }, 50);
      });
    });

    // Deleted selected rows
    // deleteSelected.addEventListener('click', function () {
    //     // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
    //     Swal.fire({
    //         text: "Are you sure you want to delete selected customers?",
    //         icon: "warning",
    //         showCancelButton: true,
    //         buttonsStyling: false,
    //         showLoaderOnConfirm: true,
    //         confirmButtonText: "Yes, delete!",
    //         cancelButtonText: "No, cancel",
    //         customClass: {
    //             confirmButton: "btn fw-bold btn-danger",
    //             cancelButton: "btn fw-bold btn-active-light-primary"
    //         },
    //     }).then(function (result) {
    //         if (result.value) {
    //             // Simulate delete request -- for demo purpose only
    //             Swal.fire({
    //                 text: "Deleting selected customers",
    //                 icon: "info",
    //                 buttonsStyling: false,
    //                 showConfirmButton: false,
    //                 timer: 2000
    //             }).then(function () {
    //                 Swal.fire({
    //                     text: "You have deleted all selected customers!.",
    //                     icon: "success",
    //                     buttonsStyling: false,
    //                     confirmButtonText: "Ok, got it!",
    //                     customClass: {
    //                         confirmButton: "btn fw-bold btn-primary",
    //                     }
    //                 }).then(function () {
    //                     // delete row data from server and re-draw datatable
    //                     dt.draw();
    //                 });

    //                 // Remove header checked box
    //                 const headerCheckbox = container.querySelectorAll('[type="checkbox"]')[0];
    //                 headerCheckbox.checked = false;
    //             });
    //         } else if (result.dismiss === 'cancel') {
    //             Swal.fire({
    //                 text: "Selected customers was not deleted.",
    //                 icon: "error",
    //                 buttonsStyling: false,
    //                 confirmButtonText: "Ok, got it!",
    //                 customClass: {
    //                     confirmButton: "btn fw-bold btn-primary",
    //                 }
    //             });
    //         }
    //     });
    // });
  };

  // Toggle toolbars
  var toggleToolbars = function () {
    // Define variables
    const container = document.querySelector("#rc-table");
    const toolbarBase = document.querySelector(
      '[data-kt-docs-table-toolbar="base"]'
    );
    const toolbarSelected = document.querySelector(
      '[data-kt-docs-table-toolbar="selected"]'
    );
    const selectedCount = document.querySelector(
      '[data-kt-docs-table-select="selected_count"]'
    );

    // Select refreshed checkbox DOM elements
    const allCheckboxes = container.querySelectorAll('tbody [type="checkbox"]');

    // Detect checkboxes state & count
    let checkedState = false;
    let count = 0;

    // Count checked boxes
    allCheckboxes.forEach((c) => {
      if (c.checked) {
        checkedState = true;
        count++;
      }
    });

    // Toggle toolbars
    if (checkedState) {
      selectedCount.innerHTML = count;
      toolbarBase.classList.add("d-none");
      toolbarSelected.classList.remove("d-none");
    } else {
      toolbarBase.classList.remove("d-none");
      toolbarSelected.classList.add("d-none");
    }
  };

  // Public methods
  return {
    init: function () {
      
      getData();
      handleSearchDatatable();
      // initToggleToolbar();
      // handleFilterDatatable();
      // handleDeleteRows();
      // handleResetForm();
    },
  };
})();

// On document ready
KTUtil.onDOMContentLoaded(function () {
  KTDatatablesServerSide.init();
});
