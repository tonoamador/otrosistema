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
$.noConflict();
var serverUrl = window.serverUrl;
let fetchedData;

var getVotosxMovilizadores = (function () {
  var dataChart = [];
  var dataMov;
  let table;
  let dt;

  $.ajax({
    url: serverUrl + "api/getMovilizadoresGrafica",
    dataType: "JSON",
    method: "POST",
    async: false,
    contentType: "application/json; charset=utf-8",
    success: function (i) {
      dataMov = i;
      fetchedData = i;
      
      i.forEach((mov) => {
        let percent = (100 * mov.votaron) / mov.esperados;
        percent = percent.toFixed(2);
        percent = parseFloat(percent);
        dataChart.push({
          name: mov.nombre + " " + mov.paterno,
          steps: percent,
          pictureSettings: {
            src: "assets/media/avatars/300-2.jpg",
          },
        });
      });
    },
  });

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
        paddingLeft: 0,
        paddingRight: 30,
        wheelX: "none",
        wheelY: "none",
      })
    );

    // Create axes
    // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/

    var yRenderer = am5xy.AxisRendererY.new(root, {
      minorGridEnabled: true,
    });
    yRenderer.grid.template.set("visible", false);

    var yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "name",
        renderer: yRenderer,
        paddingRight: 40,
      })
    );

    var xRenderer = am5xy.AxisRendererX.new(root, {
      minGridDistance: 80,
      minorGridEnabled: true,
    });

    var xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: xRenderer,
      })
    );

    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    var series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        name: "Income",
        xAxis: xAxis,
        yAxis: yAxis,
        valueXField: "steps",
        categoryYField: "name",
        sequencedInterpolation: true,
        calculateAggregates: true,
        maskBullets: false,
        tooltip: am5.Tooltip.new(root, {
          dy: -30,
          pointerOrientation: "vertical",
          labelText: "{valueX}",
        }),
      })
    );

    series.columns.template.setAll({
      strokeOpacity: 0,
      cornerRadiusBR: 10,
      cornerRadiusTR: 10,
      cornerRadiusBL: 10,
      cornerRadiusTL: 10,
      maxHeight: 50,
      fillOpacity: 0.8,
    });

    var currentlyHovered;

    series.columns.template.events.on("pointerover", function (e) {
      handleHover(e.target.dataItem);
    });

    series.columns.template.events.on("pointerout", function (e) {
      handleOut();
    });

    function handleHover(dataItem) {
      if (dataItem && currentlyHovered != dataItem) {
        handleOut();
        currentlyHovered = dataItem;
        var bullet = dataItem.bullets[0];
        bullet.animate({
          key: "locationX",
          to: 1,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic),
        });
      }
    }

    function handleOut() {
      if (currentlyHovered) {
        var bullet = currentlyHovered.bullets[0];
        bullet.animate({
          key: "locationX",
          to: 0,
          duration: 600,
          easing: am5.ease.out(am5.ease.cubic),
        });
      }
    }

    var circleTemplate = am5.Template.new({});

    series.bullets.push(function (root, series, dataItem) {
      var bulletContainer = am5.Container.new(root, {});
      var circle = bulletContainer.children.push(
        am5.Circle.new(
          root,
          {
            radius: 34,
          },
          circleTemplate
        )
      );

      var maskCircle = bulletContainer.children.push(
        am5.Circle.new(root, { radius: 27 })
      );

      // only containers can be masked, so we add image to another container
      var imageContainer = bulletContainer.children.push(
        am5.Container.new(root, {
          mask: maskCircle,
        })
      );

      // not working
      var image = imageContainer.children.push(
        am5.Picture.new(root, {
          templateField: "pictureSettings",
          centerX: am5.p50,
          centerY: am5.p50,
          width: 60,
          height: 60,
        })
      );

      return am5.Bullet.new(root, {
        locationX: 0,
        sprite: bulletContainer,
      });
    });

    // heatrule
    series.set("heatRules", [
      {
        dataField: "valueX",
        min: am5.color(0xe5dc36),
        max: am5.color(0x5faa46),
        target: series.columns.template,
        key: "fill",
      },
      {
        dataField: "valueX",
        min: am5.color(0xe5dc36),
        max: am5.color(0x5faa46),
        target: circleTemplate,
        key: "fill",
      },
    ]);

    series.data.setAll(dataChart);
    yAxis.data.setAll(dataChart);

    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("visible", false);
    cursor.lineY.set("visible", false);

    cursor.events.on("cursormoved", function () {
      var dataItem = series.get("tooltip").dataItem;
      if (dataItem) {
        handleHover(dataItem);
      } else {
        handleOut();
      }
    });

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    series.appear();
    chart.appear(1000, 100);
  });

  var CreateTableMovilizadores = function () {
    //Aqui genera la tabla
    const tableBody = document.querySelector("#tabla-votos-seccional");

    // Limpiar cualquier fila existente en la tabla
    tableBody.innerHTML = "";

    //Iterar el JSON y dibujar las TR
    let percent = 0;

    dataMov.forEach((mov) => {
      // mov.seccion.forEach((seccion) => {
      if (mov.esperados != 0) {
        percent = (100 * mov.votaron) / mov.esperados;
        percent = percent.toFixed(2);
      }
      let classPercent = "bg-light";
      if (percent < 50) {
        classPercent = "bg-warning";
      } else if (percent >= 50) {
        classPercent = "bg-success";
      }

      const row = `
                    <tr>
                        <td><a href="overview-movilizador.html?id=${mov._id}">${
        mov.nombre
      } ${mov.paterno} ${mov.materno}</a></td>
                        <td>${mov.seccion.numero}</td>
                        <td>${mov.votaron}</td>
                        <td>
                        ${mov.faltan}
                        </td>
                        <td><a href="overview-lider.html?id=${
                          mov.lider._id
                        }">${mov.lider.nombre} ${mov.lider.paterno} ${
        mov.lider.materno
      }</a></td>
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
      // })
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
      CreateTableMovilizadores();
      handleSearchDatatable();
    },
  };
})();

KTUtil.onDOMContentLoaded(function () {
  getVotosxMovilizadores.init();
});

function exportToExcel() {
  if (!fetchedData) {
    console.log("No hay datos aún.");
    return;
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([]);
  var wscols = [
    { wch: 13 }, // "characters"
    { wch: 10 }, // "characters"
    { wch: 11 }, // "characters"
    { wch: 12 }, // "characters"
    { wch: 15 }, // "characters"
    { wch: 10 }, // "characters"
    { wch: 14 }, // "characters"
    // {wpx: 50}, // "pixels"
  ];

  worksheet["!cols"] = wscols;
  worksheet["!autofilter"] = { ref: "A1:G1" };

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [
      [
        "Municipio",
        "Seccional",
        "Casilla",
        "Movilizador",
        "Lider",
        "Ciudanano",
        "Votó/NoVotó"
      ],
    ],
    { origin: "A1" }
  );

  fetchedData.forEach((dataMov) => {
    // console.log(dataMov)
      // dataMov.cuidadanos.forEach((cuidadano) => { 
        XLSX.utils.sheet_add_aoa(
          worksheet,
          [
            [
              dataMov.municipio.nombre,
              dataMov.seccion.numero,
              dataMov.seccion.casillas.nombre,
              dataMov.paterno + " " + dataMov.materno + " " + dataMov.nombre,
              dataMov.lider.paterno +
                " " +
                dataMov.lider.materno +
                " " +
                dataMov.lider.nombre,
              // cuidadano.paterno + " " + cuidadano.materno + " " + cuidadano.nombre,
              // cuidadano.voto ? "Votó" : "No ha votado"
            ],
          ],
          { origin: -1 }
        );
      // });

  });

  XLSX.utils.book_append_sheet(workbook, worksheet, "Casillas");

  const filename =
    "Votación General Movilizadores" +
    (new Date().getHours() % 12 || 12) +
    "_" +
    new Date().getMinutes().toString().padStart(2, "0") +
    (new Date().getHours() >= 12 ? "PM" : "AM") +
    ".xlsx";
  XLSX.writeFile(workbook, filename, { cellStyles: true });
}
