import './styles/DefaultStyles.css'
import Home from './views/home/Home'
import Administracion from './views/administracion/Administracion'
import FooterBar from './components/FooterBar/FooterBar'

function App() {
  return (
    <>
      <Administracion />
      <FooterBar />
    </>
  )
}

export default App