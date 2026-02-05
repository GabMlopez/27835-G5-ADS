import { useState } from 'react'
import './App.css'
import Menu from './componentes/menu/menu'
import { Routes, Route, Navigate } from 'react-router-dom'

// ===== CUIDADOS =====
import ManejoCuidados from './paginas/cuidados/ManejoCuidados'
import GestionarMontas from './paginas/cuidados/GestionarMontas'
import GestionarAlimentacion from './paginas/cuidados/GestionarAlimentacion'
import GestionarVacunacion from './paginas/cuidados/GestionarVacunacion'

// ===== OTROS MODULOS =====
import GestionarJaulas from './paginas/jaulas/GestionarJaulas'
import GestionarConejos from './paginas/conejos/GestionarConejos'
import GestionarRazas from './paginas/razas/GestionarRazas'



function App() {

  return (
    <>
      <Menu />
      <Routes>

        <Route path="/" element={<Navigate to="/cuidados" replace />} />

        {/* ===== JAULAS / CONEJOS / RAZAS ===== */}
        <Route path="/jaulas" element={<GestionarJaulas />} />
        <Route path="/conejos" element={<GestionarConejos />} />
        <Route path="/razas" element={<GestionarRazas />} />

        {/* ===== CUIDADOS ===== */}
        <Route path="/cuidados" element={<ManejoCuidados />} />
        <Route path="/cuidados/montas" element={<GestionarMontas />} />
        <Route path="/cuidados/alimentacion" element={<GestionarAlimentacion />} />
        <Route path="/cuidados/vacunacion" element={<GestionarVacunacion />} />

      </Routes>
    </>
  )
}

export { App }
