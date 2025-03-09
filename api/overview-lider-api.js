document.addEventListener("DOMContentLoaded", fetchData);
const token = JSON.parse(localStorage.getItem("token"));
var serverUrl = window.serverUrl;
var am5 = am5;
var dataChart;
let dt, dt1, lider;

if (!token || token.user_type !== "admin" || isTokenExpired(token)) {
  window.location.replace("index.html");
}
function isTokenExpired(token) {
  const currentTime = Date.now() / 1000;
  return token.exp < currentTime;
}
function fetchData() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  fetch(serverUrl + "api/getLider/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((posts) => {
      document.querySelector("#nombreOVLid").innerHTML ="ELECCION 2025";
      document.querySelector("#direccionOVLid").innerHTML =
        posts.calle +
        " " +
        posts.direccion_ext +
        ", " +
        posts.direccion_int +
        ", " +
        posts.colonia +
        ", " +
        posts.c_postal;
      document.querySelector("#telefonoOVLid").innerHTML = posts.telefono;

      if (
        posts &&
        posts.movilizadores &&
        Array.isArray(posts.movilizadores) &&
        posts.movilizadores.length > 0 &&
        posts.movilizadores[0] != null
      ) {
        displayData(posts);
        handleSearchDatatable();
      }
      if (
        posts &&
        posts.ciudadanos_extra &&
        Array.isArray(posts.ciudadanos_extra) &&
        posts.ciudadanos_extra.length > 0 &&
        posts.ciudadanos_extra[0] != null
      ) {
        displayData1(posts);
        handleSearchDatatable();
      }

      lider = posts;

      // Se transforma cualquier valor 0 a 0.1 para evitar problemas con logaritmos
      dataChart = [
        {
          votos: "Ciudadanos Contra: " + posts.votaron_other_c,
          value: posts.votaron_other_c > 0 ? posts.votaron_other_c : 0.1,
          realValue: posts.votaron_other_c,
        },
        {
          votos: "Ciudadanos Nuestros: " + posts.votaron_own_b,
          value: posts.votaron_own_b > 0 ? posts.votaron_own_b : 0.1,
          realValue: posts.votaron_own_b,
        },
        {
          votos: "Militantes Contra: " + posts.votaron_other_d,
          value: posts.votaron_other_d > 0 ? posts.votaron_other_d : 0.1,
          realValue: posts.votaron_other_d,
        },
        {
          votos: "Militantes Nuestros: " + posts.votaron_own_a,
          value: posts.votaron_own_a > 0 ? posts.votaron_own_a : 0.1,
          realValue: posts.votaron_own_a,
        },
        {
          votos: "Votaron Contra: " + posts.votaron_other,
          value: posts.votaron_other > 0 ? posts.votaron_other : 0.1,
          realValue: posts.votaron_other,
        },
        {
          votos: "Votaron Nuestros: " + posts.votaron_own,
          value: posts.votaron_own > 0 ? posts.votaron_own : 0.1,
          realValue: posts.votaron_own,
        },
      ];

      am5.ready(function () {
        // Crear el root
        var root = am5.Root.new("kt_amcharts_1");

        // Aplicar temas
        root.setThemes([am5themes_Animated.new(root)]);

        // Crear gráfico XY
        var chart = root.container.children.push(
          am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "none",
            wheelY: "none",
            paddingLeft: 0,
          })
        );

        // Cursor
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineY.set("visible", false);

        // Eje X
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

        // Eje Y con escala logarítmica (min no puede ser 0)
        var yRenderer = am5xy.AxisRendererY.new(root, {});
        var yAxis = chart.yAxes.push(
          am5xy.ValueAxis.new(root, {
            maxDeviation: 0,
            min: 0.1,
            logarithmic: true,
            extraMax: 0.1,
            renderer: yRenderer,
          })
        );
        yRenderer.grid.template.setAll({
          strokeDasharray: [2, 2],
        });

        // Serie de columnas
        var series = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: "Series 1",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "value",
            sequencedInterpolation: true,
            categoryXField: "votos",
            tooltip: am5.Tooltip.new(root, {
              dy: -25,
              labelText: "{votos}, {realValue}",
            }),
          })
        );

        series.columns.template.setAll({
          cornerRadiusTL: 5,
          cornerRadiusTR: 5,
          strokeOpacity: 0,
          width: am5.percent(90),
          tooltipY: 0,
        });

        var customColors = [
          am5.color("#B23F3F"),
          am5.color("#008AFC"),
          am5.color("#8D2C2C"),
          am5.color("#005CA8"),
          am5.color("#6A2525"),
          am5.color("#023B69"),
        ];
        series.columns.template.adapters.add("fill", function (fill, target) {
          var index = series.columns.indexOf(target);
          return customColors[index % customColors.length];
        });
        series.columns.template.adapters.add("stroke", (stroke, target) => {
          return chart.get("colors").getIndex(series.columns.indexOf(target));
        });

        // Etiquetas en las columnas
        series.bullets.push(function () {
          return am5.Bullet.new(root, {
            locationY: 1,
            sprite: am5.Label.new(root, {
              text: "{realValue}",
              fill: root.interfaceColors.get("alternativeText"),
              centerY: 0,
              centerX: am5.p50,
              populateText: true,
            }),
          });
        });

        xAxis.data.setAll(dataChart);
        series.data.setAll(dataChart);

        // Animaciones de entrada
        series.appear(1000);
        chart.appear(1000, 100);
      });
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

  const filterSearch1 = document.querySelector(
    '[data-kt-ciudadanos-table-filter="search"]'
  );
  filterSearch1.addEventListener("keyup", (e) => {
    dt1.search(e.target.value).draw();
  });
};

function displayData(posts1) {
  let posts = posts1.movilizadores;
  const tableBody = document.querySelector("#contenido-tabla");
  tableBody.innerHTML = "";
  posts.forEach((post) => {
    const row = `
        <tr>
            <td>
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input class="form-check-input" type="checkbox" value="1" />
                </div>
            </td>
            <td>
                <a href="overview-movilizador.html?id=${post._id}" class="text-gray-600 text-hover-primary mb-1">
                  ${post.paterno + " " + post.materno + " " + post.nombre}
                </a>
            </td>
            <td>
                <a href="#" class="text-gray-600 text-hover-primary mb-1">
                  ${post.calle + " " + post.direccion_ext + " " + post.direccion_int + ", " + post.colonia + ", " + post.c_postal}
                </a>
            </td>
            <td>
                <a href="#" class="text-gray-600 text-hover-primary mb-1">${post.telefono}</a>
            </td>
            <td>
                <p class="text-gray-600 mb-1">${[...new Set(post.secciones.map((seccion) => seccion.numero))]}</p>
            </td>
            <td>
                <p class="text-gray-600 mb-1">${[...new Set(post.secciones.flatMap((seccion) => seccion.municipio.flatMap((municipio) => municipio.nombre)))]}</p>
            </td>
        </tr>
        `;
    tableBody.innerHTML += row;
  });
  dt = $("#kt_customers_table").DataTable();
}
function displayData1(posts1) {
  let posts = posts1.ciudadanos_extra;
  const tableBody1 = document.querySelector("#contenido-tabla1");
  tableBody1.innerHTML = "";
  posts.forEach((post) => {
    const row = `
        <tr>
            <td>
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input class="form-check-input" type="checkbox" value="1" />
                </div>
            </td>
            <td>
                <a href="overview-movilizador.html?id=${post._id}" class="text-gray-600 text-hover-primary mb-1">
                  ${post.paterno + " " + post.materno + " " + post.nombre}
                </a>
            </td>
            <td>
                <a href="#" class="text-gray-600 text-hover-primary mb-1">
                  ${post.calle + " " + post.direccion_ext + " " + post.direccion_int + ", " + post.colonia + ", " + post.c_postal}
                </a>
            </td>
            <td>
                <a href="#" class="text-gray-600 text-hover-primary mb-1">${post.telefono}</a>
            </td>
            <td>
                <p class="text-gray-600 mb-1">${post.casilla[0].nombre}</p>
            </td>
            <td>
                <p class="text-gray-600 mb-1">${post.casilla[0].seccion[0].numero}</p>
            </td>
            <td>
                <p class="text-gray-600 mb-1">${post.casilla[0].seccion[0].municipio[0].nombre}</p>
            </td>
            <td>
              <div class="badge badge-light-${post.voto ? "success" : "danger"}">
                ${post.voto ? "Votó" : "Sin voto"}
              </div>
            </td>
        </tr>
        `;
    tableBody1.innerHTML += row;
  });
  dt1 = $("#kt_ciudadanos_table").DataTable();
}

function exportToExcel() {
  if (!lider) {
    console.log("No hay datos aún.");
    return;
  }
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([]);
  var wscols = [
    { wch: 13 },
    { wch: 8 },
    { wch: 11 },
    { wch: 21 },
    { wch: 11 },
    { wch: 20 },
    { wch: 11 },
    { wch: 25 },
    { wch: 13 },
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
        "Tel Mov",
        "Lider",
        "Tel Lider",
        "Ciudanano",
        "Votó/NoVotó",
      ],
    ],
    { origin: "A1" }
  );
  lider.movilizadores.forEach((movilizador) => {
    movilizador.secciones.forEach((seccion) => {
      seccion.casillas.forEach((casilla) => {
        casilla.ciudadanos.forEach((ciudadano) => {
          XLSX.utils.sheet_add_aoa(
            worksheet,
            [
              [
                seccion.municipio[0].nombre,
                seccion.numero,
                casilla.nombre,
                movilizador.paterno +
                  " " +
                  movilizador.materno +
                  " " +
                  movilizador.nombre,
                movilizador.telefono,
                lider.paterno + " " + lider.materno + " " + lider.nombre,
                lider.telefono,
                ciudadano.paterno +
                  " " +
                  ciudadano.materno +
                  " " +
                  ciudadano.nombre,
                ciudadano.voto ? "Votó" : "No ha votado",
              ],
            ],
            { origin: -1 }
          );
        });
      });
    });
  });
  lider.ciudadanos_extra.forEach((ciudadano_extra) => {
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [
        [
          ciudadano_extra.casilla[0].seccion[0].municipio[0].nombre,
          ciudadano_extra.casilla[0].seccion[0].numero,
          ciudadano_extra.casilla[0].nombre,
          "",
          "",
          lider.paterno + " " + lider.materno + " " + lider.nombre,
          lider.telefono,
          ciudadano_extra.paterno +
            " " +
            ciudadano_extra.materno +
            " " +
            ciudadano_extra.nombre,
          ciudadano_extra.voto ? "Votó" : "No ha votado",
        ],
      ],
      { origin: -1 }
    );
  });
  XLSX.utils.book_append_sheet(workbook, worksheet, "Casillas");
  const filename =
    "Votación General Movilizadores" +
    (new Date().getHours() % 12 || 12) +
    "_" +
    new Date()
      .getMinutes()
      .toString()
      .padStart(2, "0") +
    (new Date().getHours() >= 12 ? "PM" : "AM") +
    ".xlsx";
  XLSX.writeFile(workbook, filename, { cellStyles: true });
}
