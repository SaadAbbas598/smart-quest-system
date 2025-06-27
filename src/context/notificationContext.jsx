import { createContext, useState, useContext } from "react";

// Create Notification Context
const NotificationContext = createContext();

// Custom Hook for easier usage
export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    // Function to update notification
    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
    };

    return (
        <NotificationContext.Provider value={{ notification, showNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
