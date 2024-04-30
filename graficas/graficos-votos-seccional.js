"use strict";
var am5 = am5;
$.noConflict();
let fetchedData;
const params = new URLSearchParams(window.location.search);
const TownhallId = params.get("id");
let e = document.querySelector("#townhall");
e.setAttribute("data-id-townhall", TownhallId);

var getVotosXSeccion = (function () {
  var dataVotos;
  var el = document.getElementById("townhall");
  var idTownHall = el.getAttribute("data-id-townhall");
  var dataChart;
  var dataSecciones;
  let table;
  let dt;

  $.ajax({
    url: "https://hcpboca.ddns.net:3050/api/getVotosSeccion/",
    dataType: "JSON",
    method: "POST",
    async: false,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      id: idTownHall,
    }),
    success: function (i) {
      e.innerHTML = i.numero;
      dataSecciones = i;
      dataChart = [
        {
          votos: "Total Votos X",
          value: i.votos_b,
        },
        {
          votos: "Total Votos NG",
          value: i.votos_a,
        },
        {
          votos: "No han votado",
          value: i.total_a - i.votos_a,
        },
        {
          votos: "Total Votos General",
          value: i.total_votos,
        },
      ];
      fetchedData = i;
    },
  }).done(function (result) {});

  am5.ready(function () {
    var root = am5.Root.new("kt_amcharts_1");

    root.setThemes([am5themes_Animated.new(root)]);

    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
      })
    );

    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    var xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 30,
      minorGridEnabled: true,
    });

    xRenderer.labels.template.setAll({
      rotation: -50,
      centerY: am5.p50,
      centerX: am5.p100,
      paddingRight: 15,
    });

    var xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "votos",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {}),
      })
    );

    xRenderer.grid.template.set("visible", false);

    var yRenderer = am5xy.AxisRendererY.new(root, {});
    var yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        extraMax: 0.1,
        renderer: yRenderer,
      })
    );

    yRenderer.grid.template.setAll({
      strokeDasharray: [2, 2],
    });

    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        sequencedInterpolation: true,
        categoryXField: "votos",
      })
    );

    series.columns.template.setAll({
      cornerRadiusTL: 5,
      cornerRadiusTR: 5,
      strokeOpacity: 0,
      tooltipText: "{votos}, {valueY}",
      width: am5.percent(90),
      tooltipY: 0,
      strokeOpacity: 0,
    });

    series.columns.template.adapters.add("fill", (fill, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", (stroke, target) => {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.bullets.push(function () {
      return am5.Bullet.new(root, {
        locationY: 1,
        sprite: am5.Label.new(root, {
          text: "{valueYWorking.formatNumber('#.')}",
          fill: root.interfaceColors.get("alternativeText"),
          centerY: 0,
          centerX: am5.p50,
          populateText: true,
        }),
      });
    });

    xAxis.data.setAll(dataChart);
    series.data.setAll(dataChart);

    series.appear(1000);
    chart.appear(1000, 100);
  });

  var CreateTableSections = function () {
    const tableBody = document.querySelector("#tabla-votos-seccional");

    tableBody.innerHTML = "";

    let percent = 0;
    if (dataSecciones.total_a != 0) {
      percent = (100 * dataSecciones.votos_a) / dataSecciones.total_a;
    }

    // var classPercent = percent = 0 ? "bg-light" : percent < 50 ? "bg-warning" : percent >=50 ? "bg-success" : "bg-light";
    let classPercent = "bg-light";
    if (percent < 50) {
      classPercent = "bg-warning";
    } else if (percent >= 50) {
      classPercent = "bg-success";
    }

    const row = `
    <tr>
    <td><a href="overview-lider.html?=${dataSecciones.lider._id}">${
      dataSecciones.lider.nombre +
      " " +
      dataSecciones.lider.paterno +
      " " +
      dataSecciones.lider.materno
    }</a></td>
        <td>${dataSecciones.votos_a}</td>
        <td>${dataSecciones.votos_b}</td>
        <td>${dataSecciones.total_a - dataSecciones.votos_a}</td>
        <td>
            <div class="d-flex align-items-center w-200px w-sm-300px flex-column mt-3">
                <div class="d-flex justify-content-between w-100 mt-auto mb-2">
                    <span class="fw-bold fs-6">${percent}%</span>
                </div>
                <div class="h-5px mx-3 w-100 bg-secondary mb-3">
                    <div class="${classPercent} rounded h-5px" role="progressbar" style="width: ${percent}%;" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
        </td>
    </tr>
`;

    tableBody.insertAdjacentHTML("beforeend", row);

    dt = $("#kt_table_townhall").DataTable({
      searchDelay: 500,
      processing: true,
      stateSave: true,
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
      CreateTableSections();
      handleSearchDatatable();
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  getVotosXSeccion.init();
});

function exportToExcel() {
  if (!fetchedData) {
    console.error("No hay datos aún.");
    return;
  }
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([]);

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [["Votos NG", "Votos X", "Faltan NG", "Lider", "Porcentaje"]],
    { origin: "A1" }
  );
  let percent = 0;
  if (fetchedData.total_a != 0) {
    percent = (100 * fetchedData.votos_a) / fetchedData.total_a;
  }
  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      [
        fetchedData.numero,
        fetchedData.votos_a,
        fetchedData.votos_b,
        fetchedData.total_a - fetchedData.votos_a,
        fetchedData.lider.paterno +
          " " +
          fetchedData.lider.materno +
          " " +
          fetchedData.lider.nombre,
        percent + "%",
      ],
    ],
    { origin: -1 }
  );

  XLSX.utils.book_append_sheet(workbook, worksheet, "Votación");

  const filename =
    "Votación por Seccional " +
    (new Date().getHours() % 12 || 12) +
    "_" +
    new Date().getMinutes().toString().padStart(2, "0") +
    (new Date().getHours() >= 12 ? "PM" : "AM") +
    ".xlsx";
  XLSX.writeFile(workbook, filename);
}
