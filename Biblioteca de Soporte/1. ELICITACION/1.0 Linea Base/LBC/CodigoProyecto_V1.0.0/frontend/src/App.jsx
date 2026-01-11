import { useState } from 'react'
import './App.css'
import Menu from './componentes/menu/menu'
import { Routes, Route } from 'react-router-dom'
import ManejoCuidados from './paginas/cuidados/ManejoCuidados'
import GestionarMontas from './paginas/cuidados/GestionarMontas'
import GestionarAlimentacion from './paginas/cuidados/GestionarAlimentacion'
import GestionarVacunacion from './paginas/cuidados/GestionarVacunacion'
function App() {

  return (
    <>
      <Menu />
      <Routes>
        <Route path="/cuidados" element={<ManejoCuidados />} />
        <Route path="/cuidados/montas" element={<GestionarMontas />} />
        <Route path="/cuidados/alimentacion" element={<GestionarAlimentacion />} />
        <Route path="/cuidados/vacunacion" element={<GestionarVacunacion />} />
      </Routes>
    </>
  )
}

export { App } 
