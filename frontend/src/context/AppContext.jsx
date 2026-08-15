import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [notifications, setNotifications] = useState([]);
    return <AppContext.Provider value={{ notifications, setNotifications }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
    return useContext(AppContext);
}