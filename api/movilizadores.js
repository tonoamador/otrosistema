"use strict";

var serverUrl = window.serverUrl;

const getToken = () => JSON.parse(localStorage.getItem("token") || "{}");

const isTokenExpired = (token) => token && token.exp < Date.now() / 1000;

const token = getToken();

if (!token || token.user_type !== "admin" || isTokenExpired(token)) {
  window.location.replace("index.html");
}

const KTDatatablesServerSide = (() => {
  let dt;

  const initDatatable = () => {
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
        url: `${serverUrl}api/getMovilizadores/`,
        error: (xhr, error) => {
          console.error("Error fetching data:", error);
        },
        dataSrc: (json) => {
          return json?.movilizadores ?? [];
        },
      },
      columns: [
        { data: null },
        {
          data: null,
          render: ({ _id, paterno, materno, nombre }) =>
            `<a href="overview-movilizador.html?id=${_id}" class="text-gray-600 mb-1 text-hover-primary">${paterno} ${materno} ${nombre}</a>`,
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
            [...new Set(secciones.flatMap((s) => s.numero))].join(", "),
        },
        {
          data: null,
          render: ({ secciones }) =>
            [
              ...new Set(
                secciones.flatMap((s) => s.municipio.flatMap((m) => m.nombre))
              ),
            ].join(", "),
        },
        {
          data: "lider",
          render: (lider) => {
            const uniqueLiderIds = [...new Set(lider.map(({ _id }) => _id))];
            const liderNames = lider.map(
              ({ paterno, materno, nombre }) =>
                `${paterno} ${materno} ${nombre}`
            );
            const uniqueLiderNames = [...new Set(liderNames)];
            return `<a href="overview-lider.html?id=${uniqueLiderIds.join(
              ", "
            )}" class="text-gray-600 mb-1 text-hover-primary">${uniqueLiderNames.join(
              ", "
            )}</a>`;
          },
        },
      ],
      columnDefs: [
        {
          targets: 0,
          orderable: false,
          render: () =>
            `<div class="form-check form-check-sm form-check-custom form-check-solid">
               <input class="form-check-input" type="checkbox" />
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

document.addEventListener("DOMContentLoaded", () => {
  KTDatatablesServerSide.init();
});
