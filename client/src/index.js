import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ProductProvider }  from "./context/productContext";
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from "./components/style/GlobalStyle";
import theme from "./components/style/theme";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
      <AuthProvider>
        <ProductProvider>
          <ModalProvider>
            <ThemeProvider theme={theme}>
              {/* <Suspense fallback={<Loading />}> */}
                <App />
              {/* </Suspense> */}
              <GlobalStyle />
            </ThemeProvider>
          </ModalProvider>
        </ProductProvider>
      </AuthProvider>
  // </React.StrictMode>
);