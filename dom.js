// --- DOM ELEMENTS ---
export const authContainer = document.getElementById('auth-container');
export const dashboardContainer = document.getElementById('dashboard-container');
export const loginForm = document.getElementById('login-form');
export const registerForm = document.getElementById('register-form');
export const showRegisterLink = document.getElementById('show-register');
export const showLoginLink = document.getElementById('show-login');
export const logoutBtn = document.getElementById('logout-btn');
export const sidebarNav = document.querySelector('.sidebar-nav');
export const authTabs = document.querySelector('.auth-tabs');
export const userTab = document.getElementById('user-tab');
export const adminTab = document.getElementById('admin-tab');

// Error & Success message elements
export const loginError = document.getElementById('login-error');
export const registerError = document.getElementById('register-error');
export const profileSuccess = document.getElementById('profile-success');
export const depositMessage = document.getElementById('deposit-message');
export const withdrawMessage = document.getElementById('withdraw-message');
export const profitDistMessage = document.getElementById('profit-dist-message');

// Forms
export const profileForm = document.getElementById('profile-form');
export const depositForm = document.getElementById('deposit-form');
export const withdrawForm = document.getElementById('withdraw-form');
export const profitDistributionForm = document.getElementById('profit-distribution-form');

// Page Content
export const pageContentWrappers = document.querySelectorAll('.page-content');
export const adminNavItem = document.getElementById('admin-nav-item');
export const approvalsNavItem = document.getElementById('approvals-nav-item');
export const distLucroNavItem = document.getElementById('dist-lucro-nav-item');
export const welcomeMessage = document.getElementById('welcome-message');

// Dashboard Page elements
export const valorInvestidoEl = document.getElementById('valor-investido');
export const saldoAtualEl = document.getElementById('saldo-atual');
export const saldoDisponivelEl = document.getElementById('saldo-disponivel');

// Withdrawal page elements
export const withdrawAvailableBalance = document.getElementById('withdraw-available-balance');

// Profile Page elements
export const profileFullnameInput = document.getElementById('profile-fullname');
export const profileUsernameInput = document.getElementById('profile-username');
export const profileEmailInput = document.getElementById('profile-email');
export const profilePasswordInput = document.getElementById('profile-password');

// Admin Page elements
export const adminUsersTableBody = document.querySelector('#admin-users-table tbody');
export const adminEditUserPage = document.getElementById('page-admin-edit-user');
export const adminEditUserForm = document.getElementById('admin-edit-user-form');
export const adminEditUserSubtitle = document.getElementById('admin-edit-user-subtitle');
export const adminEditFullname = document.getElementById('admin-edit-fullname');
export const adminEditUsername = document.getElementById('admin-edit-username');
export const adminEditEmail = document.getElementById('admin-edit-email');
export const adminEditValorInvestido = document.getElementById('admin-edit-valorInvestido');
export const adminEditSaldoAtual = document.getElementById('admin-edit-saldoAtual');
export const adminEditSaldoDisponivel = document.getElementById('admin-edit-saldoDisponivel');
export const adminEditSuccess = document.getElementById('admin-edit-success');
export const adminEditBackBtn = document.getElementById('admin-edit-back-btn');

// Approvals Page elements
export const adminApprovalsTableBody = document.querySelector('#approvals-table tbody');

// History Page elements
export const historyTableBody = document.querySelector('#history-table tbody');

// Profit Distribution Page elements
export const profitPercentageInput = document.getElementById('profit-percentage');
export const targetUsersRadios = document.querySelectorAll('input[name="target-users"]');
export const specificUsersListContainer = document.getElementById('specific-users-list-container');
export const specificUsersList = document.getElementById('specific-users-list');

// Auth Form elements
export const loginTitle = document.getElementById('login-title');
export const loginSubtitle = document.getElementById('login-subtitle');
export const toggleRegisterP = document.getElementById('toggle-register-p');