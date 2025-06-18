# InvestCo Dashboard - Painel Financeiro

Este é um projeto de um painel de controle financeiro completo, construído inteiramente com HTML, CSS e JavaScript vanilla. Ele funciona como uma aplicação de página única (SPA) e utiliza `localStorage` para simular um banco de dados, o que significa que todos os dados são armazenados localmente no seu navegador.

O projeto foi desenvolvido para ser executado diretamente em um navegador, sem a necessidade de um servidor de backend ou processo de compilação.

## Funcionalidades

- **Autenticação de Usuário e Admin:** Telas de login e cadastro separadas para usuários e administradores.
- **Dashboard do Usuário:**
    - Visualização de "Valor Investido", "Saldo Atual" e "Saldo Disponível".
    - Gráfico de evolução do patrimônio.
    - Solicitação de Depósitos e Saques.
    - Histórico de transações com status (Aprovado, Pendente, Rejeitado).
    - Edição do perfil do usuário.
- **Painel do Administrador:**
    - Visualização e gerenciamento de todos os usuários cadastrados.
    - Edição de informações financeiras e de perfil dos usuários.
    - Aprovação ou rejeição de depósitos e saques pendentes.
    - Distribuição de lucros em porcentagem para todos ou para usuários específicos.

## Como Executar

Como este é um projeto puramente front-end, você pode executá-lo de duas maneiras fáceis:

### 1. Abrindo o `index.html` (Simples)

1.  Clone ou baixe este repositório.
2.  Navegue até a pasta do projeto.
3.  Abra o arquivo `index.html` diretamente no seu navegador preferido (como Chrome, Firefox, etc.).

### 2. Usando um Servidor Local (Recomendado)

Para uma experiência mais próxima de um ambiente de produção real, você pode usar um servidor local simples.

1.  Certifique-se de ter o Node.js instalado.
2.  Instale o pacote `live-server` globalmente (se ainda não o tiver):
    ```bash
    npm install -g live-server
    ```
3.  Navegue até a pasta do projeto pelo terminal.
4.  Execute o comando:
    ```bash
    live-server
    ```
5.  Seu navegador abrirá automaticamente com o projeto em execução.

## Credenciais de Acesso

Para testar a aplicação, utilize as seguintes credenciais:

### Acesso de Usuário
- **Usuário:** `user`
- **Senha:** `user`

### Acesso de Administrador
- **Usuário:** `Filipe`
- **Senha:** `Filipe`

Você também pode criar novas contas de usuário através da tela de cadastro.

