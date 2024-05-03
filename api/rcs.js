"use strict";

var serverUrl = window.serverUrl;
const { user_type: userType, exp: tokenExp } =
JSON.parse(localStorage.getItem("token")) || {};

const isTokenExpired = (exp) => exp < Date.now() / 1000;

if (!userType === "admin" || isTokenExpired(tokenExp)) {
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
        url: `${serverUrl}api/getRcs/`,
        dataSrc: "",
      },
      columns: [
        { data: null },
        {
          data: null,
          render: ({ _id, paterno, materno, nombre }) =>
            `<a href="overview-rc-admin.html?id=${_id}" class="text-gray-600 mb-1 text-hover-primary">${paterno} ${materno} ${nombre}</a>`,
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
        {
          data: null,
          render: ({ telefono }) => telefono,
        },
        {
          data: null,
          render: ({ seccion }) =>
            seccion.map(({ numero }) => numero).join(", "),
        },
        {
          data: null,
          render: ({ casilla: { nombre } }) => nombre,
        },
        {
          data: null,
          render: ({ municipios }) =>
            [...new Set(municipios.map(({ nombre }) => nombre))].join(", "),
        },
        {
          data: null,
          render: ({ rg: { _id, paterno, materno, nombre } }) =>
            `<a href="overview-rg.html?=${_id}" class="text-gray-600 mb-1 text-hover-primary">${paterno} ${materno} ${nombre}</a>`,
        },
        {
          data: null,
          render: ({ seccion }) =>
            `<a href="https://www.google.com/maps/search/?api=1&query=${[
              ...new Set(seccion.map(({ lat, long }) => `${lat},${long}`)),
            ].join(
              ", "
            )}" class="btn btn-icon btn-primary" target="_blank"><i class="fas fa-search-location fs-4 "></i></a>`,
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

    dt.on("draw", () => KTMenu.createInstances());
  };
  const handleSearchDatatable = () => {
    const filterSearch = document.querySelector(
      '[data-kt-docs-table-filter="search"]'
    );
    filterSearch.addEventListener("keyup", (e) =>
      dt.search(e.target.value).draw()
    );
  };

  return {
    init: () => {
      initDatatable();
      handleSearchDatatable();
    },
  };
})();

KTUtil.onDOMContentLoaded(() => KTDatatablesServerSide.init());
