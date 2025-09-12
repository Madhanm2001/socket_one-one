import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Authentication from './component/authentication.tsx'


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <Routes>
    <Route path='/' element={<App/>}/>
    <Route path='/auth' element={<Authentication/>}/>
  </Routes>
  </BrowserRouter>
)
