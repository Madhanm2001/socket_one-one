import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Authentication from './component/authentication.tsx'
import PrivateRoute from './component/protectRoutes.tsx'


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
  <PrivateRoute/>
  <Routes>
    <Route path='/' element={<App/>}/>
    <Route path='/auth' element={<Authentication/>}/>
  </Routes>
  </BrowserRouter>
)
