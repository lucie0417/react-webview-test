import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import GPS from './pages/GPS';
import Camera from './pages/Camera';
import './App.css'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path='/gps' element={<GPS />}></Route>
        <Route path='/camera' element={<Camera/>}></Route>
      </Routes>
    </div>
  )
}

export default App;
