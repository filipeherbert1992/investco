import * as dom from './dom.js';
import * as ui from './ui.js';
import * as auth from './auth.js';
import * as api from './api.js';
import { formatCurrency } from './utils.js';

let currentLoginMode = 'user'; // 'user' or 'admin'

export function handleAdminTableClick(e) {
    const editButton = e.target.closest('.edit-user-btn');
    if (editButton) {
        e.preventDefault();
        const username = editButton.dataset.username;
        api.setAdminEditingUser(username);
        ui.switchPage('admin-edit-user');
    }
}

export function handleAuthTabClick(e) {
    if (e.target.tagName !== 'BUTTON') return;

    dom.userTab.classList.remove('active');
    dom.adminTab.classList.remove('active');
    e.target.classList.add('active');
    
    if (e.target === dom.adminTab) {
        currentLoginMode = 'admin';
        dom.loginTitle.textContent = 'Login Admin';
        dom.loginSubtitle.textContent = 'Acesse o painel administrativo.';
        ui.showLoginForm();
        dom.registerForm.classList.add('hidden');
        dom.toggleRegisterP.classList.add('hidden');
    } else {
        currentLoginMode = 'user';
        dom.loginTitle.textContent = 'Login';
        dom.loginSubtitle.textContent = 'Acesse sua conta para ver seu dashboard.';
        dom.toggleRegisterP.classList.remove('hidden');
    }
}

export function handleSidebarNavClick(e) {
    const link = e.target.closest('a');
    if (link && link.dataset.page) {
        e.preventDefault();
        ui.switchPage(link.dataset.page);
    }
}

export function handleShowRegisterClick(e) {
    e.preventDefault();
    ui.showRegisterForm();
}

export function handleShowLoginClick(e) {
    e.preventDefault();
    ui.showLoginForm();
}

export function handleRegistration(e) {
    e.preventDefault();
    dom.registerError.textContent = '';
    const registrationData = {
        fullName: dom.registerForm.querySelector('#register-fullname').value,
        username: dom.registerForm.querySelector('#register-username').value,
        email: dom.registerForm.querySelector('#register-email').value,
        password: dom.registerForm.querySelector('#register-password').value
    };

    const result = auth.handleRegister(registrationData);
    if (!result.success) {
        dom.registerError.textContent = result.message;
    }
}

export function handleLogin(e) {
    e.preventDefault();
    dom.loginError.textContent = '';
    const username = dom.loginForm.querySelector('#login-username').value;
    const password = dom.loginForm.querySelector('#login-password').value;

    const result = auth.handleLogin(username, password, currentLoginMode);

    if (!result.success) {
        dom.loginError.textContent = result.message;
    }
}

export function handleProfitDistribution(e) {
    e.preventDefault();
    dom.profitDistMessage.textContent = '';
    dom.profitDistMessage.className = 'message';

    const percentage = parseFloat(dom.profitPercentageInput.value);
    const target = document.querySelector('input[name="target-users"]:checked').value;

    if (isNaN(percentage) || percentage <= 0) {
        dom.profitDistMessage.textContent = 'Por favor, insira uma porcentagem válida.';
        dom.profitDistMessage.classList.add('error-message-inline');
        return;
    }

    let usersToUpdate = [];
    const allUsers = api.getUsers();

    if (target === 'all') {
        usersToUpdate = allUsers;
    } else {
        const selectedUserIds = [...dom.specificUsersList.querySelectorAll('input:checked')].map(input => input.value);
        if (selectedUserIds.length === 0) {
            dom.profitDistMessage.textContent = 'Por favor, selecione ao menos um usuário.';
            dom.profitDistMessage.classList.add('error-message-inline');
            return;
        }
        usersToUpdate = allUsers.filter(u => selectedUserIds.includes(u.id));
    }

    usersToUpdate.forEach(user => {
        const profitAmount = user.saldoAtual * (percentage / 100);
        user.saldoAtual += profitAmount;
        user.saldoDisponivel += profitAmount;
        
        if (!user.transactions) {
            user.transactions = [];
        }
        user.transactions.push({
            date: new Date(),
            type: 'Lucro',
            amount: profitAmount,
            status: 'Concluído'
        });

        api.updateUser(user);
    });

    dom.profitDistMessage.textContent = `Lucro de ${percentage}% distribuído para ${usersToUpdate.length} usuário(s) com sucesso!`;
    dom.profitDistMessage.classList.add('success-message');
    dom.profitDistributionForm.reset();
    ui.populateProfitDistributionPage(); // Repopulate to reset state

    setTimeout(() => {
        dom.profitDistMessage.textContent = '';
        dom.profitDistMessage.className = 'message';
    }, 4000);
}

export function handleTargetUserRadioChange(e) {
    if (e.target.value === 'specific') {
        dom.specificUsersListContainer.classList.remove('hidden');
    } else {
        dom.specificUsersListContainer.classList.add('hidden');
    }
}

export function handleLogout(e) {
    e.preventDefault();
    auth.logout();
}

export function handleAdminUserUpdate(e) {
    e.preventDefault();
    dom.adminEditSuccess.textContent = '';
    
    const username = api.getAdminEditingUser();
    if (!username) return;

    let user = api.getUserByUsername(username);
    if (!user) {
        // Handle case where user is not found, maybe show an error
        console.error("User to edit not found:", username);
        return;
    }

    // Create a new object to avoid issues with object references
    let updatedUser = { ...user };
    updatedUser.fullName = dom.adminEditFullname.value;
    updatedUser.email = dom.adminEditEmail.value;
    updatedUser.valorInvestido = parseFloat(dom.adminEditValorInvestido.value);
    updatedUser.saldoAtual = parseFloat(dom.adminEditSaldoAtual.value);
    updatedUser.saldoDisponivel = parseFloat(dom.adminEditSaldoDisponivel.value);

    const result = api.updateUser(updatedUser);

    if (result.success) {
        dom.adminEditSuccess.textContent = 'Usuário atualizado com sucesso!';
        setTimeout(() => {
            dom.adminEditSuccess.textContent = '';
        }, 3000);
    } else {
        // Handle error case if api.updateUser can fail
        console.error("Failed to update user:", result.message);
    }
}

export function handleAdminEditBack(e) {
    e.preventDefault();
    api.clearAdminEditingUser();
    ui.switchPage('admin');
}

export function handleProfileUpdate(e) {
    e.preventDefault();
    dom.profileSuccess.textContent = '';
    const user = api.getCurrentUser();
    if (!user) return;
    
    user.fullName = dom.profileFullnameInput.value;
    user.email = dom.profileEmailInput.value;
    const newPassword = dom.profilePasswordInput.value;
    if(newPassword) {
        user.password = newPassword;
    }
    
    api.updateCurrentUser(user);
    ui.populateAllPages(user); // refresh displayed name on dashboard etc.
    
    dom.profileSuccess.textContent = 'Perfil atualizado com sucesso!';
    setTimeout(() => dom.profileSuccess.textContent = '', 3000);
}

export function handleDeposit(e) {
    e.preventDefault();
    dom.depositMessage.textContent = '';
    const amount = parseFloat(dom.depositForm.querySelector('#deposit-amount').value);
    
    if (isNaN(amount) || amount <= 0) {
        dom.depositMessage.textContent = 'Por favor, insira um valor válido.';
        dom.depositMessage.classList.remove('success-message');
        dom.depositMessage.classList.add('error-message-inline');
        return;
    }

    const user = api.getCurrentUser();
    
    if (!user.transactions) user.transactions = [];

    user.transactions.push({
        id: 'tx_' + Date.now() + Math.random().toString(36).substring(2, 9),
        date: new Date(),
        type: 'Depósito',
        amount: amount,
        status: 'Pendente'
    });
    
    api.updateCurrentUser(user);
    ui.populateAllPages(user);
    dom.depositForm.reset();

    dom.depositMessage.innerHTML = `Solicitação de depósito de ${formatCurrency(amount)} enviada para aprovação.`;
    dom.depositMessage.classList.add('success-message');
    dom.depositMessage.classList.remove('error-message-inline');
    setTimeout(() => dom.depositMessage.textContent = '', 4000);
}

export function handleWithdrawal(e) {
    e.preventDefault();
    dom.withdrawMessage.textContent = '';
    dom.withdrawMessage.className = 'message';
    const amount = parseFloat(dom.withdrawForm.querySelector('#withdraw-amount').value);
    
    const user = api.getCurrentUser();

    if (isNaN(amount) || amount <= 0) {
        dom.withdrawMessage.textContent = 'Por favor, insira um valor válido.';
        dom.withdrawMessage.classList.add('error-message-inline');
        return;
    }
    
    if (amount > user.saldoDisponivel) {
        dom.withdrawMessage.textContent = 'Saldo disponível insuficiente.';
        dom.withdrawMessage.classList.add('error-message-inline');
        return;
    }

    // Deduct from available balance immediately to hold the funds
    user.saldoDisponivel -= amount;
    
    if (!user.transactions) user.transactions = [];

    user.transactions.push({
        id: 'tx_' + Date.now() + Math.random().toString(36).substring(2, 9),
        date: new Date(),
        type: 'Saque',
        amount: amount,
        status: 'Pendente'
    });

    api.updateCurrentUser(user);
    ui.populateAllPages(user);
    dom.withdrawForm.reset();

    dom.withdrawMessage.textContent = `Solicitação de saque de ${formatCurrency(amount)} enviada para aprovação.`;
    dom.withdrawMessage.classList.add('success-message');
    setTimeout(() => dom.withdrawMessage.textContent = '', 4000);
}

export function handleAdminApprovalsTableClick(e) {
    const actionButton = e.target.closest('.approval-action-btn');
    if (actionButton) {
        e.preventDefault();
        const { userId, txId, action } = actionButton.dataset;
        api.processTransaction(userId, txId, action);
        // Refresh the approvals page to show the updated list
        ui.switchPage('approvals');
    }
}