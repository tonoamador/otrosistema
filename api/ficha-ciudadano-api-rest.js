"use strict";

var KTDatatablesServerSide = (function () {
  var table;
  var dt;
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
  var initDatatable = function () {
    dt = $("#rc-table").DataTable({
      searchDelay: 500,
      processing: true,
      serverSide: false,
      order: [[1, "desc"]],
      stateSave: true,
      select: {
        style: "multi",
        selector: 'td:first-child input[type="checkbox"]',
        className: "row-selected",
      },
      ajax: {
        type: "POST",
        url: "https://hcpboca.ddns.net:3050/api/getCiudadanos/",
        dataSrc: "",
      },

      columns: [
        { data: null },
        {
          data: null,
          render: function (data, type, row) {
            return row.paterno + " " + row.materno + " " + row.nombre;
          },
        },
        {
          data: "nombre",
          render: function (data, type, row) {
            return (
              row.calle +
              " " +
              row.direccion_ext +
              " " +
              row.direccion_int +
              ", " +
              row.colonia +
              ", " +
              row.c_postal
            );
          },
        },
        { data: "telefono" },
        {
          data: null,
          render: function (data, type, row) {
            return row.seccion.map((x) => x.numero).join(", ");
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return row.casilla.nombre;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return [...new Set(row.municipio.map((x) => x.nombre))].join(", ");
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="overview-movilizador.html?=${[
              ...new Set(row.movilizador.map((x) => x._id)),
            ].join(", ")}" class="text-gray-600 mb-1 text-hover-primary">${[
              ...new Set(
                row.movilizador.map(
                  (x) => `${x.paterno} ${x.materno} ${x.nombre}`
                )
              ),
            ].join(", ")}</a>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<a href="overview-lider.html?=${[
              ...new Set(row.lider.map((x) => x._id)),
            ].join(", ")}" class="text-gray-600 mb-1 text-hover-primary">${[
              ...new Set(
                row.lider.map((x) => `${x.paterno} ${x.materno} ${x.nombre}`)
              ),
            ].join(", ")}</a>`;
          },
        },
        {
          data: null,
          render: function (data, type, row) {
            return `<div class="badge badge-light-${
              row.voto ? "success" : "danger"
            }">${row.voto ? "Votó" : "Sin voto"}</div>`;
          },
        },
      ],
      columnDefs: [
        {
          targets: 0,
          orderable: false,
          render: function (data) {
            return `
                            <div class="form-check form-check-sm form-check-custom form-check-solid">
                                <input class="form-check-input" type="checkbox" value="${data}" />
                            </div>`;
          },
        },
      ],
    });

    table = dt.$;
    dt.on("draw", function () {
      KTMenu.createInstances();
    });
  };

  var handleSearchDatatable = function () {
    const filterSearch = document.querySelector(
      '[data-kt-docs-table-filter="search"]'
    );
    filterSearch.addEventListener("keyup", function (e) {
      dt.search(e.target.value).draw();
    });
  };

  return {
    init: function () {
      initDatatable();
      handleSearchDatatable();
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  KTDatatablesServerSide.init();
});
