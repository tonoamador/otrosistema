"use strict";
var am5 = am5;
var serverUrl = window.serverUrl;
$.noConflict();
let fetchedData;
const params = new URLSearchParams(window.location.search);
const TownhallId = params.get("id");
let e = document.querySelector("#townhall");
e.setAttribute("data-id-townhall", TownhallId);

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

var getVotosXMunicipio = (function () {
  var dataVotos;
  var el = document.getElementById("townhall");
  var idTownHall = el.getAttribute("data-id-townhall");
  var dataChart;
  var dataSecciones;
  let table;
  let dt;

  $.ajax({
    url: serverUrl + "api/getVotosMunicipio/",
    dataType: "JSON",
    method: "POST",
    async: false,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      id: idTownHall,
    }),
    success: function (i) {
      console.log(i)
      e.innerHTML = i.nombre;
      dataSecciones = i.secciones;
      dataChart = [
        {
          votos: "Total Votos X",
          value: i.votaron_og,
        },
        {
          votos: "Total Votos NG",
          value: i.votaron_ng,
        },
        {
          votos: "No han votado",
          value: i.faltan,
        },
        {
          votos: "Total Votos General",
          value: i.votaron,
        },
      ];
      fetchedData = i;
    },
  }).done(function (result) {});

  am5.ready(function () {
    // Create root element
    // https://www.amcharts.com/docs/v5/getting-started/#Root_element
    var root = am5.Root.new("kt_amcharts_1");

    // Set themes
    // https://www.amcharts.com/docs/v5/concepts/themes/

    root.setThemes([am5themes_Animated.new(root)]);

    // Create chart
    // https://www.amcharts.com/docs/v5/charts/xy-chart/
    var chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0,
      })
    );

    // Add cursor
    // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
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

    // Create series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Series 1",
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        sequencedInterpolation: true,
        categoryXField: "votos",
        //   tooltip: am5.Tooltip.new(root, { dy: -25, labelText: "{valueY, valueX} {valueX}" })
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

    var customColors = [
      am5.color("#FFFF00"), // Amarillo
      am5.color("#FF00FF"), // Magenta
      am5.color("#808080"), // Gris
      am5.color("#000000"), // Negro
    ];
    series.columns.template.adapters.add("fill", function (fill, target) {
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

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear(1000);
    chart.appear(1000, 100);
  }); // end am5.ready()

  var CreateTableSections = function () {
    //Aqui genera la tabla
    const tableBody = document.querySelector("#tabla-votos-seccional");

    // Limpiar cualquier fila existente en la tabla
    tableBody.innerHTML = "";

    //Iterar el JSON y dibujar las TR
    dataSecciones.forEach((seccion) => {
      let percent = 0;
      if (seccion.esperados != 0) {
        percent = (100 * seccion.votaron_ng) / seccion.esperados;
        percent = percent.toFixed(2);
      }

      // var classPercent = percent = 0 ? "bg-light" : percent < 50 ? "bg-warning" : percent >=50 ? "bg-success" : "bg-light";
      let classPercent = "bg-light";
      if (percent < 50) {
        classPercent = "bg-warning";
      } else if (percent >= 50) {
        classPercent = "bg-success";
      }
      // const lideres = Array.from(
      //   new Map(
      //     seccion.casillas
      //       .flatMap((c) =>
      //         c.ciudadanos.flatMap((c) =>
      //           c.movilizador.flatMap((m) =>
      //             m.lider.map((lider) => [lider._id, lider])
      //           )
      //         )
      //       )
      //       .values()
      //   )
      // );
      
      // `<a href="overview-lider.html?id=${lider._id}" class="text-gray-600 mb-1 text-hover-primary">${lider.paterno} ${lider.materno} ${lider.nombre}</a>`).join(", ")
      // const x = [
      //   ...new Set(seccion)
      // ]
      // console.log(x);
      const row = `
                <tr>
                    <td><a href="grafica-votos-seccional.html?id=${seccion._id}">${seccion.numero}</a></td>
                    <td>${seccion.votaron_ng}</td>
                    <td>${seccion.votaron_og}</td>
                    <td>${seccion.faltan}</td>
                    <td>

</td>

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
    { wch: 21 }, // "4"
    { wch: 11 }, // "5"
    { wch: 20 }, // "6"
    { wch: 11 }, // "7"
    { wch: 25 }, // "8"
    { wch: 13 }, // "9"
    // {wpx: 50}, // "pixels"
  ];

  worksheet["!cols"] = wscols;
  worksheet["!autofilter"] = { ref: "A1:I1" };

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      [
        "Municipio",
        "Seccional",
        "Casilla",
        "Lider",
        "Tel Lider",
        "Movilizador",
        "Tel Mov",
        "Ciudadano",
        "Votó/NoVotó"
      ],
    ],
    { origin: "A1" }
  );

  
  fetchedData.secciones.forEach((seccion) => {
    seccion.casillas.forEach((casilla) => {
      casilla.ciudadanos.forEach((ciudadano) => {
        XLSX.utils.sheet_add_aoa(
          worksheet,
          [
            [
              fetchedData.nombre,
              seccion.numero,
              casilla.nombre,
              [
                ...new Set(
                  ciudadano.movilizador.flatMap((movilizador) =>
                    movilizador.lider.flatMap((lider) => lider.paterno + " " + lider.materno + " " + lider.nombre)
                  )
                )
              ],
              [
                ...new Set(
                  ciudadano.movilizador.flatMap((movilizador) =>
                    movilizador.lider.flatMap((lider) => lider.telefono)
                  )
                )
              ],
              [...new Set(ciudadano.movilizador.map((movilizador) => movilizador.paterno + " " + movilizador.materno + " " + movilizador.nombre))],
              [...new Set(ciudadano.movilizador.map((movilizador) => movilizador.telefono))],
              ciudadano.paterno + " " + ciudadano.materno + " " + ciudadano.nombre,
              ciudadano.voto ? "Votó" : "No ha votado"
            ],
          ],
          { origin: -1 }
        );
      })
    });
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, "Votación");

  const filename =
    "Votación por Municipio " +
    (new Date().getHours() % 12 || 12) +
    "_" +
    new Date().getMinutes().toString().padStart(2, "0") +
    (new Date().getHours() >= 12 ? "PM" : "AM") +
    ".xlsx";
  XLSX.writeFile(workbook, filename);
}
