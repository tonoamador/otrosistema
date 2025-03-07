"use strict";

var serverUrl = window.serverUrl;

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
        url: `${serverUrl}api/getCiudadanos/`,
        dataSrc: "",
      },
      columns: [
        { data: null },
        {
          data: null,
          render: function(data, type, row, meta) {
            return meta.row + meta.settings._iDisplayStart + 1;
          }
        },
        {
          data: null,
          render: ({ paterno, materno, nombre }) =>
            `${paterno} ${materno} ${nombre}`,
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
            `${calle}${direccion_ext ? " " + direccion_ext : ""}${
              direccion_int ? " " + direccion_int : ""
            }${
              (direccion_ext || direccion_int) && (colonia || c_postal)
                ? ","
                : ""
            }${colonia ? " " + colonia : ""}${c_postal ? " " + c_postal : ""}`,
        },
        {
          data: null,
          render: ({ telefono }) => phoneCheck(telefono),
        },
        {
          data: null,
          render: ({ seccion }) =>
            seccion.map(({ numero }) => numero).join(", "),
        },
        { data: "casilla.nombre" },
        {
          data: null,
          render: ({ municipio }) =>
            [...new Set(municipio.map(({ nombre }) => nombre))].join(", "),
        },
        {
          data: null,
          render: ({ movilizador }) => generateLinkHTML(movilizador),
        },
        {
          data: null,
          render: ({ lider }) => generateLinkHTML(lider),
        },
        {
          data: null,
          render: ({ voto }) => generateBadgeHTML(voto),
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

  const validateToken = () => {
    const token = JSON.parse(localStorage.getItem("token"));
    if (!token || token.user_type !== "admin" || isTokenExpired(token)) {
      window.location.replace("index.html");
    }
  };

  const isTokenExpired = (token) => token.exp < Date.now() / 1000;

  const generateLinkHTML = (items) => {
    return `<a href="overview-${getType(items)}.html?id=${getIds(
      items
    )}" class="text-gray-600 mb-1 text-hover-primary">${getNames(items)}</a>`;
  };

  const phoneCheck = (phone) => {
    let phoneText = "";
    if (phone) {
      phoneText = phone;
    }
    return phoneText;
  };

  const getType = (items) =>
    items.length > 0
      ? items[0].user_type.startsWith("movilizador")
        ? "movilizador"
        : "lider"
      : "";

  const getIds = (items) =>
    [...new Set(items.map(({ _id }) => _id))].join(", ");

  const getNames = (items) =>
    [
      ...new Set(
        items.map(
          ({ paterno, materno, nombre }) => `${paterno} ${materno} ${nombre}`
        )
      ),
    ].join(", ");

  const generateBadgeHTML = (voto) =>
    `<div class="badge badge-light-${voto ? "success" : "danger"}">${
      voto ? "Votó" : "Sin voto"
    }</div>`;

  return {
    init: () => {
      initDatatable();
      handleSearchDatatable();
      validateToken();
    },
  };
})();

KTUtil.onDOMContentLoaded(() => {
  KTDatatablesServerSide.init();
});
