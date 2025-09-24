import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Authentication from './component/authentication.tsx'
import PrivateRoute from './component/protectRoutes.tsx'


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<App />} />
      </Route>
      <Route path="/auth" element={<Authentication />} />
    </Routes>
  </BrowserRouter>

)
