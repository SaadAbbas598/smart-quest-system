import { createContext, useState, useContext } from "react";

// Create HiddenField Context
const HiddenFieldContext = createContext();

// Custom Hook for easier usage
export const useHiddenField = () => useContext(HiddenFieldContext);

export const HiddenFieldProvider = ({ children }) => {
    const [hiddenValues, setHiddenValues] = useState("Complaint");

    // Function to update hidden values
    const setHiddenFieldValue = (key, value) => {
        setHiddenValues((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <HiddenFieldContext.Provider value={{ hiddenValues, setHiddenFieldValue }}>
            {children}
        </HiddenFieldContext.Provider>
    );
};
