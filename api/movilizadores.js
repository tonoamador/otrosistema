"use strict";

// Improved token retrieval and expiration check
const getToken = () => {
  const tokenString = localStorage.getItem("token");
  return tokenString ? JSON.parse(tokenString) : {};
};

const isTokenExpired = (token) => {
  return token && token.exp < Date.now() / 1000;
};

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
        url: "https://hcpboca.ddns.net:3050/api/getMovilizadores/",
        error: (xhr, error) => {
          console.error("Error fetching data:", error);
        },
        dataSrc: (json) => json?.[0]?.movilizadores ?? [],
      },
      columns: [
        { data: null },
        {
          data: "_id",
          render: (id, type, { paterno, materno, nombre }) =>
            `<a href="overview-movilizador.html?=${id}" class="text-gray-600 mb-1 text-hover-primary">${paterno} ${materno} ${nombre}</a>`,
        },
        {
          data: null,
          render: ({ calle, direccion_ext, direccion_int, colonia, c_postal }) =>
            `${calle} ${direccion_ext} ${direccion_int}, ${colonia}, ${c_postal}`,
        },
        { data: "telefono" },
        {
          data: "seccion",
          render: (seccion) => seccion.map((x) => x.numero).join(", "),
        },
        { data: "municipio.nombre" },
        {
          data: "lider",
          render: (lider) => {
            const uniqueLiderIds = [...new Set(lider.map((x) => x._id))];
            const liderNames = lider.map((x) => `${x.paterno} ${x.materno} ${x.nombre}`);
            const uniqueLiderNames = [...new Set(liderNames)];
            return `<a href="overview-lider.html?=${uniqueLiderIds.join(", ")}" class="text-gray-600 mb-1 text-hover-primary">${uniqueLiderNames.join(", ")}</a>`;
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
    const filterSearch = document.querySelector('[data-kt-docs-table-filter="search"]');
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

// Document ready function
document.addEventListener("DOMContentLoaded", () => {
  KTDatatablesServerSide.init();
});
