// --- MOCK DATABASE (localStorage & sessionStorage) ---

// Initialize users array if it doesn't exist
if (!localStorage.getItem('users')) {
    // Seed with a default user for demonstration purposes
    const defaultUsers = [{
        id: 'defaultuser123',
        username: 'user',
        password: 'user',
        fullName: 'Usuário Padrão',
        email: 'user@example.com',
        valorInvestido: 15000,
        saldoAtual: 25000,
        saldoDisponivel: 10000,
        transactions: [{
            id: 'tx_default1',
            date: new Date(new Date().setDate(new Date().getDate() - 10)),
            type: 'Depósito',
            amount: 15000,
            status: 'Aprovado'
        }, {
            id: 'tx_default2',
            date: new Date(new Date().setDate(new Date().getDate() - 5)),
            type: 'Lucro',
            amount: 250,
            status: 'Concluído'
        }]
    }];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

export const getUsers = () => {
    const users = JSON.parse(localStorage.getItem('users'));
    let needsSave = false;
    // One-time migration to add IDs to existing users
    users.forEach(user => {
        if (!user.id) {
            user.id = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
            needsSave = true;
        }
    });
    if (needsSave) {
        saveUsers(users);
    }
    return users;
};

export const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

export const getLoggedInInfo = () => {
    const username = sessionStorage.getItem('loggedInUser');
    const role = sessionStorage.getItem('userRole');
    if (!username || !role) return null;
    return { username, role };
};

export const setLoggedInInfo = (username, role) => {
    sessionStorage.setItem('loggedInUser', username);
    sessionStorage.setItem('userRole', role);
};

export const clearLoggedInInfo = () => {
    sessionStorage.removeItem('loggedInUser');
    sessionStorage.removeItem('userRole');
};

// Functions for admin editing a user
export const setAdminEditingUser = (username) => sessionStorage.setItem('adminEditingUser', username);
export const getAdminEditingUser = () => sessionStorage.getItem('adminEditingUser');
export const clearAdminEditingUser = () => sessionStorage.removeItem('adminEditingUser');

export const getUserByUsername = (username) => {
    const users = getUsers();
    return users.find(u => u.username === username);
};

export const getCurrentUser = () => {
    const loggedInInfo = getLoggedInInfo();
    if (!loggedInInfo || loggedInInfo.role !== 'user') return null;
    const users = getUsers();
    return users.find(u => u.username === loggedInInfo.username);
};

export const updateUser = (updatedUser) => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === updatedUser.username);
    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        saveUsers(users);
        return { success: true };
    }
    return { success: false, message: "User not found" };
};

export const updateCurrentUser = (updatedUser) => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === updatedUser.username);
    if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        saveUsers(users);
    }
};

export const processTransaction = (userId, txId, action) => {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    if (!user || !user.transactions) return;

    const tx = user.transactions.find(t => t.id === txId);
    if (!tx || tx.status !== 'Pendente') return;

    if (action === 'approve') {
        tx.status = 'Aprovado';
        if (tx.type === 'Depósito') {
            user.saldoAtual += tx.amount;
            user.saldoDisponivel += tx.amount;
        } else if (tx.type === 'Saque') {
            // Funds were already held from saldoDisponivel, now remove from saldoAtual
            user.saldoAtual -= tx.amount;
        }
    } else if (action === 'reject') {
        tx.status = 'Rejeitado';
        if (tx.type === 'Saque') {
            // Return the held funds to the user's available balance
            user.saldoDisponivel += tx.amount;
        }
        // No balance change for rejected deposits
    }

    updateUser(user);
};