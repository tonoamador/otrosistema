"use strict";

//Funcion Login
const token = JSON.parse(localStorage.getItem("token"));
if (
  !token ||
  (token.user_type !== "rc" && token.user_type !== "admin") ||
  isTokenExpired(token)
) {
  window.location.replace("index.html");
} else if (token.user_type !== "admin") {
  window.location.replace("index.html");
}

function isTokenExpired(token) {
  let currentTime = Date.now() / 1000;
  currentTime = currentTime.toFixed(0);
  return token.exp < currentTime;
}

var am5 = am5;
var serverUrl = window.serverUrl;
$.noConflict();
let fetchedData;
const params = new URLSearchParams(window.location.search);
const TownhallId = params.get("id");
let e = document.querySelector("#townhall");
e.setAttribute("data-id-townhall", TownhallId);
var dataSeccion;

var getVotosXSeccion = (function () {
  var el = document.getElementById("townhall");
  var idTownHall = el.getAttribute("data-id-townhall");
  var dataChart = [];
  let table;
  let dt;

  $.ajax({
    url: serverUrl + "api/getCasillasVotosBySeccion",
    dataType: "JSON",
    method: "POST",
    async: false,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      id: idTownHall,
    }),
    success: function (i) {
      e.innerHTML = i[0].numero;
      dataSeccion = i;

      i[0].casilla.forEach((c) => {
        dataChart.push({
          casilla: c.nombre,
          votos_x: c.conteo_casilla_og,
          votos_ng: c.conteo_casilla_ng,
          votos_no: c.faltan_casilla_ng,
          votos_total: c.conteo_casilla_og + c.conteo_casilla_ng,
        });
      });

      fetchedData = i[0].casilla;
    },
  }).done(function (result) {});

  am5.ready(function () {
    // Create root element
    var root = am5.Root.new("kt_amcharts_1");

    // Set themes
    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart

    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        paddingLeft: 0,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
      })
    );

    // Add legend

    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    // Create axes
    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "casilla",
        renderer: am5xy.AxisRendererY.new(root, {
          inversed: true,
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
          minorGridEnabled: true,
        }),
      })
    );

    yAxis.data.setAll(dataChart);

    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1,
          minGridDistance: 50,
        }),
        min: 0,
      })
    );

    function createSeries(field, name, color, fontColor) {
      var series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueXField: field,
          categoryYField: "casilla",
          sequencedInterpolation: true,
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "[bold]{name}[/]\n{categoryY}: {valueX}",
          }),
          fill: am5.color(color),
        })
      );

      series.columns.template.setAll({
        height: am5.p100,
        strokeOpacity: 0,
      });

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationX: 1,
          locationY: 0.5,
          sprite: am5.Label.new(root, {
            centerY: am5.p50,
            text: "{valueX}",
            populateText: true,
          }),
        });
      });

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationX: 1,
          locationY: 0.5,
          sprite: am5.Label.new(root, {
            centerX: am5.p100,
            centerY: am5.p50,
            text: "{name}",
            fill: am5.color(fontColor), // Set font color here
            populateText: true,
          }),
        });
      });

      series.data.setAll(dataChart);
      series.appear();

      return series;
    }

    createSeries("votos_x", "Votos X", "#FFFF00", "#000000");
    createSeries("votos_ng", "Votos NG", "#FF00FF", "#FFFFFF");
    createSeries("votos_no", "Votos Faltantes", "#808080", "#FFFFFF");
    createSeries("votos_total", "Votos Totales", "#000000", "#FFFFFF");

    // Add legend
    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
      })
    );

    legend.data.setAll(chart.series.values);

    // Add cursor
    var cursor = chart.set(
      "cursor",
      am5xy.XYCursor.new(root, {
        behavior: "zoomY",
      })
    );
    cursor.lineY.set("forceHidden", true);
    cursor.lineX.set("forceHidden", true);

    // Make stuff animate on load
    chart.appear(1000, 100);
  });

  var CreateTableSections = function () {
    const tableBody = document.querySelector("#tabla-votos-seccional");

    tableBody.innerHTML = "";

    let percent = 0;
    if (dataSeccion[0].esperados_seccion_ng != 0) {
      percent =
        (100 * dataSeccion[0].conteo_seccion_ng) /
        dataSeccion[0].esperados_seccion_ng;
      percent = percent.toFixed(2);
    }

    // var classPercent = percent = 0 ? "bg-light" : percent < 50 ? "bg-warning" : percent >=50 ? "bg-success" : "bg-light";
    let classPercent = "bg-light";
    if (percent < 50) {
      classPercent = "bg-warning";
    } else if (percent >= 50) {
      classPercent = "bg-success";
    }
    const x = dataSeccion[0].lideres
      .map(
        (lider) =>
          `<a href="overview-lider.html?id=${lider._id}" class="text-gray-600 mb-1 text-hover-primary">${lider.paterno} ${lider.materno} ${lider.nombre}</a>`
      )
      .join(", ");

    const row = `
    <tr>
    <td>${x}</td>
        <td>${dataSeccion[0].conteo_seccion_ng}</td>
        <td>${dataSeccion[0].conteo_seccion_og}</td>
        <td>${dataSeccion[0].faltan_seccion_ng}</td>
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

  var wscols = [
    { wch: 13 }, // "characters"
    { wch: 10 }, // "characters"
    { wch: 11 }, // "characters"
    { wch: 10 }, // "characters"
    { wch: 9 }, // "characters"
    { wch: 14 }, // "characters"
    // {wpx: 50}, // "pixels"
  ];

  worksheet["!cols"] = wscols;
  worksheet["!autofilter"] = { ref: "A1:G1" };

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      [
        "Sección",
        "Casilla",
        "Votos NG",
        "Votos X",
        "Faltan NG",
        "Movilizador",
        "Lider",
        "Porcentaje",
      ],
    ],
    { origin: "A1" }
  );
  let percent = 0;

  fetchedData.forEach((casilla) => {
    if (casilla.esperados_casilla_ng != 0) {
      percent =
        (100 * casilla.conteo_casilla_ng) / casilla.esperados_casilla_ng;
      percent = percent.toFixed(2);
    }

    const maxCount = Math.max(
      casilla.movilizadores.length,
      casilla.lideres.length
    );

    for (let i = 0; i < maxCount; i++) {
      const movilizador = casilla.movilizadores[i] || {};
      const lider = casilla.lideres[i] || {};

      XLSX.utils.sheet_add_aoa(
        worksheet,
        [
          [
            dataSeccion[0].numero,
            casilla.nombre,
            casilla.conteo_casilla_ng,
            casilla.conteo_casilla_og,
            casilla.faltan_casilla_ng,
            movilizador.paterno
              ? movilizador.paterno +
                " " +
                movilizador.materno +
                " " +
                movilizador.nombre +
                " (" +
                movilizador.telefono +
                ")"
              : "",
            lider.paterno
              ? lider.paterno +
                " " +
                lider.materno +
                " " +
                lider.nombre +
                " (" +
                lider.telefono +
                ")"
              : "",
            percent + "%",
          ],
        ],
        { origin: -1 }
      );
    }
  });

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
