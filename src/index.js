import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ProductProvider }  from "./context/ProductContext";
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from "./components/style/GlobalStyle";
import theme from "./components/style/theme";
import Loading from "./components/Loading";

const App = lazy(() => import('./App'));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <AuthProvider>
          <ProductProvider>
            <ThemeProvider theme={theme}>
              <Suspense fallback={<Loading />}>
                <App />
              </Suspense>
              <GlobalStyle />
            </ThemeProvider>
          </ProductProvider>
        </AuthProvider>
      </ModalProvider>
    </BrowserRouter>
  // </React.StrictMode>
);