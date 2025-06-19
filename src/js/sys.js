// src/js/sys.js

const BASE_URL = 'http://localhost:8080'; 

async function fetchProducts() {
    try {
        const productsListElement = document.getElementById('products-list');
        const clientsListElement = document.getElementById('clients-list');
        if (productsListElement) productsListElement.innerHTML = '<li>Carregando produtos...</li>';
        if (clientsListElement) clientsListElement.innerHTML = '';

        const response = await fetch(`${BASE_URL}/api/produtos`);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const products = await response.json();
        console.log('Produtos do Back-end:', products);
        displayProducts(products); 

    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        const productsListElement = document.getElementById('products-list');
        if (productsListElement) productsListElement.innerHTML = `<li style="color: red;">Erro ao carregar produtos: ${error.message}</li>`;
    }
}

function displayProducts(products) {
    const productsListElement = document.getElementById('products-list');
    if (productsListElement) {
        productsListElement.innerHTML = ''; 
        if (products.length === 0) {
            productsListElement.innerHTML = '<li>Nenhum produto encontrado.</li>';
            return;
        }
        products.forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = `ID: ${product.id}, Nome: ${product.nome}, Estoque: ${product.quantidadeEstoque}, Preço Venda: ${product.precoVenda}`;
            productsListElement.appendChild(listItem);
        });
    }
}

async function fetchClients() {
    try {
        const clientsListElement = document.getElementById('clients-list');
        const productsListElement = document.getElementById('products-list');
        if (clientsListElement) clientsListElement.innerHTML = '<li>Carregando clientes...</li>';
        if (productsListElement) productsListElement.innerHTML = '';

        const response = await fetch(`${BASE_URL}/api/clientes`);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const clients = await response.json();
        console.log('Clientes do Back-end:', clients);
        displayClients(clients);

    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        const clientsListElement = document.getElementById('clients-list');
        if (clientsListElement) clientsListElement.innerHTML = `<li style="color: red;">Erro ao carregar clientes: ${error.message}</li>`;
    }
}

function displayClients(clients) {
    const clientsListElement = document.getElementById('clients-list');
    if (clientsListElement) {
        clientsListElement.innerHTML = ''; 
        if (clients.length === 0) {
            clientsListElement.innerHTML = '<li>Nenhum cliente encontrado.</li>';
            return;
        }
        clients.forEach(client => {
            const listItem = document.createElement('li');
            listItem.textContent = `ID: ${client.id}, Nome: ${client.nome}, Documento: ${client.documento}, Email: ${client.email}`;
            clientsListElement.appendChild(listItem);
        });
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

    } catch (error) {
        console.error('Erro ao registrar venda:', error);
        alert('Falha ao registrar venda: ' + error.message);
    }
}

// --- Lógica de UI (Mantida ou adaptada) ---

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


// --- Event Listeners para os botões ---
document.addEventListener('DOMContentLoaded', () => {
    const registerSaleButton = document.getElementById('registerSaleButton');
    if (registerSaleButton) {
        registerSaleButton.addEventListener('click', registerSale);
    } else {
        console.warn("Botão 'Registrar Venda' não encontrado com o ID 'registerSaleButton'.");
    }

    const listClientsButton = document.getElementById('listClientsButton');
    if (listClientsButton) {
        listClientsButton.addEventListener('click', fetchClients);
    } else {
        console.warn("Botão 'Listar Clientes' não encontrado com o ID 'listClientsButton'.");
    }

    const listProductsButton = document.getElementById('listProductsButton');
    if (listProductsButton) {
        listProductsButton.addEventListener('click', fetchProducts);
    } else {
        console.warn("Botão 'Listar Produtos' não encontrado com o ID 'listProductsButton'.");
    }

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
});