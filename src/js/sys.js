const BASE_URL = 'http://localhost:8080';

// Variáveis para armazenar as instâncias dos gráficos
let weeklySalesChartInstance;
let stockByProductChartInstance;

// --- Funções de interação com o Back-end ---

// Função auxiliar para controlar a visibilidade das tabelas e mensagens
// AGORA COM TODOS OS 5 PARÂMETROS
function toggleTableVisibility(productsVisible, clientsVisible, salesVisible, manageProductsVisible, registerSaleVisible) { // Adicionado registerSaleVisible
    const productsTableTitle = document.getElementById('productsTableTitle');
    const productsTableContainer = document.getElementById('productsTableContainer');
    const clientsTableTitle = document.getElementById('clientsTableTitle');
    const clientsTableContainer = document.getElementById('clientsTableContainer');
    const salesTableTitle = document.getElementById('salesTableTitle');
    const salesTableContainer = document.getElementById('salesTableContainer');
    const manageProductsSection = document.getElementById('manageProductsSection');
    const registerSaleSection = document.getElementById('registerSaleSection'); // Nova referência

    const initialMessage = document.getElementById('initialMessage');

    if (productsTableTitle) productsTableTitle.style.display = productsVisible ? 'block' : 'none';
    if (productsTableContainer) productsTableContainer.style.display = productsVisible ? 'block' : 'none';
    if (clientsTableTitle) clientsTableTitle.style.display = clientsVisible ? 'block' : 'none';
    if (clientsTableContainer) clientsTableContainer.style.display = clientsVisible ? 'block' : 'none';

    if (salesTableTitle) salesTableTitle.style.display = salesVisible ? 'block' : 'none';
    if (salesTableContainer) salesTableContainer.style.display = salesVisible ? 'block' : 'none';

    if (manageProductsSection) manageProductsSection.style.display = manageProductsVisible ? 'block' : 'none';
    if (registerSaleSection) registerSaleSection.style.display = registerSaleVisible ? 'block' : 'none'; // Controla a visibilidade do formulário de venda

    if (initialMessage) {
        // Ajusta a condição para incluir todas as seções
        initialMessage.style.display = (!productsVisible && !clientsVisible && !salesVisible && !manageProductsVisible && !registerSaleVisible) ? 'block' : 'none';
    }
}

// Função para buscar produtos do seu back-end
async function fetchProducts() {
    try {
        // CHAMADA ATUALIZADA: Adicionado o quinto 'false'
        toggleTableVisibility(false, false, false, false, false); // Oculta tudo antes de carregar
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
        // CHAMADA ATUALIZADA: Adicionado o quinto 'false'
        toggleTableVisibility(true, false, false, false, false); // Mostra o título e a tabela com a mensagem de erro
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
        // CHAMADA ATUALIZADA: Adicionado o quinto 'false'
        toggleTableVisibility(true, false, false, false, false); // Mostra a tabela de produtos, esconde a de clientes
    }
}

// Função para buscar clientes do seu back-end
async function fetchClients() {
    try {
        // CHAMADA ATUALIZADA: Adicionado o quinto 'false'
        toggleTableVisibility(false, false, false, false, false); // Oculta tudo antes de carregar
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
        // CHAMADA ATUALIZADA: Adicionado o quinto 'false'
        toggleTableVisibility(false, true, false, false, false); // Mostra o título e a tabela com a mensagem de erro
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
        // CHAMADA ATUALIZADA: Adicionado o quinto 'false'
        toggleTableVisibility(false, true, false, false, false); // Mostra a tabela de clientes, esconde a de produtos
    }
}

// Função para buscar vendas do seu back-end
async function fetchSales() {
    try {
        toggleTableVisibility(false, false, false, false, false); // Oculta tudo antes de carregar
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
        toggleTableVisibility(false, false, true, false, false); // Adicionado quinto false
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
        toggleTableVisibility(false, false, true, false, false); // Adicionado quinto false
    }
}

// --- FUNÇÃO ORIGINAL registerSale() MODIFICADA ---
async function showRegisterSaleForm() {
    toggleTableVisibility(false, false, false, false, true); // Mostra apenas o formulário de registro de venda
    const saleClientSelect = document.getElementById('saleClientSelect');
    const saleItemsContainer = document.getElementById('saleItemsContainer');
    saleItemsContainer.innerHTML = ''; // Limpa itens existentes

    await populateClientSelect(saleClientSelect);
    addSaleItemRow(); // Adiciona uma linha de item inicial

    // Reseta o cálculo do total
    updateSaleTotalPrice();
}

// Nova função para popular o select de clientes
async function populateClientSelect(selectElement) {
    selectElement.innerHTML = '<option value="">Carregando Clientes...</option>';
    try {
        const response = await fetch(`${BASE_URL}/api/clientes`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar clientes: ${response.status}`);
        }
        const clients = await response.json();
        selectElement.innerHTML = '<option value="">Selecione um Cliente</option>'; // Opção padrão
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.nome;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao popular clientes:', error);
        selectElement.innerHTML = '<option value="">Erro ao carregar clientes</option>';
    }
}

// Nova função para popular o select de produtos
let availableProducts = []; // Para armazenar produtos e seus preços
async function populateProductSelect(selectElement) {
    selectElement.innerHTML = '<option value="">Carregando Produtos...</option>';
    try {
        const response = await fetch(`${BASE_URL}/api/produtos`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar produtos: ${response.status}`);
        }
        availableProducts = await response.json(); // Armazena os produtos
        selectElement.innerHTML = '<option value="">Selecione um Produto</option>'; // Opção padrão
        availableProducts.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.nome} (Estoque: ${product.quantidadeEstoque})`;
            option.dataset.price = product.precoVenda; // Armazena o preço de venda no dataset
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error('Erro ao popular produtos:', error);
        selectElement.innerHTML = '<option value="">Erro ao carregar produtos</option>';
    }
}

// Adiciona uma nova linha para item de venda
function addSaleItemRow() {
    const saleItemsContainer = document.getElementById('saleItemsContainer');
    const itemRow = document.createElement('div');
    itemRow.className = 'sale-item-row';
    itemRow.innerHTML = `
        <select class="sale-product-select" required>
            <!-- Produtos serão carregados aqui -->
        </select>
        <input type="number" class="sale-item-quantity" value="1" min="1" required>
        <button type="button" class="action-button small-button delete-item-button">Remover</button>
    `;
    saleItemsContainer.appendChild(itemRow);

    const productSelect = itemRow.querySelector('.sale-product-select');
    populateProductSelect(productSelect); // Popula o novo select de produto
    
    // Adiciona event listener para mudança de produto ou quantidade
    productSelect.addEventListener('change', updateSaleTotalPrice);
    itemRow.querySelector('.sale-item-quantity').addEventListener('input', updateSaleTotalPrice);
    itemRow.querySelector('.delete-item-button').addEventListener('click', () => {
        itemRow.remove();
        updateSaleTotalPrice(); // Atualiza o total ao remover
    });

    updateSaleTotalPrice(); // Atualiza o total ao adicionar uma nova linha
}

// Calcula e atualiza o total da venda
function updateSaleTotalPrice() {
    let total = 0;
    document.querySelectorAll('.sale-item-row').forEach(row => {
        const productId = row.querySelector('.sale-product-select').value;
        const quantity = parseInt(row.querySelector('.sale-item-quantity').value);

        if (productId && quantity > 0) {
            const selectedProduct = availableProducts.find(p => p.id == productId);
            if (selectedProduct) {
                total += selectedProduct.precoVenda * quantity;
            }
        }
    });
    document.getElementById('saleTotalPrice').textContent = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
}

// Função para submeter o formulário de venda
async function submitSaleForm(event) {
    event.preventDefault();

    const clientId = document.getElementById('saleClientSelect').value;
    const items = [];
    let isValid = true;

    document.querySelectorAll('.sale-item-row').forEach(row => {
        const productId = row.querySelector('.sale-product-select').value;
        const quantity = parseInt(row.querySelector('.sale-item-quantity').value);

        if (!productId || quantity <= 0) {
            isValid = false;
            alert('Por favor, selecione um produto e insira uma quantidade válida para todos os itens.');
            return;
        }
        items.push({ produtoId: parseInt(productId), quantidade: quantity });
    });

    if (!isValid || !clientId) {
        alert('Por favor, selecione um cliente e verifique todos os itens da venda.');
        return;
    }

    const saleData = {
        clienteId: parseInt(clientId),
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
        alert('Venda registrada com sucesso! ID: ' + newSale.id + '\nValor Total: ' + new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(newSale.valorTotal));

        // Limpa o formulário e volta para a visão inicial
        document.getElementById('saleRegistrationForm').reset();
        document.getElementById('saleItemsContainer').innerHTML = ''; // Limpa os itens
        toggleTableVisibility(false, false, false, false, false); // Oculta tudo

        // Atualiza gráficos e listagens
        fetchWeeklySalesDataForChart();
        fetchProductsDataForChart();
        fetchSales(); // Opcional: para ver a venda na lista
        fetchProducts(); // Opcional: para ver a atualização do estoque
    } catch (error) {
        console.error('Erro ao registrar venda:', error);
        alert('Falha ao registrar venda: ' + error.message);
    }
}


// --- FUNÇÕES PARA GERENCIAMENTO DE PRODUTOS (CRUD) ---

// Função para buscar produtos para a tabela de CRUD
async function fetchProductsForCrud() {
    try {
        toggleTableVisibility(false, false, false, true, false); // Mostra a seção de Gerenciar Produtos
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
        toggleTableVisibility(false, false, false, true, false);
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
        toggleTableVisibility(false, false, false, true, false);
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
    const canvas = document.getElementById('stockByProductChart');
    const ctx = canvas.getContext('2d');

    if (stockByProductChartInstance) {
        stockByProductChartInstance.destroy();
    }

    if (data.length === 0) {
        // Se não houver dados, desenha uma mensagem no canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        ctx.font = '16px Poppins';
        ctx.fillStyle = '#888';
        ctx.textAlign = 'center';
        ctx.fillText('Nenhum produto em estoque para exibir.', canvas.width / 2, canvas.height / 2);
        return; // Sai da função, não tenta criar o gráfico
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

    // Botão Registrar Venda - AGORA CHAMA O FORMULÁRIO
    const registerSaleButton = document.getElementById('registerSaleButton');
    if (registerSaleButton) {
        registerSaleButton.addEventListener('click', showRegisterSaleForm); // Chama a nova função
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
            toggleTableVisibility(false, false, false, false, false); // Oculta a seção de gerenciamento
        });
    }

    // --- NOVOS LISTENERS PARA O FORMULÁRIO DE REGISTRO DE VENDA ---
    const saleRegistrationForm = document.getElementById('saleRegistrationForm');
    const addSaleItemButton = document.getElementById('addSaleItemButton');
    const cancelSaleRegistrationButton = document.getElementById('cancelSaleRegistrationButton');

    if (saleRegistrationForm) {
        saleRegistrationForm.addEventListener('submit', submitSaleForm);
    }
    if (addSaleItemButton) {
        addSaleItemButton.addEventListener('click', addSaleItemRow);
    }
    if (cancelSaleRegistrationButton) {
        cancelSaleRegistrationButton.addEventListener('click', () => {
            document.getElementById('saleRegistrationForm').reset();
            document.getElementById('saleItemsContainer').innerHTML = ''; // Limpa os itens
            document.getElementById('saleTotalPrice').textContent = 'R$ 0,00';
            toggleTableVisibility(false, false, false, false, false); // Oculta o formulário de venda
        });
    }

    // Opcional: Oculta as tabelas inicialmente e mostra a mensagem de instrução
    toggleTableVisibility(false, false, false, false, false); // Atualizado para 5 parâmetros
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
