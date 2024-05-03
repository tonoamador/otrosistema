"use strict";
const token = JSON.parse(localStorage.getItem("token"));
import { serverUrl } from "./config.js";
var KTDatatablesServerSide = (function () {
  if (!token || token.user_type !== "admin" || isTokenExpired(token)) {
    window.location.replace("index.html");
  }
  function isTokenExpired(token) {
    const currentTime = Date.now() / 1000;
    return token.exp < currentTime;
  }
  var dt;

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
        url: serverUrl + "api/getLideres/",
        dataSrc: function (json) {
          return json[0].lideres;
        },
      },

      columns: [
        { data: null },
        {
          data: null,
          render: ({ _id, paterno, materno, nombre }) =>
            `<a href="overview-lider.html?=${_id}" class="text-gray-600 mb-1 text-hover-primary">${paterno} ${materno} ${nombre}</a>`,
        },
        {
          data: null,
          render: ({
            calle,
            direccion_ext,
            direccion_int,
            colonia,
            c_postal,
          }) =>
            `${calle} ${direccion_ext} ${direccion_int}, ${colonia}, ${c_postal}`,
        },
        { data: "telefono" },
        {
          data: null,
          render: ({ seccion }) =>
            [...new Set(seccion.map((x) => x.numero))].join(", "),
        },
        {
          data: null,
          render: ({ municipios }) =>
            [...new Set(municipios.map((x) => x.nombre))].join(", "),
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
