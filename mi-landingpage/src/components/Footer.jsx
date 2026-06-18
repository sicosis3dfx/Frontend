export default function Footer() {
    return (
        <footer id='footer' className='footer'>
            <div className='footer-container'>
                <div className='footer-brand'>
                    <span className='footer-logo'>Mi<span>Brand</span></span>
                    <p>Hacemos realidad tu vision digital.</p>
                </div>
                {/* Columnas de links y contacto */}
            </div>
            <div className='footer-bottom'>
                <p>© {new Date().getFullYear()} MiBrand.</p>
            </div>
        </footer>
    )
}

