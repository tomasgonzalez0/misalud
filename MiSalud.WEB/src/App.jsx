import './styles/DefaultStyles.css'
import Home from './views/home/Home'
import Administracion from './views/administracion/Administracion'
import FooterBar from './components/FooterBar/FooterBar'
import FormView from './views/PacientForm/Form'

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
      <FormView type={"añadir"}/>
      <FooterBar />
    </>
  )
}

export default App