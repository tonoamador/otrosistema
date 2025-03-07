document.addEventListener("DOMContentLoaded", fetchData);
const token = JSON.parse(localStorage.getItem("token"));
var am5 = am5;
var serverUrl = window.serverUrl;
let dt, data
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
  const id = params.get("id");
  fetch(serverUrl + "api/getMovilizador/", {
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
      data = posts
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
      displayData(posts);
      dataChart = [
        {
          votos: "No han votado",
          value: posts.no_votaron,
        },
        {
          votos: "Votaron Total",
          value: posts.votaron,
        },
        {
          votos: "Votaron Militantes",
          value: posts.votaron_own,
        },
        {
          votos: "Votaron Ciudadanos",
          value: posts.votaron_other,
        },
        {
          votos: "Esperados",
          value: posts.esperados,
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
    
        var customColors = [
          am5.color("#EA0303"), // Rojo
          am5.color("#28A84C"), // Verde
          am5.color("#008AFC"), // Azul
          am5.color("#000000"), // Nrgro
          am5.color("#808080"), // Gris
        ];
        series.columns.template.adapters.add("fill", function(fill, target) {
          var index = series.columns.indexOf(target); // Obtiene el índice de la columna
          return customColors[index % customColors.length]; // Asigna el color de la paleta basado en el índice
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

const handleSearchDatatable = () => {
  const filterSearch = document.querySelector(
    '[data-kt-docs-table-filter="search"]'
  );
  filterSearch.addEventListener("keyup", (e) => {
    dt.search(e.target.value).draw();
  });
};

function displayData(posts1) {
  const posts = [...new Set(posts1.secciones.flatMap(s => s.casillas.flatMap(c => c.ciudadanos)))];

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

    
  });
  $.fn.dataTable.ext.errMode = 'none';
  dt = $("#kt_customers_table").DataTable();
  handleSearchDatatable()
}

function exportToExcel() {
  if (!data) {
    console.log("No hay datos aún.");
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
        "Movilizador",
        "Tel Mov",
        "Lider",
        "Tel Lider",
        "Ciudanano",
        "Votó/NoVotó",
      ],
    ],
    { origin: "A1" }
  );

  let nameMov = data.paterno + " " + data.materno + " " + data.nombre

  data.secciones.forEach((seccion) => {
    seccion.casillas.forEach((casilla) => {
      casilla.ciudadanos.forEach((ciudadano) => {
        XLSX.utils.sheet_add_aoa(
          worksheet,
          [
            [
              seccion.municipio[0].nombre,
              seccion.numero,
              casilla.nombre,
              data.paterno + " " + data.materno + " " + data.nombre,
              data.telefono,
              data.lider[0].paterno + " " + data.lider[0].materno + " " + data.lider[0].nombre,
              data.lider[0].telefono,
              ciudadano.paterno +
                " " +
                ciudadano.materno +
                " " +
                ciudadano.nombre,
              ciudadano.voto?"Votó":"No ha votado",
            ],
          ],
          { origin: -1 }
        );
      });
    });
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, "Casillas");

  const filename =
    "Votación Movilizador_" + nameMov + "_" +
    (new Date().getHours() % 12 || 12) +
    "_" +
    new Date().getMinutes().toString().padStart(2, "0") +
    (new Date().getHours() >= 12 ? "PM" : "AM") +
    ".xlsx";
  XLSX.writeFile(workbook, filename, { cellStyles: true });
}