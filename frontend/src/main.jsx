import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider } from 'react-redux'
import theme from './theme/theme'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./hooks/useAuth.jsx";
import store from './store/store'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    </StrictMode>,
)
