import * as dom from './dom.js';
import * as api from './api.js';
import { formatCurrency, formatDate } from './utils.js';
import { renderChart } from './chart.js';

// --- UI TOGGLING ---

export const showDashboard = (user) => {
    dom.authContainer.classList.add('hidden');
    dom.dashboardContainer.style.display = 'flex'; 
    dom.dashboardContainer.classList.remove('hidden');
    
    // Hide Admin nav, show user navs
    dom.adminNavItem.classList.add('hidden');
    dom.approvalsNavItem.classList.add('hidden');
    dom.distLucroNavItem.classList.add('hidden');
    document.querySelector('a[data-page="dashboard"]').parentElement.classList.remove('hidden');
    document.querySelector('a[data-page="perfil"]').parentElement.classList.remove('hidden');
    document.querySelector('a[data-page="deposito"]').parentElement.classList.remove('hidden');
    document.querySelector('a[data-page="saque"]').parentElement.classList.remove('hidden');
    document.querySelector('a[data-page="historico"]').parentElement.classList.remove('hidden');
    
    populateAllPages(user);
    switchPage('dashboard');
};

export const showAdminDashboard = () => {
    dom.authContainer.classList.add('hidden');
    dom.dashboardContainer.style.display = 'flex'; 
    dom.dashboardContainer.classList.remove('hidden');

    // Show Admin nav, hide user navs
    dom.adminNavItem.classList.remove('hidden');
    dom.approvalsNavItem.classList.remove('hidden');
    dom.distLucroNavItem.classList.remove('hidden');
    document.querySelector('a[data-page="dashboard"]').parentElement.classList.add('hidden');
    document.querySelector('a[data-page="perfil"]').parentElement.classList.add('hidden');
    document.querySelector('a[data-page="deposito"]').parentElement.classList.add('hidden');
    document.querySelector('a[data-page="saque"]').parentElement.classList.add('hidden');
    document.querySelector('a[data-page="historico"]').parentElement.classList.add('hidden');

    dom.welcomeMessage.textContent = `Bem-vindo, Admin!`;
    populateAdminTable();
    switchPage('admin');
};

export const showAuth = () => {
    dom.dashboardContainer.classList.add('hidden');
    dom.dashboardContainer.style.display = 'none'; 
    dom.authContainer.classList.remove('hidden');
    showLoginForm();
};

export const showLoginForm = () => {
    dom.loginForm.classList.remove('hidden');
    dom.registerForm.classList.add('hidden');
    dom.loginError.textContent = '';
};

export const showRegisterForm = () => {
    dom.loginForm.classList.add('hidden');
    dom.registerForm.classList.remove('hidden');
    dom.registerError.textContent = '';
};


// --- PAGE SWITCHING & POPULATION ---

export const switchPage = (pageId) => {
    // Hide all pages
    dom.pageContentWrappers.forEach(page => {
        page.classList.add('hidden');
    });
    // Show the target page
    const targetPage = document.getElementById(`page-${pageId}`);
    if(targetPage) {
        targetPage.classList.remove('hidden');
    }

    // Update active class in sidebar
    dom.sidebarNav.querySelectorAll('li').forEach(li => {
        li.classList.remove('active');
    });
    const activeLink = dom.sidebarNav.querySelector(`a[data-page="${pageId}"]`);
    if (activeLink) {
        activeLink.parentElement.classList.add('active');
    }
    
    // Repopulate page content in case data changed
    const loggedInInfo = api.getLoggedInInfo();
    if (loggedInInfo) {
        if (loggedInInfo.role === 'user') {
             const user = api.getCurrentUser();
             if (user) populateAllPages(user);
        } else if (loggedInInfo.role === 'admin') {
            if (pageId === 'admin') {
                populateAdminTable();
            } else if (pageId === 'admin-edit-user') {
                populateAdminEditUserPage();
            } else if (pageId === 'distribuicao-lucro') {
                populateProfitDistributionPage();
            } else if (pageId === 'approvals') {
                populateApprovalsTable();
            }
        }
    }
};

export const populateAllPages = (user) => {
    // Dashboard
    dom.welcomeMessage.textContent = `Bem-vindo de volta, ${user.fullName}!`;
    dom.valorInvestidoEl.textContent = formatCurrency(user.valorInvestido);
    dom.saldoAtualEl.textContent = formatCurrency(user.saldoAtual);
    dom.saldoDisponivelEl.textContent = formatCurrency(user.saldoDisponivel);
    renderChart();

    // Profile
    dom.profileFullnameInput.value = user.fullName;
    dom.profileUsernameInput.value = user.username;
    dom.profileEmailInput.value = user.email;
    dom.profilePasswordInput.value = '';

    // Withdrawal Page
    dom.withdrawAvailableBalance.textContent = formatCurrency(user.saldoDisponivel);

    // History
    populateHistoryTable(user);
};

export const populateProfitDistributionPage = () => {
    const users = api.getUsers();
    const listContainer = dom.specificUsersList;
    listContainer.innerHTML = '';
    
    users.forEach(user => {
        const item = document.createElement('div');
        item.className = 'user-checkbox-item';
        item.innerHTML = `
            <label>
                <input type="checkbox" value="${user.id}">
                ${user.fullName} (${user.username})
            </label>
        `;
        listContainer.appendChild(item);
    });

    dom.specificUsersListContainer.classList.add('hidden');
    dom.profitDistributionForm.reset();
    if(dom.profitDistMessage) {
        dom.profitDistMessage.textContent = '';
        dom.profitDistMessage.className = 'message';
    }
};

export const populateAdminEditUserPage = () => {
    const username = api.getAdminEditingUser();
    if (!username) {
        // If no user is being edited, redirect to the admin list
        switchPage('admin');
        return;
    }
    const user = api.getUserByUsername(username);
    if (!user) {
        console.error("User to edit not found:", username);
        switchPage('admin');
        return;
    }

    dom.adminEditUserSubtitle.textContent = `Modifique as informações de ${user.fullName}.`;
    dom.adminEditFullname.value = user.fullName;
    dom.adminEditUsername.value = user.username;
    dom.adminEditEmail.value = user.email;
    dom.adminEditValorInvestido.value = user.valorInvestido;
    dom.adminEditSaldoAtual.value = user.saldoAtual;
    dom.adminEditSaldoDisponivel.value = user.saldoDisponivel;
    dom.adminEditSuccess.textContent = ''; // Clear success message on page load
};

export const populateApprovalsTable = () => {
    const tableBody = dom.adminApprovalsTableBody;
    tableBody.innerHTML = '';
    const users = api.getUsers();
    let pendingTransactions = [];

    users.forEach(user => {
        if (user.transactions) {
            user.transactions.forEach(tx => {
                if (tx.status === 'Pendente') {
                    pendingTransactions.push({ ...tx, user });
                }
            });
        }
    });

    if (pendingTransactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5">Nenhuma transação pendente.</td></tr>';
        return;
    }
    
    // Sort by date, newest first
    pendingTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    pendingTransactions.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tx.user.fullName}</td>
            <td>${formatDate(new Date(tx.date))}</td>
            <td>${tx.type}</td>
            <td>${formatCurrency(tx.amount)}</td>
            <td class="approvals-actions">
                <button class="approval-action-btn approve" data-user-id="${tx.user.id}" data-tx-id="${tx.id}" data-action="approve">
                     <i data-feather="check" style="width: 16px; height: 16px;"></i> Aprovar
                </button>
                 <button class="approval-action-btn reject" data-user-id="${tx.user.id}" data-tx-id="${tx.id}" data-action="reject">
                     <i data-feather="x" style="width: 16px; height: 16px;"></i> Rejeitar
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    feather.replace();
};

export const populateAdminTable = () => {
    const tableBody = dom.adminUsersTableBody;
    tableBody.innerHTML = '';
    const users = api.getUsers();

    if (users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8">Nenhum usuário cadastrado.</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id.substring(0,8)}...</td>
            <td>${user.fullName}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${formatCurrency(user.valorInvestido)}</td>
            <td>${formatCurrency(user.saldoAtual)}</td>
            <td>${formatCurrency(user.saldoDisponivel)}</td>
            <td>
                <button class="edit-user-btn" data-username="${user.username}">
                    <i data-feather="edit-2" style="width: 16px; height: 16px;"></i>
                    Editar
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    // We added new icons, so we need to replace them
    feather.replace();
};

export const populateHistoryTable = (user) => {
    const tableBody = dom.historyTableBody;
    tableBody.innerHTML = ''; // Clear existing rows
    if (!user.transactions || user.transactions.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">Nenhuma transação encontrada.</td></tr>';
        return;
    }
    
    // Sort transactions by date descending before displaying
    const sortedTransactions = user.transactions.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedTransactions.forEach(tx => {
        const row = document.createElement('tr');
        const isProfitOrApprovedDeposit = (tx.type === 'Lucro') || (tx.type === 'Depósito' && tx.status === 'Aprovado');
        const isWithdrawal = tx.type === 'Saque';

        let amountHtml = '';
        if (isProfitOrApprovedDeposit) {
            amountHtml = `<td class="text-success">+${formatCurrency(tx.amount)}</td>`;
        } else if (isWithdrawal && tx.status === 'Aprovado') {
             amountHtml = `<td class="text-danger">-${formatCurrency(tx.amount)}</td>`;
        } else {
            amountHtml = `<td>${formatCurrency(tx.amount)}</td>`;
        }

        row.innerHTML = `
            <td>${formatDate(new Date(tx.date))}</td>
            <td>${tx.type}</td>
            ${amountHtml}
            <td><span class="status ${tx.status.toLowerCase().replace('ú', 'u')}">${tx.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
}