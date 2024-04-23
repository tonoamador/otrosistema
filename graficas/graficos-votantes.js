// Obtener el contexto del lienzo
var ctx = document.getElementById("graficos-votantes").getContext("2d");

// Datos para el gráfico de pastel
var data = {
  labels: [
    "Votantes",
    "No Votantes",
    "Votantes No Padron",
    "No Votantes No Padron",
  ],
  datasets: [
    {
      data: [12, 19, 3, 5], // Datos de ejemplo
      backgroundColor: ["blue", "red", "green", "gray"],
    },
  ],
};

// Configuración del gráfico
var options = {
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: true,
    position: "right",
  },
};

// Función para exportar a Excel
function exportToExcel() {
  const workbook = XLSX.utils.book_new();
  // Personalizar estilos de la tabla
  const headerStyle = {
    font: { bold: true, color: { rgb: "FF0000" } }, // Rojo
  };

  const worksheet = XLSX.utils.json_to_sheet([
    {
      Votantes: 12,
      "No Votantes": 12,
      "Votantes No Padron": 15,
      "No Votantes No Padron": 20,
    },
  ]);

  XLSX.utils.book_append_sheet(workbook, worksheet, "Municipio");
  XLSX.writeFile(workbook, "Gráfica Municipio.xlsx");
}
// Función para exportar a PDF
function exportToPDF() {
  const canvas = document.getElementById("graficos-votantes");
  const chartDataURL = canvas.toDataURL("image/png");
  const pdf = new jsPDF();
  const imgWidth = 208;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(chartDataURL, "PNG", 0, 0, imgWidth, imgHeight);
  pdf.save("grafico.pdf");
}

// Función para exportar a PNG
function exportToPNG() {
  const canvas = document.getElementById("graficos-votantes");
  const imageURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = imageURL;
  link.download = "grafico.png";
  link.click();
}

// Crear el gráfico de pastel
var myPieChart = new Chart(ctx, {
  type: "pie",
  data: data,
  options: options,
});
