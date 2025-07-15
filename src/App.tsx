import "./presentation/assets/styles/reset.css";
import "./presentation/assets/styles/theme.css";

import { ThemeProvider, Toast } from "@rarui-react/components";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Router } from "@/presentation/router";

import { makeQueryClient } from "./app.definitions";

const queryClient = makeQueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Toast.Provider placement="topRight">
          <Router />
        </Toast.Provider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
