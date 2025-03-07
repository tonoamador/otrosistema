"use strict";

//Funcion Login
const token = JSON.parse(localStorage.getItem("token"));
if (!token || (token.user_type !== "rc" && token.user_type !== "admin") || isTokenExpired(token)) {
  window.location.replace("index.html");
} else if (token.user_type !== "admin") {
  window.location.replace("index.html");
}

function isTokenExpired(token) {
  let currentTime = Date.now() / 1000;
  currentTime=currentTime.toFixed(0)
  return token.exp < currentTime;
}

var am5 = am5;
$.noConflict();
var serverUrl = window.serverUrl;
let fetchedData;
var getVotosXMunicipio = (function () {
  var dataChart;
  var dataTownhall;
  let table;
  let dt;

  $.ajax({
    url: serverUrl + "api/getTotalCasillasAbiertas/",
    dataType: "JSON",
    method: "POST",
    async: false,
    contentType: "application/json; charset=utf-8",
    success: function (i) {
      dataTownhall = i[0].municipios;
      dataChart = [
        {
          casillas: "Casillas Abiertas",
          value: i[0].abiertas_general,
        },
        {
          casillas: "Casillas Cerradas",
          value: i[0].cerradas_general,
        },
      ];
      fetchedData = i[0].municipios;
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
        categoryField: "casillas",
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
        categoryXField: "casillas",
      })
    );

    series.columns.template.setAll({
      cornerRadiusTL: 5,
      cornerRadiusTR: 5,
      strokeOpacity: 0,
      tooltipText: "{casillas}, {valueY}",
      width: am5.percent(90),
      tooltipY: 0,
      strokeOpacity: 0,
    });

    var customColors = [
      am5.color("#00FF001"), // Verde
      am5.color("#808080"), // Gris
    ];
    series.columns.template.adapters.add("fill", function(fill, target) {
      var index = series.columns.indexOf(target); // Obtiene el índice de la columna
      return customColors[index % customColors.length]; // Asigna el color de la paleta basado en el índice
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
    const tableBody = document.querySelector("#tabla-casillas-municipio");

    tableBody.innerHTML = "";

    dataTownhall.forEach((townhall) => {
      let percent = 0;
      if (townhall.total_casillas != 0) {
        percent = (100 * townhall.abiertas_total) / townhall.total_casillas;
        percent=percent.toFixed(2)
      }

      let classPercent = "bg-light";
      if (percent < 50) {
        classPercent = "bg-warning";
      } else if (percent >= 50) {
        classPercent = "bg-success";
      }

      const row = `
                <tr>
                    <td><a href="grafica-municipio-seccional.html?id=${townhall._id}">${townhall.nombre}</a></td>
                    <td>${townhall.abiertas_total}</td>
                    <td>${townhall.cerradas_total}</td>
                    <td>${townhall.total_casillas}</td>
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
      tableBody.innerHTML += row;
    });

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
  getVotosXMunicipio.init();
});

function exportToExcel() {
  if (!fetchedData) {
    console.error("No hay datos aún.");
    return;
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([]);

  var wscols = [
    { wch: 13 }, // "1"
    { wch: 8 }, // "2"
    { wch: 11 }, // "3"
    { wch: 8.5 }, // "4"
    { wch: 33 }, // "5"
    { wch: 11 }, // "6"
    { wch: 33 }, // "7"
    { wch: 11 }, // "8"
    // { wch: 13 }, // "9"
    // {wpx: 50}, // "pixels"
  ];

  worksheet["!cols"] = wscols;
  worksheet["!autofilter"] = { ref: "A1:H1" };

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [["Municipio", "Seccion", "Casilla", "Estatus", "RC", "Tel RC", "RG", "Tel RG"]],
    { origin: "A1" }
  );
  fetchedData.forEach((municipio) => {
    municipio.secciones.forEach((seccion) => {
      seccion.casillas.forEach((casilla) => {
        XLSX.utils.sheet_add_aoa(
          worksheet,
          [
            [
              municipio.nombre,
              seccion.numero,
              casilla.nombre,
              casilla.open ? "Abierta" : "Cerrada",
              casilla.rc.paterno + " " + casilla.rc.materno + " " + casilla.rc.nombre,
              casilla.rc.telefono,
              casilla.rc.rg.paterno + " " + casilla.rc.rg.materno + " " + casilla.rc.rg.nombre,
              casilla.rc.rg.telefono
            ],
          ],
          { origin: -1 }
        );
      });
    });
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, "Casillas");

  const filename =
    "Estatus Casillas General " +
    (new Date().getHours() % 12 || 12) +
    "_" +
    new Date().getMinutes().toString().padStart(2, "0") +
    (new Date().getHours() >= 12 ? "PM" : "AM") +
    ".xlsx";
  XLSX.writeFile(workbook, filename);
}

function exportToPDF() {
  const canvas = document.getElementById("graficos-municipio");
  const chartDataURL = canvas.toDataURL("image/png");
  const pdf = new jsPDF();
  const imgWidth = 208;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(chartDataURL, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save("grafico.pdf");
}

// Función para exportar a PNG
function exportToPNG() {
  const canvas = document.getElementById("kt_amcharts_1");
  const imageURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = imageURL;
  link.download = "grafico.png";
  link.click();
}
