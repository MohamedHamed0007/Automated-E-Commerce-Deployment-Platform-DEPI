
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import { ThemeProvider } from './context/ThemeContext.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.tsx'
import { injectStore } from './api/axiosInstance.ts'
injectStore(store);
createRoot(document.getElementById('root')!).render(
<Provider store={store}>
  <App />
</Provider>

  
)

