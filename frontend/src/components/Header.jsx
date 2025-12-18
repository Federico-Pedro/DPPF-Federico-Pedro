import { Link } from 'react-router-dom'
import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className= {styles.subContainer}>

        <Link to="/"><img className={styles.imgLogo} src="/logo3.png" alt="Logo de Rústica cocina de autor" /></Link>
        <div className={styles.logoSection}>
          <h1 className={styles.logo}>Rústica</h1>
          <p className={styles.subtitle}>Cocina de Autor</p>
        </div>
        </div>
        <nav className={styles.nav}>
          <Link to="/admin" className={styles.link}>Admin</Link>
          <a href="#create" className={styles.link}>Crear cuenta</a>
          <a href="#login" className={styles.link}>Iniciar sesión</a>
          
        </nav>
      </div>
    </header>
  );
}

export default Header;