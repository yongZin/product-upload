import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ProductProvider }  from "./context/productContext";
import { AuthProvider } from './context/AuthContext';
// import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import GlobalStyle from "./components/style/GlobalStyle";
import theme from "./components/style/theme";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    // <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <ThemeProvider theme={theme}>
            {/* <Suspense fallback={<Loading />}> */}
              <App />
            {/* </Suspense> */}
            <GlobalStyle />
          </ThemeProvider>
        </ProductProvider>
      </AuthProvider>
    // </BrowserRouter>
  // </React.StrictMode>
);