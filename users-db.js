// users-db.js - Sistema simple de usuarios con localStorage mejorado

class UsersDB {
    constructor() {
        this.USERS_KEY = 'sb_users_db';
        this.STORES_KEY = 'sb_stores_db';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.USERS_KEY)) {
            localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
        }
        if (!localStorage.getItem(this.STORES_KEY)) {
            localStorage.setItem(this.STORES_KEY, JSON.stringify([]));
        }
    }

    // USUARIOS
    getAllUsers() {
        return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    }

    saveUsers(users) {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }

    userExists(email) {
        const users = this.getAllUsers();
        return users.some(u => u.email === email);
    }

    registerUser(name, email, password) {
        if (this.userExists(email)) {
            return { success: false, message: 'El correo ya está registrado' };
        }

        const users = this.getAllUsers();
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: this.hashPassword(password), // Simple hash
            plan: 'free',
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        this.saveUsers(users);

        return {
            success: true,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                plan: newUser.plan,
                initials: name.substring(0, 2).toUpperCase()
            }
        };
    }

    loginUser(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        if (user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Contraseña incorrecta' };
        }

        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                plan: user.plan,
                initials: user.name.substring(0, 2).toUpperCase()
            }
        };
    }

    hashPassword(password) {
        // Simple hash - para producción usar algo más seguro
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }

    // TIENDAS
    getAllStores(userId) {
        const stores = JSON.parse(localStorage.getItem(this.STORES_KEY) || '[]');
        return stores.filter(s => s.userId === userId);
    }

    saveStore(userId, storeData) {
        const stores = JSON.parse(localStorage.getItem(this.STORES_KEY) || '[]');

        if (storeData.id) {
            // Actualizar existente
            const index = stores.findIndex(s => s.id === storeData.id && s.userId === userId);
            if (index !== -1) {
                stores[index] = { ...stores[index], ...storeData, updatedAt: new Date().toISOString() };
            }
        } else {
            // Crear nueva
            const newStore = {
                id: Date.now(),
                userId: userId,
                name: storeData.name,
                data: storeData.data,
                createdAt: new Date().toISOString()
            };
            stores.push(newStore);
        }

        localStorage.setItem(this.STORES_KEY, JSON.stringify(stores));
        return { success: true };
    }

    deleteStore(userId, storeId) {
        let stores = JSON.parse(localStorage.getItem(this.STORES_KEY) || '[]');
        stores = stores.filter(s => !(s.id === storeId && s.userId === userId));
        localStorage.setItem(this.STORES_KEY, JSON.stringify(stores));
        return { success: true };
    }

    // EXPORTAR A CSV
    exportToCSV() {
        const users = this.getAllUsers();
        let csv = 'ID,Nombre,Email,Plan,Fecha Registro\n';

        users.forEach(user => {
            csv += `${user.id},"${user.name}","${user.email}",${user.plan},${user.createdAt}\n`;
        });

        return csv;
    }

    downloadCSV() {
        const csv = this.exportToCSV();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', 'usuarios_storebuilder.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Instancia global
window.usersDB = new UsersDB();
