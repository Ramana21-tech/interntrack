import { createContext, useContext, useState, useEffect } from "react";
import { users as initialUsers } from "../data/mockData";

const AuthContext = createContext();

// Helper functions
const loadFromStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() =>
    loadFromStorage("currentUser", null)
  );
  const [loginTime, setLoginTime] = useState(() =>
    loadFromStorage("loginTime", null)
  );
  const [internList, setInternList] = useState(() =>
    loadFromStorage(
      "internList",
      initialUsers.filter((u) => u.role === "intern")
    )
  );
  const [allLogs, setAllLogs] = useState(() =>
    loadFromStorage("allLogs", [])
  );

  // Auto-save to localStorage whenever data changes
  useEffect(() => {
    saveToStorage("currentUser", currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveToStorage("loginTime", loginTime);
  }, [loginTime]);

  useEffect(() => {
    saveToStorage("internList", internList);
  }, [internList]);

  useEffect(() => {
    saveToStorage("allLogs", allLogs);
  }, [allLogs]);

  const login = (email, password) => {
    const allUsers = [
      ...initialUsers.filter((u) => u.role === "admin"),
      ...internList,
    ];
    const user = allUsers.find(
      (u) => u.email === email && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      setLoginTime(new Date().toISOString());
      return { success: true, role: user.role };
    }
    return { success: false };
  };

  const logout = () => {
    setCurrentUser(null);
    setLoginTime(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("loginTime");
  };

  const addIntern = (intern) => {
    const newIntern = {
      ...intern,
      id: Date.now(),
      role: "intern",
      joinDate: new Date().toISOString().split("T")[0],
    };
    setInternList((prev) => {
      const updated = [...prev, newIntern];
      saveToStorage("internList", updated);
      return updated;
    });
  };

  const removeIntern = (id) => {
    setInternList((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      saveToStorage("internList", updated);
      return updated;
    });
  };

  const addLog = (log) => {
    setAllLogs((prev) => {
      const updated = [log, ...prev];
      saveToStorage("allLogs", updated);
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loginTime: loginTime ? new Date(loginTime) : null,
        login,
        logout,
        internList,
        addIntern,
        removeIntern,
        allLogs,
        addLog,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);