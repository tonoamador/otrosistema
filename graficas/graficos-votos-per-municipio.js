"use strict"
var am5 = am5
$.noConflict();

const params = new URLSearchParams(window.location.search);
const TownhallId = params.get("id");
let e = document.querySelector("#townhall");
e.setAttribute("data-id-townhall", TownhallId)

var getVotosXMunicipio = function () {
    var dataVotos
    var el = document.getElementById("townhall")
    var idTownHall = el.getAttribute("data-id-townhall")
    var dataChart
    var dataSecciones
    let table
    let dt
    
    $.ajax({
        url: "https://hcpboca.ddns.net:3050/api/getVotosMunicipio/",
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
                    votos: "Total Votos X",
                    value: i[0].conteo_og,
                },
                {
                    votos: "Total Votos NG",
                    value: i[0].conteo_ng,
                },
                {
                    votos: "No han votado",
                    value: i[0].faltan_ng,
                },
                {
                    votos: "Total Votos General",
                    value: i[0].conteo_total,
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
          categoryField: "votos",
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
          categoryXField: "votos",
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
        
        // Set data
        // var data = [
        //   {
        //     votos: "Votos GX",
        //     value: 35654,
        //     bulletSettings: { src: "https://www.amcharts.com/lib/images/faces/A04.png" }
        //   },
        //   {
        //     votos: "Votos NG",
        //     value: 65456,
        //     bulletSettings: { src: "https://www.amcharts.com/lib/images/faces/C02.png" }
        //   },
        //   {
        //     votos: "No Votado NG",
        //     value: 45724,
        //     bulletSettings: { src: "https://www.amcharts.com/lib/images/faces/D02.png" }
        //   },
        //   {
        //     votos: "Votos Totales",
        //     value: 13654,
        //     bulletSettings: { src: "https://www.amcharts.com/lib/images/faces/E01.png" }
        //   }
        // ];
        
        // series.bullets.push(function() {
        //   return am5.Bullet.new(root, {
        //     locationY: 1,
        //     sprite: am5.Picture.new(root, {
        //       templateField: "bulletSettings",
        //       width: 50,
        //       height: 50,
        //       centerX: am5.p50,
        //       centerY: am5.p50,
        //       shadowColor: am5.color(0x000000),
        //       shadowBlur: 4,
        //       shadowOffsetX: 4,
        //       shadowOffsetY: 4,
        //       shadowOpacity: 0.6
        //     })
        //   });
        // });
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
            if(seccion.esperados_seccion_ng != 0){
                percent = 100 * seccion.conteo_seccion_ng / seccion.esperados_seccion_ng
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
                    <td><a href="grafica-votos-seccional.html?id=${seccion._id}">${seccion.numero}</a></td>
                    <td>${seccion.conteo_seccion_ng}</td>
                    <td>${seccion.conteo_seccion_og}</td>
                    <td>${seccion.faltan_seccion_ng}</td>
                    <td><a href="grafica-votos-lider.html?id=${seccion.lider._id}">${seccion.lider.nombre+" "+seccion.lider.paterno+" "+seccion.lider.materno}</a></td>
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
    getVotosXMunicipio.init();
})