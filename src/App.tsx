import "react-datepicker/dist/react-datepicker.css";
import "./presentation/assets/styles/reset.css";
import "./presentation/assets/styles/theme.css";

import { ThemeProvider, Toast } from "@rarui-react/components";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Router } from "@/presentation/router";

import { makeQueryClient } from "./app.definitions";
import { createContext, useContext, useMemo, useState } from "react";
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

  const contextValue = useMemo(
    () => ({
      darkMode,
      setDarkMode,
    }),
    [darkMode, setDarkMode],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProviderContext.Provider value={contextValue}>
        <ThemeProvider theme={darkMode ? "dark" : "base"}>
          <Toast.Provider placement="topRight">
            <Router />
          </Toast.Provider>
        </ThemeProvider>
      </ThemeProviderContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
