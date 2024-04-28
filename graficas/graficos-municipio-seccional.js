"use strict"
var am5 = am5
$.noConflict();

const params = new URLSearchParams(window.location.search);
const TownhallId = params.get("id");
let e = document.querySelector("#townhall");
e.setAttribute("data-id-townhall", TownhallId)

var getCasillasXMunicipio = function () {
    var dataVotos
    var el = document.getElementById("townhall")
    var idTownHall = el.getAttribute("data-id-townhall")
    var dataChart
    var dataSecciones
    let table
    let dt
    
    $.ajax({
        url: "https://hcpboca.ddns.net:3050/api/getMunicipioCasillasAbiertas/",
        dataType: "JSON",
        method: "POST",
        async: false,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            id: idTownHall,
        }),
        success: function (i) {
            e.innerHTML = i[0].nombre
            dataSecciones = i[0].secciones
            dataChart = [
                {
                    casillas: "Casillas Abiertas",
                    value: i[0].abiertas_total,
                },
                {
                    casillas: "Casillas Cerradas",
                    value: i[0].cerradas_total,
                },
            ];
        }
    }).done(function(result){
        
    })

    
    am5.ready(function() {

        // Create root element
        // https://www.amcharts.com/docs/v5/getting-started/#Root_element
        var root = am5.Root.new("kt_amcharts_1");
        
        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
      

        root.setThemes([
          am5themes_Animated.new(root),
          
        ]);
        
        // Create chart
        // https://www.amcharts.com/docs/v5/charts/xy-chart/
        var chart = root.container.children.push(am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "none",
          wheelY: "none",
          paddingLeft: 0
        }));
        
        // Add cursor
        // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);
        
        // Create axes
        // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
        var xRenderer = am5xy.AxisRendererX.new(root, { 
          minGridDistance: 30,
          minorGridEnabled: true
         });

         xRenderer.labels.template.setAll({
            rotation: -50,
            centerY: am5.p50,
            centerX: am5.p100,
            paddingRight: 15
        })
        
        var xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
          maxDeviation: 0,
          categoryField: "casillas",
          renderer: xRenderer,
          tooltip: am5.Tooltip.new(root, {})
        }));
        
        xRenderer.grid.template.set("visible", false);
        
        var yRenderer = am5xy.AxisRendererY.new(root, {});
        var yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
          maxDeviation: 0,
          min: 0,
          extraMax: 0.1,
          renderer: yRenderer
        }));
        
        yRenderer.grid.template.setAll({
          strokeDasharray: [2, 2]
        });
        
        // Create series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        var series = chart.series.push(am5xy.ColumnSeries.new(root, {
          name: "Series 1",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          sequencedInterpolation: true,
          categoryXField: "casillas",
        //   tooltip: am5.Tooltip.new(root, { dy: -25, labelText: "{valueY, valueX} {valueX}" })
        }));
        
        
        series.columns.template.setAll({
          cornerRadiusTL: 5,
          cornerRadiusTR: 5,
          strokeOpacity: 0,
          tooltipText: "{votos}, {valueY}",
          width: am5.percent(90),
          tooltipY: 0,
          strokeOpacity: 0
        });
        
        series.columns.template.adapters.add("fill", (fill, target) => {
          return chart.get("colors").getIndex(series.columns.indexOf(target));
        });
        
        series.columns.template.adapters.add("stroke", (stroke, target) => {
          return chart.get("colors").getIndex(series.columns.indexOf(target));
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

        xAxis.data.setAll(dataChart);
        series.data.setAll(dataChart);
        
        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear(1000);
        chart.appear(1000, 100);
        
    }); // end am5.ready()

    var CreateTableSections = function() {
        //Aqui genera la tabla
        const tableBody = document.querySelector("#tabla-votos-seccional");
        
        // Limpiar cualquier fila existente en la tabla
        tableBody.innerHTML = "";

        //Iterar el JSON y dibujar las TR
        dataSecciones.forEach((seccion) => {
            let percent = 0;
            if(seccion.total_seccion != 0){
                percent = 100 * seccion.abiertas_seccion / seccion.total_seccion
            }

            // var classPercent = percent = 0 ? "bg-light" : percent < 50 ? "bg-warning" : percent >=50 ? "bg-success" : "bg-light";
            let classPercent = "bg-light"
            if(percent < 50){
                classPercent = "bg-warning"
            }else if(percent >= 50){
                classPercent = "bg-success"
            }
            
            const row = `
                <tr>
                    <td>${seccion.numero}</td>
                    <td>${seccion.abiertas_seccion}</td>
                    <td>${seccion.cerradas_seccion}</td>
                    <td>${seccion.total_seccion}</td>
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
            `
            tableBody.innerHTML += row;
        })

        dt = $("#kt_table_townhall").DataTable({
            searchDelay: 500,
            processing: true,
            stateSave: true,
        });

        table = dt.$;

        dt.on('draw', function () {
            KTMenu.createInstances();
        })
    }

    var handleSearchDatatable = function () {
        const filterSearch = document.querySelector('[data-kt-docs-table-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            dt.search(e.target.value).draw();
        });
    }
    


    
    return {
        init: function () {
            CreateTableSections()
            handleSearchDatatable()
            
        }
    }
}();

KTUtil.onDOMContentLoaded( function () {
    getCasillasXMunicipio.init();
})

// Función para exportar a Excel
function exportToExcel() {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([
    { Municipio: "Cosamaloapan", Abierta: 12, Cerrada: 15 },
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Municipio");
  XLSX.writeFile(workbook, "Gráfica Municipio.xlsx");
}
// Función para exportar a PDF
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
    const canvas = document.getElementById('graficos-municipio');
    const imageURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'grafico.png';
    link.click();
}


