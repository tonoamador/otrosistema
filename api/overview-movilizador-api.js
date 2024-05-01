document.addEventListener("DOMContentLoaded", fetchData);
const token = JSON.parse(localStorage.getItem("token"));
var am5 = am5

if (
  !token ||
  (token.user_type !== "admin") ||
  isTokenExpired(token)
) {
  window.location.replace("index.html");
}
function isTokenExpired(token) {
  const currentTime = Date.now() / 1000;
  return token.exp < currentTime;
}
function fetchData() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("");
  fetch("https://hcpboca.ddns.net:3050/api/getMovilizador/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((posts) => {
      document.querySelector("#nombreOVMov").innerHTML =
        posts.paterno + " " + posts.materno + " " + posts.nombre;
      document.querySelector("#direccionOVMov").innerHTML =
        posts.calle +
        " " +
        posts.direccion_ext +
        ", " +
        posts.direccion_int +
        ", " +
        posts.colonia +
        ", " +
        posts.c_postal;
      document.querySelector("#telefonoOVMov").innerHTML = posts.telefono;
      document.querySelector("#nombreLider").innerHTML =
        posts.lider[0]["paterno"] +
        " " +
        posts.lider[0]["materno"] +
        " " +
        posts.lider[0]["nombre"];
      document.querySelector("#telefonoLider").innerHTML =
        posts.lider[0]["telefono"];
      displayData(posts.ciudadanos);

      dataChart = [
        {
          votos: "Total Votos X",
          value: posts.votos_b,
        },
        {
          votos: "Total Votos NG",
          value: posts.votos_a,
        },
        {
          votos: "No han votado",
          value: posts.total_a,
        },
        {
          votos: "Total Votos General",
          value: posts.total_votos,
        },
      ]

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
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function displayData(posts) {
  const tableBody = document.querySelector("#contenido-tabla");

  // Limpiar cualquier fila existente en la tabla
  tableBody.innerHTML = "";

  // Iterar sobre los posts y agregarlos a la tabla
  posts.forEach((post) => {
    const row = `
            
        
        <tr>
            <td>
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input class="form-check-input" type="checkbox" value="1" />
                </div>
            </td>
            <td>
                <p class="text-gray-600 text-hover-primary mb-1">${
                  post.paterno + " " + post.materno + " " + post.nombre
                }</p>
            </td>
            <td>
                <a href="#" class="text-gray-600 text-hover-primary mb-1">${
                  post.calle +
                  " " +
                  post.direccion_ext +
                  " " +
                  post.direccion_int +
                  ", " +
                  post.colonia +
                  ", " +
                  post.c_postal
                }</a>
            </td>
            <td>
                <a href="#" class="text-gray-600 text-hover-primary mb-1">${
                  post.telefono
                }</a>
            </td>
            <td>
                <!--begin::Badges-->
                <div class="badge badge-light-${
                  post.voto ? "success" : "danger"
                }">${post.voto ? "Votó" : "Sin voto"}</div>
                <!--end::Badges-->
            </td>
        </tr>
    <!--end::Table body-->
            
        `;
    tableBody.innerHTML += row;

    $("#kt_customers_table").DataTable();
  });
}
