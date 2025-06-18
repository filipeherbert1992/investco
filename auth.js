import * as api from './api.js';
import * as ui from './ui.js';

export function checkLoggedInUser() {
    const loggedInInfo = api.getLoggedInInfo();
    if (loggedInInfo) {
         if (loggedInInfo.role === 'admin') {
            ui.showAdminDashboard();
        } else {
            const user = api.getCurrentUser();
            if (user) {
                ui.showDashboard(user);
            } else {
                // Data inconsistency, log out
                logout();
            }
        }
    } else {
        ui.showAuth();
    }
}

export function handleLogin(username, password, mode) {
    if (mode === 'admin') {
        if (username === 'Filipe' && password === 'Filipe') {
            api.setLoggedInInfo('admin', 'admin');
            ui.showAdminDashboard();
            return { success: true };
        } else {
            return { success: false, message: 'Credenciais de admin inválidas.' };
        }
    }

    const users = api.getUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        api.setLoggedInInfo(user.username, 'user');
        ui.showDashboard(user);
        return { success: true };
    } else {
        return { success: false, message: 'Nome de usuário ou senha inválidos.' };
    }
}

export function handleRegister({ fullName, username, email, password }) {
    const users = api.getUsers();
    if (users.find(u => u.username === username)) {
        return { success: false, message: 'Nome de usuário já existe.' };
    }
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'Email já cadastrado.' };
    }

    const newUser = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 9),
        username,
        fullName,
        email,
        password, 
        valorInvestido: Math.random() * 10000,
        saldoAtual: 5000 + Math.random() * 45000,
        saldoDisponivel: 1000 + Math.random() * 19000,
        transactions: [],
    };

    users.push(newUser);
    api.saveUsers(users);

    api.setLoggedInInfo(newUser.username, 'user');
    ui.showDashboard(newUser);
    return { success: true };
}

export const logout = () => {
    api.clearLoggedInInfo();
    ui.showAuth();
};