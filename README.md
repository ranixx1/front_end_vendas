# Front-End do Sistema de Estoque e Vendas

Este repositório contém o código-fonte e os designs do **front-end** para um sistema de estoque e vendas. Ele complementa um projeto de **back-end desenvolvido em Java com Spring Boot**, fornecendo a interface de usuário para interação com os módulos de produtos, clientes e vendas.

## Visão Geral do Projeto

O objetivo deste projeto é criar uma interface intuitiva e responsiva que permita aos usuários (administradores, staff) gerenciar o estoque, cadastrar clientes, registrar vendas e visualizar relatórios de forma eficiente. O design está sendo prototipado no Figma, com a implementação em HTML, CSS e JavaScript.

## Tecnologias Utilizadas

* **Front-end:**
    * **HTML5:** Estruturação da interface.
    * **CSS3:** Estilização e responsividade, com foco em um design moderno e adaptativo. (Foi utilizado CSS puro com uma estrutura organizada e media queries para responsividade em vez de um framework CSS como o Tailwind CSS, embora este tenha sido uma consideração inicial.)
    * **JavaScript:** Lógica de interatividade, consumo da API e manipulação do DOM.
    * **Chart.js:** Biblioteca para a criação de gráficos dinâmicos de vendas e estoque.
    * **Font Awesome:** Para ícones na interface.
    * **Google Fonts (Poppins):** Para uma tipografia moderna e legível.
* **Back-end:**
    * **Java com Spring Boot:** Responsável pela lógica de negócio e API RESTful (repositório separado).

## Funcionalidades Implementadas

Atualmente, o front-end oferece as seguintes funcionalidades:

* **Dashboard Intuitivo:** Visão geral com saudação ao usuário e botões de ação rápidos.
* **Gráficos Dinâmicos:** Exibição de "Vendas Semanais" e "Estoque por Produto" com dados atualizados via API.
* **Listagem de Dados:**
    * **Produtos:** Exibe uma tabela com informações de produtos.
    * **Clientes:** Exibe uma tabela com informações de clientes.
    * **Vendas:** Exibe uma tabela com informações detalhadas das vendas.
* **Gerenciamento de Produtos (CRUD):**
    * Formulário para **cadastrar** e **editar** produtos.
    * Tabela com botões de ação para **editar** e **excluir** produtos existentes.
* **Responsividade:** Design adaptável a diferentes tamanhos de tela (desktop e mobile).

## Próximos Passos e Melhorias

* Implementação de formulários completos para registro de vendas (com seleção de cliente e itens).
* Implementação de funcionalidades CRUD completas para clientes.
* Páginas ou modais dedicados para relatórios mais detalhados.
* Otimização e refatoração do código JavaScript para maior modularidade.

## Designs e Wireframes (Figma)

Os designs iniciais para as telas da aplicação foram desenvolvidos no Figma, focando na usabilidade e na clareza do fluxo de usuário. Abaixo, você pode ver os wireframes e protótipos das principais telas:

| Tela de Login | Tela do Staff | Tela de Clientes |
| :------------: | :-----------: | :--------------: |
| ![Tela de Login](https://github.com/user-attachments/assets/a95c4b0c-f030-4344-ac47-2026bea015b7) | ![Tela do Staff](https://github.com/user-attachments/assets/5b7ac023-287d-4c97-99c9-c9bef9250753) | ![Tela de Clientes](https://github.com/user-attachments/assets/8250250a-8e68-42dd-96cc-feaa0c8e2e51) |

## Como Rodar o Projeto

Para rodar este projeto front-end localmente, siga os passos abaixo:

1.  **Pré-requisitos:**
    * Um navegador web moderno (Chrome, Firefox, Edge, Safari, etc.).
    * **Certifique-se de que o back-end Java com Spring Boot esteja rodando e acessível na URL configurada (`http://localhost:8080`).** Este front-end depende da API fornecida pelo back-end.

2.  **Clone o Repositório:**
    ```bash
    git clone [https://github.com/ranixx1/front_end_vendas.git]
    cd front_end_vendas
    ```

3.  **Abra o `index.html`:**
    * Simplesmente abra o arquivo `index.html` no seu navegador. Você pode fazer isso arrastando o arquivo para a janela do navegador ou clicando duas vezes nele no explorador de arquivos.
    * Alternativamente, você pode usar uma extensão de servidor local para VS Code (como "Live Server") para abrir o `index.html`, o que pode ser útil para desenvolvimento.

    ```bash
    # Se você tiver o Live Server no VS Code, clique com o botão direito em index.html
    # e selecione "Open with Live Server"
    ```

4.  **Verifique a Conexão com o Back-end:**
    * Certifique-se de que a `BASE_URL` no arquivo `src/js/sys.js` esteja configurada corretamente para o seu back-end (padrão é `http://localhost:8080`).
    * No navegador, abra o console (F12) para verificar se há erros de conexão ou de CORS se o back-end não estiver rodando ou configurado para permitir requisições do seu front-end.

---

### Observações sobre as sugestões:

* **Tecnologias Utilizadas:** Adicionei uma explicação sobre o uso do CSS puro.
* **Funcionalidades Implementadas:** Criei uma lista clara das funcionalidades que já estão operacionais, citando os arquivos relevantes.
* **Próximos Passos e Melhorias:** Adicionei uma seção para indicar o que ainda pode ser desenvolvido, o que é útil para colaboradores ou para seu próprio planejamento futuro.
* **Como Rodar o Projeto:** Incluí instruções detalhadas sobre como configurar e rodar o projeto localmente, o que é fundamental para qualquer repositório. Enfatizei a dependência do back-end.

O que você acha dessas sugestões? Podemos ajustá-las se tiver algo específico em mente!
