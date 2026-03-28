import styles from './Footer.module.css'

const Footer = () => {
  return (
    <div className={styles.footer}>
        <div className={styles.logoContainer}>
        <img className={styles.logo} src="/public/logo.png" alt="Logo" />
        <h4 className={styles.copyright}>2025 - Federico Pedro ©</h4>
        </div>
         
        </div>
  )
}

export default Footer