import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MembersProvider } from './stores/members.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MembersProvider>
      <App />
    </MembersProvider>
  </React.StrictMode>,
)
