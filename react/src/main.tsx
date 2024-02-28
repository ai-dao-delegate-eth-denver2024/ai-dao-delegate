import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { MetaMaskUIProvider } from "@metamask/sdk-react-ui";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MetaMaskUIProvider
      sdkOptions={{
        dappMetadata: {
          name: "Example React UI Dapp",
          url: window.location.href,
        },
        // Other options
      }}
    >
      <App />
    </MetaMaskUIProvider>
  </React.StrictMode>,
)
