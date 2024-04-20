// Datos para las barras
var etiquetas = ['Casillas Abiertas', 'Casillas Cerradas'];
var data = {
    labels: etiquetas,
    datasets: [{
        label: 'Conteo general ',
        backgroundColor: ['blue', 'gray'], // Colores de las barras
        borderColor: ['black', 'black'], // Colores del borde de las barras
        borderWidth: 1, // Ancho del borde de las barras
        data: [10, 20] // Valores de las barras
    }]
};

// Configuración del gráfico
var options = {
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true // Empezar el eje Y desde cero
            }
        }]
    },
    onClick: handleClick // Manejador de clic personalizado
};

// Manejador de clic para las barras
function handleClick(event, array) {
    if (array && array.length > 0) {
        var index = array[0]._index;
        var datasetIndex = array[0]._datasetIndex;
        var value = myChart.data.datasets[datasetIndex].data[index];
        console.log("Haz hecho clic en la barra " + (index + 1) + " con un valor de " + value);
        // Aquí puedes realizar cualquier acción que desees con los datos de la barra clicada
    }
}

 // Función para exportar a Excel
 function exportToExcel() {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([
        { Fecha: 'Enero', Ventas: 12 },
        { Fecha: 'Febrero', Ventas: 19 },
        { Fecha: 'Marzo', Ventas: 3 },
        { Fecha: 'Abril', Ventas: 5 },
        { Fecha: 'Mayo', Ventas: 2 }
    ]);

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');
    XLSX.writeFile(workbook, 'ventas.xlsx');
}

// Crear el gráfico de barras
var ctx = document.getElementById('graficos-municipio').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
});