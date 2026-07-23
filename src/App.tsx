import "react-datepicker/dist/react-datepicker.css";
import "./presentation/assets/styles/reset.css";
import "./presentation/assets/styles/theme.css";
import "./presentation/assets/styles/tailwind.css";

import { ThemeProvider, Toast } from "@rarui-react/components";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { Toaster } from "@/presentation/components";
import { Router } from "@/presentation/router";

import { makeQueryClient } from "./app.definitions";
import type { ThemeProviderContextProps } from "./app.types";

const queryClient = makeQueryClient();

export const ThemeProviderContext = createContext<ThemeProviderContextProps>(
  null as unknown as ThemeProviderContextProps,
);

export const useTheme = () => useContext(ThemeProviderContext);

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("dark-theme") === "true",
  );

  // Sincroniza o tema (Tailwind/tokens da nova identidade) no elemento raiz:
  // data-theme="dark" + classe .dark na <html>, e persiste a preferência.
  // Convive com o RarUI ThemeProvider durante a migração progressiva.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", darkMode ? "dark" : "light");
    root.classList.toggle("dark", darkMode);
    localStorage.setItem("dark-theme", String(darkMode));
  }, [darkMode]);

  const contextValue = useMemo(
    () => ({
      darkMode,
      setDarkMode,
    }),
    [darkMode, setDarkMode],
  );

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <ThemeProviderContext.Provider value={contextValue}>
          <ThemeProvider theme={darkMode ? "dark" : "base"}>
            <Toast.Provider placement="topRight">
              <Router />
              <Toaster />
            </Toast.Provider>
          </ThemeProvider>
        </ThemeProviderContext.Provider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
