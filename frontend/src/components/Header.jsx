import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Navigate  } from 'react-router-dom'



function Header() {
  
  const { user, logout, inicial } = useAuth()
   const navigate = useNavigate()

  

    const handleLogout =() => {
        logout();
        navigate('/')

     }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.subContainer}>

          <Link to="/"><img className={styles.imgLogo} src="/logo3.png" alt="Logo de Rústica cocina de autor" /></Link>
          <div className={styles.logoSection}>
            <h1 className={styles.logo}>Rústica</h1>
            <p className={styles.subtitle}>Cocina de Autor</p>
          </div>
        </div>
        <nav className={styles.nav}>
          

          {user ? (
            <div className={styles.userLoggedContainer}>
              {user.role === 'admin' && (<Link to="/administracion" className={styles.link}>Admin</Link>)}
              <Link to="/Profile" className={styles.link}><span className={styles.userName}>{inicial}</span></Link>
              <button onClick={handleLogout} className={styles.logout}>Cerrar sesión</button>
            </div>
          ) : (
            <>
              <Link to="/registrationForm" className={styles.link}>Crear Cuenta</Link>
              <Link to="/login" className={styles.link}>Login</Link>
            </>
          )}


        </nav>
      </div>
    </header>
  );
}

export default Header;