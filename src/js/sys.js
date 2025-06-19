const BASE_URL = 'http://localhost:8080';

// Variáveis para armazenar as instâncias dos gráficos
let weeklySalesChartInstance;
let stockByProductChartInstance;

// --- Funções de interação com o Back-end ---

// Função auxiliar para controlar a visibilidade das tabelas e mensagens
// AGORA COM TODOS OS 4 PARÂMETROS
function toggleTableVisibility(productsVisible, clientsVisible, salesVisible, manageProductsVisible) {
    const productsTableTitle = document.getElementById('productsTableTitle');
    const productsTableContainer = document.getElementById('productsTableContainer');
    const clientsTableTitle = document.getElementById('clientsTableTitle');
    const clientsTableContainer = document.getElementById('clientsTableContainer');
    const salesTableTitle = document.getElementById('salesTableTitle');
    const salesTableContainer = document.getElementById('salesTableContainer');
    const manageProductsSection = document.getElementById('manageProductsSection'); // Nova referência

    const initialMessage = document.getElementById('initialMessage');

    if (productsTableTitle) productsTableTitle.style.display = productsVisible ? 'block' : 'none';
    if (productsTableContainer) productsTableContainer.style.display = productsVisible ? 'block' : 'none';
    if (clientsTableTitle) clientsTableTitle.style.display = clientsVisible ? 'block' : 'none';
    if (clientsTableContainer) clientsTableContainer.style.display = clientsVisible ? 'block' : 'none';

    if (salesTableTitle) salesTableTitle.style.display = salesVisible ? 'block' : 'none';
    if (salesTableContainer) salesTableContainer.style.display = salesVisible ? 'block' : 'none';

    // NOVA DEFINIÇÃO DE DISPLAY PARA A SEÇÃO DE GERENCIAMENTO DE PRODUTOS
    if (manageProductsSection) manageProductsSection.style.display = manageProductsVisible ? 'block' : 'none';

    if (initialMessage) {
        // Ajusta a condição para incluir todas as seções
        initialMessage.style.display = (!productsVisible && !clientsVisible && !salesVisible && !manageProductsVisible) ? 'block' : 'none';
    }
}

// Função para buscar produtos do seu back-end
async function fetchProducts() {
    try {
        // CHAMADA ATUALIZADA: Adicionado o quarto 'false'
        toggleTableVisibility(false, false, false, false); // Oculta tudo antes de carregar
        const productsTableBody = document.getElementById('productsTableBody');
        if (productsTableBody) productsTableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">Carregando produtos...</td></tr>';

        const response = await fetch(`${BASE_URL}/api/produtos`);

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
        // CHAMADA ATUALIZADA: Adicionado o quarto 'false'
        toggleTableVisibility(true, false, false, false); // Mostra o título e a tabela com a mensagem de erro
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
        // CHAMADA ATUALIZADA: Adicionado o quarto 'false'
        toggleTableVisibility(true, false, false, false); // Mostra a tabela de produtos, esconde a de clientes
    }
}

// Função para buscar clientes do seu back-end
async function fetchClients() {
    try {
        // CHAMADA ATUALIZADA: Adicionado o quarto 'false'
        toggleTableVisibility(false, false, false, false); // Oculta tudo antes de carregar
        const clientsTableBody = document.getElementById('clientsTableBody');
        if (clientsTableBody) clientsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Carregando clientes...</td></tr>';

        const response = await fetch(`${BASE_URL}/api/clientes`);

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
        // CHAMADA ATUALIZADA: Adicionado o quarto 'false'
        toggleTableVisibility(false, true, false, false); // Mostra o título e a tabela com a mensagem de erro
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
        // CHAMADA ATUALIZADA: Adicionado o quarto 'false'
        toggleTableVisibility(false, true, false, false); // Mostra a tabela de clientes, esconde a de produtos
    }
}

// Função para buscar vendas do seu back-end
async function fetchSales() {
    try {
        toggleTableVisibility(false, false, false, false); // Oculta tudo antes de carregar
        const salesTableBody = document.getElementById('salesTableBody');
        if (salesTableBody) salesTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Carregando vendas...</td></tr>';

        const response = await fetch(`${BASE_URL}/api/vendas`);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const sales = await response.json();
        console.log('Vendas do Back-end:', sales);
        displaySales(sales);

    } catch (error) {
        console.error('Erro ao buscar vendas:', error);
        const salesTableBody = document.getElementById('salesTableBody');
        if (salesTableBody) salesTableBody.innerHTML = `<tr><td colspan="5" style="color: red; text-align: center;">Erro ao carregar vendas: ${error.message}</td></tr>`;
        toggleTableVisibility(false, false, true, false);
    }
}

// Função para exibir vendas na tabela
function displaySales(sales) {
    const salesTableBody = document.getElementById('salesTableBody');
    if (salesTableBody) {
        salesTableBody.innerHTML = '';
        if (sales.length === 0) {
            salesTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhuma venda encontrada.</td></tr>';
        } else {
            sales.forEach(sale => {
                const row = salesTableBody.insertRow();
                row.insertCell().textContent = sale.id;
                row.insertCell().textContent = sale.cliente ? sale.cliente.nome : 'N/A';
                const saleDate = new Date(sale.dataVenda);
                row.insertCell().textContent = saleDate.toLocaleString('pt-BR');
                row.insertCell().textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseFloat(sale.valorTotal));
                row.insertCell().textContent = sale.itens ? sale.itens.length : 0;
            });
        }
        toggleTableVisibility(false, false, true, false);
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
            throw new Error(`Erro ao registrar venda: ${response.status} - ${errorBody.message || JSON.stringify(errorBody)}`);
        }

        const newSale = await response.json();
        console.log('Venda registrada com sucesso:', newSale);
        alert('Venda registrada com sucesso! ID: ' + newSale.id + '\nValor Total: R$' + newSale.valorTotal);
        fetchWeeklySalesDataForChart();
        fetchProductsDataForChart();

    } catch (error) {
        console.error('Erro ao registrar venda:', error);
        alert('Falha ao registrar venda: ' + error.message);
    }
}

// --- FUNÇÕES PARA GERENCIAMENTO DE PRODUTOS (CRUD) ---

// Função para buscar produtos para a tabela de CRUD
async function fetchProductsForCrud() {
    try {
        toggleTableVisibility(false, false, false, true); // Mostra a seção de Gerenciar Produtos
        const crudProductsTableBody = document.getElementById('crudProductsTableBody');
        if (crudProductsTableBody) crudProductsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Carregando produtos para gerenciamento...</td></tr>';

        const response = await fetch(`${BASE_URL}/api/produtos`);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const products = await response.json();
        console.log('Produtos para CRUD:', products);
        displayProductsForCrud(products);

    } catch (error) {
        console.error('Erro ao buscar produtos para CRUD:', error);
        const crudProductsTableBody = document.getElementById('crudProductsTableBody');
        if (crudProductsTableBody) crudProductsTableBody.innerHTML = `<tr><td colspan="5" style="color: red; text-align: center;">Erro ao carregar produtos: ${error.message}</td></tr>`;
        toggleTableVisibility(false, false, false, true);
    }
}

// Função para exibir produtos na tabela de CRUD com botões de ação
function displayProductsForCrud(products) {
    const crudProductsTableBody = document.getElementById('crudProductsTableBody');
    if (crudProductsTableBody) {
        crudProductsTableBody.innerHTML = '';
        if (products.length === 0) {
            crudProductsTableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Nenhum produto encontrado para gerenciamento.</td></tr>';
        } else {
            products.forEach(product => {
                const row = crudProductsTableBody.insertRow();
                row.insertCell().textContent = product.id;
                row.insertCell().textContent = product.nome;
                row.insertCell().textContent = product.quantidadeEstoque;
                row.insertCell().textContent = `R$ ${parseFloat(product.precoVenda).toFixed(2).replace('.', ',')}`;

                const actionsCell = row.insertCell();
                const editButton = document.createElement('button');
                editButton.textContent = 'Editar';
                editButton.className = 'action-button small-button edit-button';
                editButton.onclick = () => editProduct(product.id);
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Excluir';
                deleteButton.className = 'action-button small-button delete-button';
                deleteButton.onclick = () => deleteProduct(product.id);
                actionsCell.appendChild(deleteButton);
            });
        }
        // Garante que o formulário está limpo e que a tabela de CRUD está visível
        document.getElementById('productCrudForm').reset();
        document.getElementById('productId').value = ''; // Limpa o ID oculto
        document.getElementById('saveProductButton').textContent = 'Salvar'; // Garante que o texto do botão seja 'Salvar'
        toggleTableVisibility(false, false, false, true);
    }
}

// Função para preencher o formulário com dados do produto para edição
async function editProduct(id) {
    try {
        const response = await fetch(`${BASE_URL}/api/produtos/${id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar produto para edição: ${response.status}`);
        }
        const product = await response.json();

        // Preenche o formulário
        document.getElementById('productId').value = product.id;
        document.getElementById('productCrudName').value = product.nome;
        document.getElementById('productCrudDescription').value = product.descricao;
        document.getElementById('productCrudStock').value = product.quantidadeEstoque;
        document.getElementById('productCrudCost').value = product.precoCusto;
        document.getElementById('productCrudSalePrice').value = product.precoVenda;

        document.getElementById('saveProductButton').textContent = 'Atualizar';
        // Rola a página para o formulário
        document.getElementById('manageProductsSection').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Erro ao carregar dados do produto para edição:', error);
        alert('Erro ao carregar dados do produto para edição: ' + error.message);
    }
}

// Função para excluir um produto
async function deleteProduct(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
        return; // Cancela se o usuário não confirmar
    }

    try {
        const response = await fetch(`${BASE_URL}/api/produtos/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Erro ao excluir produto: ${response.status} - ${errorBody.message || JSON.stringify(errorBody)}`);
        }

        alert('Produto excluído com sucesso!');
        fetchProductsForCrud(); // Recarrega a tabela de CRUD
        fetchProductsDataForChart(); // Atualiza o gráfico de estoque
        fetchWeeklySalesDataForChart(); // Atualiza o gráfico de vendas (se o produto estava em alguma venda que seria mostrada, embora menos comum)

    } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert('Falha ao excluir produto: ' + error.message);
    }
}

// Função para salvar (criar ou atualizar) um produto
async function saveProduct(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const productId = document.getElementById('productId').value;
    const productName = document.getElementById('productCrudName').value;
    const productDescription = document.getElementById('productCrudDescription').value;
    const productStock = parseInt(document.getElementById('productCrudStock').value);
    const productCost = parseFloat(document.getElementById('productCrudCost').value);
    const productSalePrice = parseFloat(document.getElementById('productCrudSalePrice').value);

    const productData = {
        nome: productName,
        descricao: productDescription,
        quantidadeEstoque: productStock,
        precoCusto: productCost,
        precoVenda: productSalePrice
    };

    let url = `${BASE_URL}/api/produtos`;
    let method = 'POST';

    if (productId) { // Se há um ID, é uma atualização
        url = `${BASE_URL}/api/produtos/${productId}`;
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`Erro ao salvar produto: ${response.status} - ${errorBody.message || JSON.stringify(errorBody)}`);
        }

        const savedProduct = await response.json();
        alert('Produto salvo com sucesso! ID: ' + savedProduct.id);

        document.getElementById('productCrudForm').reset(); // Limpa o formulário
        document.getElementById('productId').value = ''; // Limpa o ID oculto
        document.getElementById('saveProductButton').textContent = 'Salvar'; // Reseta o texto do botão

        fetchProductsForCrud(); // Recarrega a tabela de CRUD
        fetchProductsDataForChart(); // Atualiza o gráfico de estoque

    } catch (error) {
        console.error('Erro ao salvar produto:', error);
        alert('Falha ao salvar produto: ' + error.message);
    }
}

// --- FUNÇÕES PARA GRÁFICOS COM DADOS DA API ---

// Função para buscar dados de vendas e preparar para o gráfico de vendas semanais
async function fetchWeeklySalesDataForChart() {
    try {
        const response = await fetch(`${BASE_URL}/api/vendas`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar vendas para o gráfico: ${response.status}`);
        }
        const sales = await response.json();

        // Agregação dos dados por dia da semana
        const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const weeklySales = new Array(7).fill(0); // Inicializa com 0 para cada dia

        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        sales.forEach(sale => {
            const saleDate = new Date(sale.dataVenda);
            saleDate.setHours(0, 0, 0, 0);

            if (saleDate >= startOfWeek && saleDate <= now) {
                const dayIndex = saleDate.getDay();
                weeklySales[dayIndex] += parseFloat(sale.valorTotal);
            }
        });

        const labels = [...daysOfWeek.slice(1), daysOfWeek[0]];
        const data = [...weeklySales.slice(1), weeklySales[0]];

        renderWeeklySalesChart(labels, data);

    } catch (error) {
        console.error('Erro ao carregar dados de vendas para o gráfico:', error);
    }
}

// Função para renderizar o gráfico de vendas semanais
function renderWeeklySalesChart(labels, data) {
    const ctx = document.getElementById('weeklySalesChart').getContext('2d');

    if (weeklySalesChartInstance) {
        weeklySalesChartInstance.destroy();
    }

    weeklySalesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Vendas (R$)',
                data: data,
                backgroundColor: 'rgba(106, 75, 138, 0.7)',
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
                        callback: function (value) {
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
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
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
        const response = await fetch(`${BASE_URL}/api/produtos`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar produtos para o gráfico: ${response.status}`);
        }
        const products = await response.json();

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

    if (stockByProductChartInstance) {
        stockByProductChartInstance.destroy();
    }

    stockByProductChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Quantidade em Estoque',
                data: data,
                backgroundColor: [
                    'rgba(156, 139, 179, 0.7)',
                    'rgba(123, 107, 163, 0.7)',
                    'rgba(106, 75, 138, 0.7)',
                    'rgba(137, 115, 156, 0.7)',
                    'rgba(168, 153, 179, 0.7)',
                    'rgba(190, 170, 200, 0.7)',
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
                        precision: 0
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
                    display: false
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
            fetchWeeklySalesDataForChart();
            fetchProductsDataForChart();
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

    // REMOVA OU COMENTE ESTE BOTÃO ANTIGO 'CADASTRAR PRODUTO'
    const createProductButton = document.getElementById('createProductButton');
    if (createProductButton) {
        createProductButton.addEventListener('click', () => {
            alert('Funcionalidade: Cadastrar Produto ainda não implementada com a API.');
        });
    } else {
        console.warn("Botão 'Cadastrar Produto' não encontrado com o ID 'createProductButton'.");
    }
    // FIM DO BOTÃO ANTIGO

    const manageStockButton = document.getElementById('manageStockButton');
    if (manageStockButton) {
        manageStockButton.addEventListener('click', () => {
            alert('Funcionalidade: Gerenciar Estoque (simples) ainda não implementada com a API. Use "Gerenciar Produtos".');
        });
    } else {
        console.warn("Botão 'Gerenciar Estoque' não encontrado com o ID 'manageStockButton'.");
    }

    // NOVO Event Listener para o botão Listar Vendas (AGORA CORRETO)
    const listSalesButton = document.getElementById('listSalesButton');
    if (listSalesButton) {
        listSalesButton.addEventListener('click', fetchSales);
    } else {
        console.warn("Botão 'Listar Vendas' não encontrado com o ID 'listSalesButton'.");
    }

    // NOVO Event Listener para o botão Gerenciar Produtos (CRUD)
    const manageProductsButton = document.getElementById('manageProductsButton');
    if (manageProductsButton) {
        manageProductsButton.addEventListener('click', fetchProductsForCrud); // Chama a nova função
    } else {
        console.warn("Botão 'Gerenciar Produtos' não encontrado com o ID 'manageProductsButton'.");
    }


    // LÓGICA PARA O FORMULÁRIO DE CRUD DE PRODUTOS
    const productCrudForm = document.getElementById('productCrudForm');
    const cancelProductCrudButton = document.getElementById('cancelProductCrudButton');

    if (productCrudForm) {
        productCrudForm.addEventListener('submit', saveProduct); // Chama saveProduct ao submeter
    }

    if (cancelProductCrudButton) {
        cancelProductCrudButton.addEventListener('click', () => {
            document.getElementById('productCrudForm').reset(); // Limpa o formulário
            document.getElementById('productId').value = ''; // Limpa o ID oculto
            document.getElementById('saveProductButton').textContent = 'Salvar'; // Reseta o texto do botão
            toggleTableVisibility(false, false, false, false); // Oculta a seção de gerenciamento
        });
    }


    // Opcional: Oculta as tabelas inicialmente e mostra a mensagem de instrução
    toggleTableVisibility(false, false, false, false);
});

// Adiciona interatividade aos itens de navegação (mantido do código original)
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function () {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// Adiciona um pequeno efeito de escala ao clicar nos botões de ação (mantido do código original)
document.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', function () {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
})