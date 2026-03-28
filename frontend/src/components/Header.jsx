import { Link } from 'react-router-dom'
import styles from './Header.module.css'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from "react";



function Header() {

  const { user, logout, inicial } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()



  const handleLogout = () => {
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
            <div className={styles.mainUserContainer}>
              
              {!menuOpen && <i className={`bi bi-list ${styles.hamburger}`} onClick={() => setMenuOpen(true)} />}

              <ul className={menuOpen ? `${styles.mobileMenu} ${styles.open}` : styles.mobileMenu}>
                <li><i className={`bi bi-x ${styles.closeBtn}`} onClick={() => setMenuOpen(false)} /></li>
                <li>{user.role === 'admin' && (<Link to="/administracion" className={styles.link}>Admin</Link>)}</li>
                <li>{user.role !== 'admin' && (<Link to="/Profile" className={styles.link}><span className={styles.userName}>{inicial}</span></Link>)}</li>
                <li> <Link to="/favorites" className={styles.favorites}><i className="bi bi-heart"></i><h2 className={styles.favoritesTitle}>Favoritos</h2></Link></li>
                <li><button onClick={handleLogout} className={styles.logout}>Cerrar sesión</button></li>
              </ul>

              <div className={styles.userLoggedContainer}>

                {user.role === 'admin' && (<Link to="/administracion" className={styles.link}>Admin</Link>)}
                {user.role !== 'admin' && (<Link to="/Profile" className={styles.link}><span className={styles.userName}>{inicial}</span></Link>)}
                <Link to="/favorites" className={styles.favorites}><i className="bi bi-heart"></i><h2 className={styles.favoritesTitle}>Favoritos</h2></Link>
                <button onClick={handleLogout} className={styles.logout}>Cerrar sesión</button>
              </div>
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