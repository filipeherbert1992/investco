import * as dom from './dom.js';
import * as handlers from './handlers.js';
import { checkLoggedInUser } from './auth.js';

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Replace Feather icons
    feather.replace();

    // --- EVENT LISTENERS ---
    dom.authTabs.addEventListener('click', handlers.handleAuthTabClick);
    dom.sidebarNav.addEventListener('click', handlers.handleSidebarNavClick);
    dom.showRegisterLink.addEventListener('click', handlers.handleShowRegisterClick);
    dom.showLoginLink.addEventListener('click', handlers.handleShowLoginClick);
    dom.registerForm.addEventListener('submit', handlers.handleRegistration);
    dom.loginForm.addEventListener('submit', handlers.handleLogin);
    dom.logoutBtn.addEventListener('click', handlers.handleLogout);
    dom.profileForm.addEventListener('submit', handlers.handleProfileUpdate);
    dom.depositForm.addEventListener('submit', handlers.handleDeposit);
    dom.withdrawForm.addEventListener('submit', handlers.handleWithdrawal);
    dom.adminUsersTableBody.addEventListener('click', handlers.handleAdminTableClick);
    dom.adminApprovalsTableBody.addEventListener('click', handlers.handleAdminApprovalsTableClick);
    dom.adminEditUserForm.addEventListener('submit', handlers.handleAdminUserUpdate);
    dom.adminEditBackBtn.addEventListener('click', handlers.handleAdminEditBack);
    dom.profitDistributionForm.addEventListener('submit', handlers.handleProfitDistribution);
    dom.profitDistributionForm.querySelectorAll('input[name="target-users"]').forEach(radio => {
        radio.addEventListener('change', handlers.handleTargetUserRadioChange);
    });
    
    // Check for logged in user on page load
    checkLoggedInUser();
});