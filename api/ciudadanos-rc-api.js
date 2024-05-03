"use strict";

var KTDatatablesServerSide = (function () {
  const token = JSON.parse(localStorage.getItem("token"));
  
  function isTokenExpired(token) {
    const currentTime = Date.now() / 1000;
    return token && token.exp < currentTime;
  }

  if (!token || (token.user_type !== "rc" && token.user_type !== "admin") || isTokenExpired(token)) {
    window.location.replace("index.html");
  } else {
    var idCasilla = token.casilla._id;
  }

  const getData = () => {
    $.ajax({
      url: "https://hcpboca.ddns.net:3050/api/getCiudadanosByCasilla",
      contentType: "application/json",
      type: "POST",
      data: JSON.stringify({ id: idCasilla }),
      success: data => {
        displayData(data);
        initDatatable();
      }
    });
  };

  const displayData = (posts) => {
    const tableBody = document.querySelector("#contenido-tabla");
    tableBody.innerHTML = "";
    posts.forEach((post) => {
      const row = `
        <tr>
          <td></td>
          <td>${post.paterno + " " + post.materno + " " + post.nombre}</td>
          <td>${post._id}</td>
        </tr>`;
      tableBody.innerHTML += row;
    });
  };

  const initDatatable = () => {
    const dt = $("#rc-table").DataTable({
      searchDelay: 500,
      processing: true,
      order: [[1, "desc"]],
      serverSide: false,
      drawCallback: function () {
        $('.dt-toolbar').parent().addClass('hidden');
        KTMenu.createInstances();
      }
    });
  };

  const handleSearchDatatable = () => {
    const filterSearch = document.querySelector('[data-kt-docs-table-filter="search"]');
    filterSearch.addEventListener("keyup", function (e) {
      dt.search(e.target.value).draw();
    });
  };

  const handleDeleteRows = () => {
    const deleteButtons = document.querySelectorAll('[data-kt-docs-table-filter="delete_row"]');
    deleteButtons.forEach((d) => {
      d.addEventListener("click", function (e) {
        e.preventDefault();
        const parent = e.target.closest("tr");
        const customerName = parent.querySelectorAll("td")[1].innerText;
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

  return {
    init: function () {
      getData();
      handleSearchDatatable();
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTDatatablesServerSide.init();
});
