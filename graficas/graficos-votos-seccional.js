"use strict";
var am5 = am5;
import { serverUrl } from "../api/config.js";
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
  var dataChart=[];
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
      
      e.innerHTML = i[0].numero
      dataSeccion = i

      i[0].casilla.forEach(c => {
        dataChart.push({
          casilla : c.nombre,
          votos_x : c.conteo_casilla_og,
          votos_ng: c.conteo_casilla_ng,
          votos_no: c.faltan_casilla_ng,
          votos_total: c.conteo_casilla_og+c.conteo_casilla_ng
        })
      })
      
      fetchedData = i[0].casilla;
    },
  }).done(function (result) {});

  am5.ready(function () {
    
    // Create root element
    var root = am5.Root.new("kt_amcharts_1");

    // Set themes
    root.setThemes([
      am5themes_Animated.new(root)
    ]);
    
    // Create chart
    
    var chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      paddingLeft: 0,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout
    }));


    // Add legend
    
    var legend = chart.children.push(
      am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50
      })
    );

    // Create axes
    
    var xRenderer = am5xy.AxisRendererX.new(root, {
      cellStartLocation: 0.1,
      cellEndLocation: 0.9,
      minorGridEnabled: true
    })

    var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
      categoryField: "casilla",
      renderer: xRenderer,
      tooltip: am5.Tooltip.new(root, {})
    }));

    xRenderer.grid.template.setAll({
      location: 1
    })

    xAxis.data.setAll(dataChart);

    var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {
        strokeOpacity: 0.1
      })
    }));


    // Add series
    // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
    function makeSeries(name, fieldName) {
      var series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: name,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: fieldName,
        categoryXField: "casilla"
      }));

      series.columns.template.setAll({
        tooltipText: "{name}, {categoryX}: {valueY}",
        width: am5.percent(90),
        tooltipY: 0,
        strokeOpacity: 0
      });

      // Add Label bullet
      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 1,
          sprite: am5.Label.new(root, {
            text: "{valueYWorking.formatNumber('#.')}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true
          })
        });
      });

      series.data.setAll(dataChart);

      // Make stuff animate on load
      // https://www.amcharts.com/docs/v5/concepts/animations/
      series.appear();

      series.bullets.push(function () {
        return am5.Bullet.new(root, {
          locationY: 0,
          sprite: am5.Label.new(root, {
            text: "{valueY}",
            fill: root.interfaceColors.get("alternativeText"),
            centerY: 0,
            centerX: am5.p50,
            populateText: true
          })
        });
      });

      legend.data.push(series);
    }

    makeSeries("Total Votos X", "votos_x");
    makeSeries("Total Votos NG", "votos_ng");
    makeSeries("No han votado", "votos_no");
    makeSeries("Conteo Total", "votos_total");


    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/
    chart.appear(1000, 100);
  });

  var CreateTableSections = function () {
    const tableBody = document.querySelector("#tabla-votos-seccional");

    tableBody.innerHTML = "";

    let percent = 0;
    if (dataSeccion[0].esperados_seccion_ng != 0) {
      percent = (100 * dataSeccion[0].conteo_seccion_ng) / dataSeccion[0].esperados_seccion_ng;
      percent = percent.toFixed(2)
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
    <td><a href="overview-lider.html?=${dataSeccion[0].lider._id}">${
      dataSeccion[0].lider.nombre +
      " " +
      dataSeccion[0].lider.paterno +
      " " +
      dataSeccion[0].lider.materno
    }</a></td>
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

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [["Sección", "Casilla", "Votos NG", "Votos X", "Faltan NG", "Lider", "Porcentaje"]],
    { origin: "A1" }
  );
  let percent = 0;

  fetchedData.forEach((casilla) => {
    if(casilla.esperados_casilla_ng != 0) {
      percent = (100 * casilla.conteo_casilla_ng) / casilla.esperados_casilla_ng;
      percent=percent.toFixed(2)
    }
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          dataSeccion[0].numero,
          casilla.nombre,
          casilla.conteo_casilla_ng,
          casilla.conteo_casilla_og,
          casilla.faltan_casilla_ng,
          dataSeccion[0].lider.paterno +
          " " +
          dataSeccion[0].lider.materno +
          " " +
          dataSeccion[0].lider.nombre,
          percent + "%"
        ],
      ],
      { origin: -1 }
    );
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
