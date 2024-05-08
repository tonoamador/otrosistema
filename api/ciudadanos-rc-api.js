"use strict";
var serverUrl = window.serverUrl;
var dt;
var list = document.querySelector("#data-citizen");

var getCitizen = function (e) {
  let idCitizen;
  let nameCitizen;
  // let e = document.getElementById("btn-send-vote")
  idCitizen = e.getAttribute("data-citizen-id");
  nameCitizen = e.getAttribute("data-citizen-name");
  let btnHtml = $("#" + idCitizen + " .button-send");

  Swal.fire({
    title: "Enviar registro del votante:",
    html: "<p class='fs-1'>" + nameCitizen + "</p>",
    showCancelButton: true,
    confirmButtonText: "Contar Voto",
    cancelButtonText: "Cancelar",
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-primary",
    },
    preConfirm: async () => {
      try {
        const url = "https://hcpboca.ddns.net:3050/api/setVoto/";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: idCitizen,
          }),
        });
        if (!response.ok) {
          return Swal.showValidationMessage(`
            ${JSON.stringify(await response.json())}
          `);
        }
        return response.json();
      } catch (error) {
        Swal.showValidationMessage(`
          Request failed: ${error}
        `);
      }
    },
    // allowOutsideClick: () => !Swal.isLoading()
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        icon: "success",
        title: "Voto registrado",
        customClass: {
          confirmButton: "btn-primary",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          btnHtml.html(
            `<div class="badge badge-light-success disabled fs-5 fw-bold">Votó</div>`
          );
        }
      });
    }
  });
};

var sendVoteX = function (e) {
  const token = JSON.parse(localStorage.getItem("token"));
  const idCasilla = token.casilla._id;
  
  $.ajax({
    url: serverUrl + "api/CreateUser",
    contentType: "application/json",
    type: "PUT",
    data: JSON.stringify({
      user_type: "ciudadano_otro",
      __t: "ciudadano",
      casilla_id: idCasilla,
      voto: true,
    }),
    beforeSend: function () {
      // Activate indicator
      e.setAttribute("data-kt-indicator", "on");
    },
    success: function (result, status) {
      if (status == "success") {
        // Disable indicator after 1 seconds
        Swal.fire({
          icon: "success",
          title: "Voto registrado",
          customClass: {
            confirmButton: "btn-primary"
          }
        }).then((result) => {
          if(result.isConfirmed) {
            setTimeout(function() {
              e.removeAttribute("data-kt-indicator");
              $("#btn-vote-x").addClass("hidden")
              $("#search").focus(function() {
                $("#search").val("").trigger("keyup")
              })
            }, 1000);
          }
        })
        
      }
    },
  });
};

// Class definition
var KTDatatablesServerSide = (function () {
  // Shared variables
  var filterPayment;
  var citizensArray;
  const token = JSON.parse(localStorage.getItem("token"));
  const idCasilla = token.casilla._id;
  const nameCasilla = token.casilla.nombre;

  $("[data-casilla-name]").text(nameCasilla);

  function isTokenExpired(token) {
    const currentTime = Date.now() / 1000;
    return token && token.exp < currentTime;
  }

  var getData = function () {
    $.ajax({
      url: serverUrl + "api/getCiudadanosByCasilla",
      contentType: "application/json",
      type: "POST",
      data: JSON.stringify({ id: idCasilla }),
      success: (data) => {
        // citizensArray = data
        // console.log(citizensArray)

        list.innerHTML = "";
        data.forEach((d) => {
          // var btnClass = "btn-primary"
          // var btnText = "Contar Voto"
          var btnCount = `<button onclick="getCitizen(this)" id="btn-send-vote" data-citizen-id="${
            d._id
          }" data-citizen-name="${
            d.paterno + " " + d.materno + " " + d.nombre
          }" class="btn btn-sm btn-primary fs-5 fw-bold">Contar Voto</button>`;
          if (d.voto) {
            btnCount = `<div class="badge badge-light-success disabled fs-5 fw-bold">Votó</div>`;
          }
          const row = `
          <li data-name="${d.paterno + " " + d.materno + " " + d.nombre}">
              <div class="d-flex flex-stack item" id="${d._id}">
                <div class="symbol symbol-40px me-5">
                  <img src="assets/media/avatars/300-2.jpg" class="h-50 align-self-center" alt="" />
                </div>
                <div class="d-flex align-items-center flex-row-fluid flex-wrap">
                  <div class="flex-grow-1 me-2">
                    <p class="text-gray-800 text-hover-primary fs-6 fw-bold">${
                      d.paterno + " " + d.materno + " " + d.nombre
                    }</p>
                    
                  </div>
                  <div class="button-send">
                    ${btnCount}
                  </div>
                  
                </div>
              </div>
              <div class="separator separator-dashed my-4"></div>
          </li>
          `;
          list.innerHTML += row;
          // if(!d.voto){
          //   list.innerHTML += row;
          // }
        });
      },
    });
  };

  const displayData = (posts) => {
    const tableBody = document.querySelector("#contenido-tabla");
    tableBody.innerHTML = "";
    posts.forEach((post) => {
      var btnClass = "btn-primary";
      var btnText = "Contar Voto";
      if (post.voto) {
        btnClass = "btn-success disabled";
        btnText = "Votó";
      }
      const row = `
              
          
          <tr>
              <td></td>
              <td>${post.paterno + " " + post.materno + " " + post.nombre}</td>
              <td><button id="openModalVote" onclick="getCitizen()" data-citizen-id="${
                post._id
              }" data-citizen-name="${
        post.paterno + " " + post.materno + " " + post.nombre
      }" class="btn ${btnClass}" data-bs-toggle="modal" data-bs-target="#kt_modal_vote">${btnText}</button></td>
          </tr>          
      <!--end::Table body-->
              
          `;
      tableBody.innerHTML += row;
    });
  };

  // var initDatatable = function () {
  //   dt = $("#rc-table").DataTable({
  //     searchDelay: 500,
  //     processing: true,
  //     order: [[1, "desc"]],
  //     serverSide: false,
  //     drawCallback: function () {
  //       $('.dt-toolbar').parent().addClass('hidden')
  //     }
  //     // stateSave: true,
  //   })
  //   table = dt.$;
  //   dt.on("draw", function () {
  //     KTMenu.createInstances();
  //   });
  // }

  // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
  // var handleSearchDatatable = function () {
  //   const filterSearch = document.querySelector(
  //     '[data-kt-docs-table-filter="search"]'
  //   );
  //   filterSearch.addEventListener("keyup", function (e) {
  //     dt.search(e.target.value).draw();
  //   });
  // };

  const handleDeleteRows = () => {
    const deleteButtons = document.querySelectorAll(
      '[data-kt-docs-table-filter="delete_row"]'
    );
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
      // handleSearchDatatable();
      // initToggleToolbar();
      // handleFilterDatatable();
      // handleDeleteRows();
      // handleResetForm();
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTDatatablesServerSide.init();
});
