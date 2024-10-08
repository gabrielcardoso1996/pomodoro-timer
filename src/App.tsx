import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/themes/defaults";
import { GlobalStyles } from "./styles/globals";
import { Router } from "./Router";
import { BrowserRouter } from "react-router-dom";

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={defaultTheme}>
        <Router />
          <GlobalStyles />
      </ThemeProvider>
    </BrowserRouter>
  );
}


