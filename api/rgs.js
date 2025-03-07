"use strict";

var serverUrl = window.serverUrl;

const token = JSON.parse(localStorage.getItem("token"));

const isTokenExpired = (token) => token && token.exp < Date.now() / 1000;

if (!token || token.user_type !== "admin" || isTokenExpired(token)) {
  window.location.replace("index.html");
}

const KTDatatablesServerSide = (() => {
  let dt;

  const initDatatable = () => {
    dt = $("#rg-table").DataTable({
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
        url: `${serverUrl}api/getRgs/`,
        dataSrc: "",
      },
      columns: [
        { data: null },
        {
          data: null,
          render: ({ _id, paterno, materno, nombre }) =>
            `<a href="overview-rg.html?=${_id}" class="text-gray-600 mb-1 text-hover-primary">${paterno} ${materno} ${nombre}</a>`,
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
            `${calle}${direccion_ext ? ' ' + direccion_ext : ''}${direccion_int ? ' ' + direccion_int : ''}${(direccion_ext || direccion_int) && (colonia || c_postal) ? ',' : ''}${colonia ? ' ' + colonia : ''}${c_postal ? ' ' + c_postal : ''}`
        },
        { data: "telefono" },
        {
          data: null,
          render: ({ secciones }) =>
            [...new Set(secciones.map(({ numero }) => numero))].join(", "),
        },
        {
          data: null,
          render: ({ municipios }) =>
            [...new Set(municipios.map(({ nombre }) => nombre))].join(", "),
        },
      ],
      columnDefs: [
        {
          targets: 0,
          orderable: false,
          render: (data) => `
            <div class="form-check form-check-sm form-check-custom form-check-solid">
                <input class="form-check-input" type="checkbox" value="${data}" />
            </div>`,
        },
      ],
    });

    dt.on("draw", () => {
      KTMenu.createInstances();
    });
  };

  const handleSearchDatatable = () => {
    const filterSearch = document.querySelector(
      '[data-kt-docs-table-filter="search"]'
    );
    filterSearch.addEventListener("keyup", (e) => {
      dt.search(e.target.value).draw();
    });
  };

  return {
    init: () => {
      initDatatable();
      handleSearchDatatable();
    },
  };
})();

KTUtil.onDOMContentLoaded(() => {
  KTDatatablesServerSide.init();
});
