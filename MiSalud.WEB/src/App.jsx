import './styles/DefaultStyles.css'
import Home from './views/home/Home'
import Administracion from './views/administracion/Administracion'
import FooterBar from './components/FooterBar/FooterBar'
import FormView from './views/PacientForm/Form'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const paciente ={
    id: 6,
    nombre: "Juan Perez",
    registroId: "123456789",
    direccion: "Calle Falsa 123",
    telefono: "1234567890",
    email: "juan@yopmail.com",
    password: "12345678Aa."
  }
  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/administracion" element={<Administracion />} />
        <Route path="/formulario/add" element={<FormView type={"añadir"}/>} />
        <Route path="/formulario/edit/:registroId" element={<FormView type={"editar"}/>} />
      </Routes>
      <FooterBar />
    </Router>
    </>
  )
}

export default App