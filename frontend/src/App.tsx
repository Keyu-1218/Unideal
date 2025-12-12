import { BrowserRouter, useRoutes } from "react-router-dom";
import { routes } from "./routes";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Toaster } from "sonner";

function AppRoutes() {
  return useRoutes(routes);
}

function App() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <AppRoutes />
        <Toaster position="top-right" richColors />
      </Provider>
    </BrowserRouter>
  );
}

export default App;
