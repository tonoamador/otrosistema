// Datos para las barras
var etiquetas = ["Casillas Abiertas", "Casillas Cerradas"];
var data = {
  labels: etiquetas,
  datasets: [
    {
      label: "Conteo general ",
      backgroundColor: ["blue", "gray"], // Colores de las barras
      borderColor: ["black", "black"], // Colores del borde de las barras
      borderWidth: 1, // Ancho del borde de las barras
      data: [80, 20], // Valores de las barras
    },
  ],
};

// Configuración del gráfico
var options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true, // Empezar el eje Y desde cero
        },
      },
    ],
  },
  onClick: handleClick, // Manejador de clic personalizado
};

// Manejador de clic para las barras
function handleClick(event, array) {
  if (array && array.length > 0) {
    var index = array[0]._index;
    var datasetIndex = array[0]._datasetIndex;
    var value = myChart.data.datasets[datasetIndex].data[index];
  
    // Aquí puedes realizar cualquier acción que desees con los datos de la barra clicada
  }
}

// Función para exportar a Excel
//***************Aqui hacer cambios con base a los datos reales */
function exportToExcel() {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet([
    { Fecha: "Enero", Ventas: 12 },
    { Fecha: "Febrero", Ventas: 19 },
    { Fecha: "Marzo", Ventas: 3 },
    { Fecha: "Abril", Ventas: 5 },
    { Fecha: "Mayo", Ventas: 2 },
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas");
  XLSX.writeFile(workbook, "ventas.xlsx");
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

// Crear el gráfico de barras
var ctx = document.getElementById("graficos-municipio").getContext("2d");
var myChart = new Chart(ctx, {
  type: "bar",
  data: data,
  options: options,
});
