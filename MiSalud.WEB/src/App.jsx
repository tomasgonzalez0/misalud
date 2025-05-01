import './styles/DefaultStyles.css'
import Home from './views/home/Home'
import Administracion from './views/administracion/Administracion'
import FooterBar from './components/FooterBar/FooterBar'
import FormView from './views/PacientForm/Form'

function App() {
  return (
    <>
      <FormView />
      {/* <Administracion />
      <FooterBar /> */}
    </>
  )
}

export default App