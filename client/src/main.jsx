import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { store } from './store.js'
import { Provider } from 'react-redux'
import { login } from './authSlice.js'

const authData = JSON.parse(localStorage.getItem('auth'))

if (authData && authData.username && authData.token && authData.role && authData.isAuthenticated) {
  //console.log("local storage: ", authData)
  store.dispatch(login(authData))
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store} >
      <App />
    </Provider>
  </StrictMode>,
)
