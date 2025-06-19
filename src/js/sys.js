const BASE_URL = 'http://localhost:8080';

// Variáveis para armazenar as instâncias dos gráficos
let weeklySalesChartInstance;
let stockByProductChartInstance;

// --- Funções de interação com o Back-end ---

// Função auxiliar para controlar a visibilidade das tabelas e mensagens
function toggleTableVisibility(productsVisible, clientsVisible) {
    const productsTableTitle = document.getElementById('productsTableTitle');
    const productsTableContainer = document.getElementById('productsTableContainer');
    const clientsTableTitle = document.getElementById('clientsTableTitle');
    const clientsTableContainer = document.getElementById('clientsTableContainer');
    const initialMessage = document.getElementById('initialMessage');

    if (productsTableTitle) productsTableTitle.style.display = productsVisible ? 'block' : 'none';
    if (productsTableContainer) productsTableContainer.style.display = productsVisible ? 'block' : 'none';
    if (clientsTableTitle) clientsTableTitle.style.display = clientsVisible ? 'block' : 'none';
    if (clientsTableContainer) clientsTableContainer.style.display = clientsVisible ? 'block' : 'none';
    
    if (initialMessage) {
        initialMessage.style.display = (!productsVisible && !clientsVisible) ? 'block' : 'none';
    }
}

// Função para buscar produtos do seu back-end
async function fetchProducts() {
    try {
        toggleTableVisibility(false, false); // Oculta tudo antes de carregar
        const productsTableBody = document.getElementById('productsTableBody');
        if (productsTableBody) productsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Carregando produtos...</td></tr>';

        const response = await fetch(`${BASE_URL}/api/produtos`); // Seu back-end tem /api/produtos para buscar produtos
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const products = await response.json();
        console.log('Produtos do Back-end:', products);
        displayProducts(products); 

    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        const productsTableBody = document.getElementById('productsTableBody');
        if (productsTableBody) productsTableBody.innerHTML = `<tr><td colspan="4" style="color: red; text-align: center;">Erro ao carregar produtos: ${error.message}</td></tr>`;
        toggleTableVisibility(true, false); // Mostra o título e a tabela com a mensagem de erro
    }
}

// Função para exibir produtos na tabela
function displayProducts(products) {
    const productsTableBody = document.getElementById('productsTableBody');
    if (productsTableBody) {
        productsTableBody.innerHTML = ''; // Limpa as linhas existentes
        if (products.length === 0) {
            productsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Nenhum produto encontrado.</td></tr>';
        } else {
            products.forEach(product => {
                const row = productsTableBody.insertRow();
                row.insertCell().textContent = product.id;
                row.insertCell().textContent = product.nome;
                row.insertCell().textContent = product.quantidadeEstoque;
                row.insertCell().textContent = `R$ ${parseFloat(product.precoVenda).toFixed(2).replace('.', ',')}`; // Formata para BRL
            });
        }
        toggleTableVisibility(true, false); // Mostra a tabela de produtos, esconde a de clientes
    }
}

// Função para buscar clientes do seu back-end
async function fetchClients() {
    try {
        toggleTableVisibility(false, false); // Oculta tudo antes de carregar
        const clientsTableBody = document.getElementById('clientsTableBody');
        if (clientsTableBody) clientsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Carregando clientes...</td></tr>';

        const response = await fetch(`${BASE_URL}/api/clientes`); // Seu back-end tem /api/clientes para buscar clientes
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const clients = await response.json();
        console.log('Clientes do Back-end:', clients);
        displayClients(clients);

    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        const clientsTableBody = document.getElementById('clientsTableBody');
        if (clientsTableBody) clientsTableBody.innerHTML = `<tr><td colspan="5" style="color: red; text-align: center;">Erro ao carregar clientes: ${error.message}</td></tr>`;
        toggleTableVisibility(false, true); // Mostra o título e a tabela com a mensagem de erro
    }
}

// Função para exibir clientes na tabela
function displayClients(clients) {
    const clientsTableBody = document.getElementById('clientsTableBody');
    if (clientsTableBody) {
        clientsTableBody.innerHTML = ''; // Limpa as linhas existentes
        if (clients.length === 0) {
            clientsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum cliente encontrado.</td></tr>';
        } else {
            clients.forEach(client => {
                const row = clientsTableBody.insertRow();
                row.insertCell().textContent = client.id;
                row.insertCell().textContent = client.nome;
                row.insertCell().textContent = client.documento;
                row.insertCell().textContent = client.email || 'N/A'; // Lidar com email opcional
                row.insertCell().textContent = client.telefone || 'N/A'; // Lidar com telefone opcional
            });
        }
        toggleTableVisibility(false, true); // Mostra a tabela de clientes, esconde a de produtos
    }
}

async function registerSale() {
    const clienteId = 1; 
    const items = [
        { produtoId: 1, quantidade: 1 }, 
        { produtoId: 2, quantidade: 2 }  
    ];

    const saleData = {
        clienteId: clienteId,
        itens: items 
    };

    try {
        const response = await fetch(`${BASE_URL}/api/vendas`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(saleData) 
        });

        if (!response.ok) {
            const errorBody = await response.json(); 
            // O GlobalExceptionHandler do seu backend retorna um objeto com 'message' e 'status'
            throw new Error(`Erro ao registrar venda: ${response.status} - ${errorBody.message || JSON.stringify(errorBody)}`);
        }

        const newSale = await response.json();
        console.log('Venda registrada com sucesso:', newSale);
        alert('Venda registrada com sucesso! ID: ' + newSale.id + '\nValor Total: R$' + newSale.valorTotal);
        // Atualiza os gráficos após registrar uma venda
        fetchWeeklySalesDataForChart();
        fetchProductsDataForChart(); // O estoque mudou, então o gráfico de estoque precisa ser atualizado
        
    } catch (error) {
        console.error('Erro ao registrar venda:', error);
        alert('Falha ao registrar venda: ' + error.message);
    }
}

// --- FUNÇÕES PARA GRÁFICOS COM DADOS DA API ---

// Função para buscar dados de vendas e preparar para o gráfico de vendas semanais
async function fetchWeeklySalesDataForChart() {
    try {
        const response = await fetch(`${BASE_URL}/api/vendas`); // Seu back-end tem /api/vendas para buscar todas as vendas
        if (!response.ok) {
            throw new Error(`Erro ao buscar vendas para o gráfico: ${response.status}`);
        }
        const sales = await response.json();

        // Agregação dos dados por dia da semana
        const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const weeklySales = new Array(7).fill(0); // Inicializa com 0 para cada dia

        const now = new Date();
        // Ajusta para o fuso horário local e seta para o início do dia para comparação correta
        now.setHours(0, 0, 0, 0); 
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Começa no domingo desta semana (0 = domingo)

        sales.forEach(sale => {
            const saleDate = new Date(sale.dataVenda); // Convertendo LocalDateTime para Date
            saleDate.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data

            // Verifica se a venda ocorreu na semana atual (a partir do domingo desta semana)
            if (saleDate >= startOfWeek && saleDate <= now) {
                const dayIndex = saleDate.getDay(); // 0 para Domingo, 1 para Segunda, etc.
                weeklySales[dayIndex] += parseFloat(sale.valorTotal); // Soma o valor total da venda
            }
        });

        // Reorganiza para começar na Segunda (como no seu gráfico original)
        const labels = [...daysOfWeek.slice(1), daysOfWeek[0]]; // Seg, Ter, ..., Sáb, Dom
        const data = [...weeklySales.slice(1), weeklySales[0]];

        renderWeeklySalesChart(labels, data);

    } catch (error) {
        console.error('Erro ao carregar dados de vendas para o gráfico:', error);
    }
}

// Função para renderizar o gráfico de vendas semanais
function renderWeeklySalesChart(labels, data) {
    const ctx = document.getElementById('weeklySalesChart').getContext('2d');

    // Destroi a instância anterior do gráfico se ela existir para evitar sobreposição
    if (weeklySalesChartInstance) {
        weeklySalesChartInstance.destroy();
    }

    weeklySalesChartInstance = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico: barras
        data: {
            labels: labels,
            datasets: [{
                label: 'Vendas (R$)',
                data: data,
                backgroundColor: 'rgba(106, 75, 138, 0.7)', // Cor das barras
                borderColor: 'rgba(106, 75, 138, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Valor (R$)'
                    },
                    ticks: {
                        callback: function(value) { // Formata ticks do eixo Y como moeda
                            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Dia da Semana'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Não exibir a legenda do dataset
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// Função para buscar dados de produtos e preparar para o gráfico de estoque por produto
async function fetchProductsDataForChart() {
    try {
        const response = await fetch(`${BASE_URL}/api/produtos`); // Seu back-end tem /api/produtos para buscar produtos
        if (!response.ok) {
            throw new Error(`Erro ao buscar produtos para o gráfico: ${response.status}`);
        }
        const products = await response.json();

        // Filtra produtos com estoque maior que 0 para não poluir o gráfico
        const productsInStock = products.filter(p => p.quantidadeEstoque > 0);

        const labels = productsInStock.map(p => p.nome);
        const data = productsInStock.map(p => p.quantidadeEstoque);

        renderStockByProductChart(labels, data);

    } catch (error) {
        console.error('Erro ao carregar dados de estoque para o gráfico:', error);
    }
}

// Função para renderizar o gráfico de estoque por produto
function renderStockByProductChart(labels, data) {
    const ctx = document.getElementById('stockByProductChart').getContext('2d');

    // Destroi a instância anterior do gráfico se ela existir para evitar sobreposição
    if (stockByProductChartInstance) {
        stockByProductChartInstance.destroy();
    }

    stockByProductChartInstance = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico: barras
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantidade em Estoque',
                data: data,
                backgroundColor: [
                    'rgba(156, 139, 179, 0.7)', // Cor 1
                    'rgba(123, 107, 163, 0.7)', // Cor 2
                    'rgba(106, 75, 138, 0.7)', // Cor 3
                    'rgba(137, 115, 156, 0.7)', // Cor 4
                    'rgba(168, 153, 179, 0.7)', // Cor 5
                    'rgba(190, 170, 200, 0.7)', // Adiciona mais cores para mais produtos
                    'rgba(210, 190, 220, 0.7)'
                ],
                borderColor: [
                    'rgba(156, 139, 179, 1)',
                    'rgba(123, 107, 163, 1)',
                    'rgba(106, 75, 138, 1)',
                    'rgba(137, 115, 156, 1)',
                    'rgba(168, 153, 179, 1)',
                    'rgba(190, 170, 200, 1)',
                    'rgba(210, 190, 220, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Quantidade'
                    },
                    ticks: {
                        precision: 0 // Garante que os ticks do eixo Y sejam números inteiros
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Produto'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // Não exibir a legenda do dataset
                }
            }
        }
    });
}


// --- Event Listeners para os botões e inicialização dos gráficos ---

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar os gráficos ao carregar a página
    fetchWeeklySalesDataForChart();
    fetchProductsDataForChart();

    // Botão Registrar Venda
    const registerSaleButton = document.getElementById('registerSaleButton');
    if (registerSaleButton) {
        registerSaleButton.addEventListener('click', registerSale);
    } else {
        console.warn("Botão 'Registrar Venda' não encontrado com o ID 'registerSaleButton'.");
    }

    // Botão Listar Clientes
    const listClientsButton = document.getElementById('listClientsButton');
    if (listClientsButton) {
        listClientsButton.addEventListener('click', fetchClients);
    } else {
        console.warn("Botão 'Listar Clientes' não encontrado com o ID 'listClientsButton'.");
    }

    // Botão Listar Produtos
    const listProductsButton = document.getElementById('listProductsButton');
    if (listProductsButton) {
        listProductsButton.addEventListener('click', fetchProducts);
    } else {
        console.warn("Botão 'Listar Produtos' não encontrado com o ID 'listProductsButton'.");
    }

    // Botão Atualizar Gráficos (novo)
    const refreshChartsButton = document.getElementById('refreshChartsButton');
    if (refreshChartsButton) {
        refreshChartsButton.addEventListener('click', () => {
            fetchWeeklySalesDataForChart(); // Chama a função para atualizar vendas
            fetchProductsDataForChart();   // Chama a função para atualizar estoque
            alert('Gráficos atualizados!');
        });
    } else {
        console.warn("Botão 'Atualizar Gráficos' não encontrado com o ID 'refreshChartsButton'.");
    }

    // Outros botões de ação (com alerts temporários)
    const reportsButton = document.getElementById('reportsButton');
    if (reportsButton) {
        reportsButton.addEventListener('click', () => {
            alert('Funcionalidade: Relatórios ainda não implementada com a API.');
        });
    } else {
        console.warn("Botão 'Relatórios' não encontrado com o ID 'reportsButton'.");
    }

    const createProductButton = document.getElementById('createProductButton');
    if (createProductButton) {
        createProductButton.addEventListener('click', () => {
            alert('Funcionalidade: Cadastrar Produto ainda não implementada com a API.');
        });
    } else {
        console.warn("Botão 'Cadastrar Produto' não encontrado com o ID 'createProductButton'.");
    }

    const manageStockButton = document.getElementById('manageStockButton');
    if (manageStockButton) {
        manageStockButton.addEventListener('click', () => {
            alert('Funcionalidade: Gerenciar Estoque ainda não implementada com a API.');
        });
    } else {
        console.warn("Botão 'Gerenciar Estoque' não encontrado com o ID 'manageStockButton'.");
    }

    // Opcional: Oculta as tabelas inicialmente e mostra a mensagem de instrução
    toggleTableVisibility(false, false); 
});

// Adiciona interatividade aos itens de navegação (mantido do código original)
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// Adiciona um pequeno efeito de escala ao clicar nos botões de ação (mantido do código original)
document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});