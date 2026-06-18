import { useState } from 'react'
import './Navbar.css'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const closeMenu = () => setIsOpen(false)

    return (
        <nav className='navbar'>
            <div className='navbar-container'>
                <a href='#' className='navbar-logo'>Mi<span>Brand</span></a>

                {/* Links escritorio */}
                <ul className='navbar-links'>
                    <li><a href='#hero'>Inicio</a></li>
                    <li><a href='#features'>Servicios</a></li>
                    <li><a href='#footer'>Contacto</a></li>
                    <li><a href='#' className='navbar-cta'>Empezar</a></li>
                </ul>
                {/* Boton hamburguesa */}
                <button
                    className={`hamburger ${isOpen ? 'open' : ''}`}
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label='Toggle menu'
                >
                    <span /><span /><span />
                </button>
            </div>

            {/* Menu movil */}
            <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
                <a href='#hero' onClick={closeMenu}>Inicio</a>
                <a href='#features' onClick={closeMenu}>Servicios</a>
                <a href='#footer' onClick={closeMenu}>Contacto</a>
                <a href='#' className='navbar-cta' onClick={closeMenu}>Empezar</a>
            </div>
        </nav>
    )
}
