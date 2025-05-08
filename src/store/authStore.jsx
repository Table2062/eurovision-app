import { create } from 'zustand';

const useAuthStore = create(set => ({
    token: localStorage.getItem('token'),
    isAdmin: localStorage.getItem('h167jg784hdla6') == 'true',

    login: (token, isAdmin) => {
        localStorage.setItem('token', token);
        localStorage.setItem('h167jg784hdla6', isAdmin);
        set({ token, isAdmin });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('h167jg784hdla6');
        set({ token: null, isAdmin: false });
    },
}));

export default useAuthStore;