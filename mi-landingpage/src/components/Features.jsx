const features = [
    { icon: 'X', title: 'Servicio 1', desc: 'Descripcion del servicio.' },
    {icon: 'Y', title: 'Personalización', desc: 'Armado de PC - Gamer a medida del cliente.' },
    {icon: 'Z', title: 'Desarrollo BackEnd', desc: 'Programación Avanzada usando nuevas tecnologías.' },  
    {icon: 'A', title: 'UI / UX', desc: 'Desarrollo del aplicaciones WEB adaptadas al negocio.'}
]
export default function Features() {
    return (
        <section id='features' className='features'>
            <div className='features-container'>
                <h2 className='section-title'>Nuestros servicios</h2>
                <div className='features-grid'>
                    {features.map((f) => (
                        <div className='feature-card' key={f.title}>
                            <div className='feature-icon'>{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}