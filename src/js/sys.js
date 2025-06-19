
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

// Função para simular o novo gráfico de barras (Estoque por Categoria)
function updateChartBarsEstoque() {
    const bars = document.querySelectorAll('.stock-section.chart-section:nth-of-type(2) .chart-bar');
    const values = [350, 250, 450, 200, 325]; // Valores de exemplo para estoque
    const maxVal = 500; 

    bars.forEach((bar, index) => {
        const percentage = (values[index] / maxVal) * 100;
        bar.style.height = `${percentage}%`;
        bar.setAttribute('data-value', values[index]);
    });
}
updateChartBarsEstoque();

// Adiciona interatividade aos itens de navegação
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// Adiciona um pequeno efeito de escala ao clicar nos botões de ação
document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});