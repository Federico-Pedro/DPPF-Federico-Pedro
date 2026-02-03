import { useState, useEffect } from 'react';
import styles from './Administracion.module.css';
import { Link } from 'react-router-dom';

const Administracion = () => {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (isMobile) {
    return (
      <div className={styles.mobileWarning}>
        <h2>⚠️ Acceso Restringido</h2>
        <p>Esta página solo es accesible desde una computadora.</p>
        <p>Por favor, accedé desde un dispositivo de escritorio.</p>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <Link to="/form" className={styles.adminButon}>Cargar un producto</Link>
      <Link to="/editar" className={styles.adminButon}>Editar producto</Link>
      <Link to="/eliminar" className={styles.adminButon}>Eliminar producto</Link>
      <Link to="/table" className={styles.adminButon}>Ver todos los productos</Link>
    </div>
  );
};

export default Administracion;