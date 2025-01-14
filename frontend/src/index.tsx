import React from "react"
import ReactDOM from "react-dom/client"
import "./globals.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { BrowserRouter } from "react-router-dom"
import { Layout } from "./components/Layout"
import { KeycloakProvider } from "./keycloak/KeycloakProvider"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
    <React.StrictMode>
        <KeycloakProvider>
            <BrowserRouter>
                <Layout>
                    <App />
                </Layout>
            </BrowserRouter>
        </KeycloakProvider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
