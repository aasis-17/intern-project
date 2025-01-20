import { Routes, Route } from 'react-router-dom';
import './App.css'
import Home from './pages/Home.jsx';
import Header from './components/layouts/Header.jsx';



function App() {

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
