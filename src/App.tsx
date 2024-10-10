import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./styles/themes/defaults";
import { GlobalStyles } from "./styles/globals";
import { Router } from "./Router";
import { BrowserRouter } from "react-router-dom";
import { CyclesContextProvider } from "./contexts/CyclesContext";


export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <BrowserRouter>
        <CyclesContextProvider>
          <Router />
        </CyclesContextProvider>
      </BrowserRouter>
      <GlobalStyles />
    </ThemeProvider>
  );
}
