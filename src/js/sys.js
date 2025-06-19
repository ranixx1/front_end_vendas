
// Função para simular o gráfico de barras (Vendas Semanais)
function updateChartBarsVendas() {
    const bars = document.querySelectorAll('.stock-section.chart-section:nth-of-type(1) .chart-bar');
    const values = [180, 240, 150, 270, 210, 120]; 
    const maxVal = 300; 

    bars.forEach((bar, index) => {
        const percentage = (values[index] / maxVal) * 100;
        bar.style.height = `${percentage}%`;
        bar.setAttribute('data-value', values[index]);
    });
}
updateChartBarsVendas();

