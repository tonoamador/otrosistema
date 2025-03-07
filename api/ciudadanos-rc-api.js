"use strict";

//Funcion Login
const token = JSON.parse(localStorage.getItem("token"));
if (
  !token ||
  (token.user_type !== "rc" && token.user_type !== "admin") ||
  isTokenExpired(token)
) {
  window.location.replace("index.html");
}

function isTokenExpired(token) {
  let currentTime = Date.now() / 1000;
  currentTime = currentTime.toFixed(0);
  return token.exp < currentTime;
}

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
        const url = `${serverUrl}api/setVoto/`;
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
  const token = JSON.parse(localStorage.getItem("token"));
  const idCasilla = token.casilla._id;
  const nameCasilla = token.casilla.nombre;

  $("[data-casilla-name]").text(nameCasilla);

  var getData = function () {
    $.ajax({
      url: serverUrl + "api/getCiudadanosByCasilla",
      contentType: "application/json",
      type: "POST",
      data: JSON.stringify({ id: idCasilla }),
      success: (data) => {

        list.innerHTML = "";
        const fragment = document.createDocumentFragment();

        data.forEach((d) => {
          const citizenName = [d.numero, d.paterno, d.materno, d.nombre]
  .filter(Boolean) // Filtra valores undefined, null o vacíos
  .join(" "); // Une los valores con un espacio

          
          const btnCount = d.voto
            ? `<div class="badge badge-light-success disabled fs-5 fw-bold">Votó</div>`
            : `<button onclick="getCitizen(this)" data-citizen-id="${d._id}" data-citizen-name="${citizenName}" class="btn btn-sm btn-primary fs-5 fw-bold">Contar Voto</button>`;
        
          const li = document.createElement("li");
          li.setAttribute("data-name", citizenName);
          li.innerHTML = `
            <div class="d-flex flex-stack item" id="${d._id}">
              <div class="symbol symbol-40px me-5">
                <img src="assets/media/avatars/300-2.jpg" class="h-50 align-self-center" alt="" />
              </div>
              <div class="d-flex align-items-center flex-row-fluid flex-wrap">
                <div class="flex-grow-1 me-2">
                  <p class="text-gray-800 text-hover-primary fs-6 fw-bold">${citizenName}</p>
                </div>
                <div class="button-send">${btnCount}</div>
              </div>
            </div>
            <div class="separator separator-dashed my-4"></div>
          `;
        
          fragment.appendChild(li);
        });
        
        list.appendChild(fragment); // Agrega todos los elementos de una sola vez
        
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
              <td>${ post.numero +" "+ post.paterno + " " + post.materno + " " + post.nombre}</td>
              <td><button id="openModalVote" onclick="getCitizen()" data-citizen-id="${
                post._id
              }" data-citizen-name="${
                post.numero +" "+ post.paterno + " " + post.materno + " " + post.nombre
      }" class="btn ${btnClass}" data-bs-toggle="modal" data-bs-target="#kt_modal_vote">${btnText}</button></td>
          </tr>          
      <!--end::Table body-->
              
          `;
      tableBody.innerHTML += row;
    });
  };


 

  return {
    init: function () {
      getData();
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTDatatablesServerSide.init();
});
