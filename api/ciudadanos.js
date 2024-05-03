"use strict";

const KTDatatablesServerSide = (() => {
  const dt = $("#rc-table").DataTable({
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
        render: ({ paterno, materno, nombre }) =>
          `${paterno} ${materno} ${nombre}`,
      },
      {
        data: null,
        render: ({ calle, direccion_ext, direccion_int, colonia, c_postal }) =>
          `${calle} ${direccion_ext} ${direccion_int}, ${colonia}, ${c_postal}`,
      },
      { data: "telefono" },
      {
        data: null,
        render: ({ seccion }) => seccion.map(({ numero }) => numero).join(", "),
      },
      { data: "casilla.nombre" },
      {
        data: null,
        render: ({ municipio }) =>
          [...new Set(municipio.map(({ nombre }) => nombre))].join(", "),
      },
      {
        data: null,
        render: ({ movilizador }) =>
          `<a href="overview-movilizador.html?=${[
            ...new Set(movilizador.map(({ _id }) => _id)),
          ].join(", ")}" class="text-gray-600 mb-1 text-hover-primary">${[
            ...new Set(
              movilizador.map(
                ({ paterno, materno, nombre }) =>
                  `${paterno} ${materno} ${nombre}`
              )
            ),
          ].join(", ")}</a>`,
      },
      {
        data: null,
        render: ({ lider }) =>
          `<a href="overview-lider.html?=${[
            ...new Set(lider.map(({ _id }) => _id)),
          ].join(", ")}" class="text-gray-600 mb-1 text-hover-primary">${[
            ...new Set(
              lider.map(
                ({ paterno, materno, nombre }) =>
                  `${paterno} ${materno} ${nombre}`
              )
            ),
          ].join(", ")}</a>`,
      },
      {
        data: null,
        render: ({ voto }) =>
          `<div class="badge badge-light-${voto ? "success" : "danger"}">${
            voto ? "Votó" : "Sin voto"
          }</div>`,
      },
    ],
    columnDefs: [
      {
        targets: 0,
        orderable: false,
        render: (data) =>
          `<div class="form-check form-check-sm form-check-custom form-check-solid">
            <input class="form-check-input" type="checkbox" value="${data}" />
          </div>`,
      },
    ],
  });

  const handleSearchDatatable = () => {
    const filterSearch = document.querySelector(
      '[data-kt-docs-table-filter="search"]'
    );
    filterSearch.addEventListener("keyup", (e) => {
      dt.search(e.target.value).draw();
    });
  };

  const validateToken = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token || token.user_type !== "admin" || isTokenExpired(token)) {
      window.location.replace("index.html");
    }
  };

  const isTokenExpired = (token) => token.exp < Date.now() / 1000;

  dt.on("draw", () => {
    KTMenu.createInstances();
  });

  return {
    init: () => {
      handleSearchDatatable();
      validateToken();
    },
  };
})();

KTUtil.onDOMContentLoaded(() => {
  KTDatatablesServerSide.init();
});
