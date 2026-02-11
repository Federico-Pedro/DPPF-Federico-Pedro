import { useState, useEffect } from 'react'
import styles from './RegistrationForm.module.css'


const RegistrationForm = () => {
    
    const [userName, setUserName] = useState('')
    const [userLastName, setUserLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    
    const editing = false;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        setError('');

        try {
            
            const userData = {
                name: userName,
                userLastName: userLastName,
                email: email,
                password: password,

            }

            let response;

            if (editing) {
                // response = await axios.put(`http://localhost:8080/api/products/${id}`, userData);
                setSuccess(`Usuario: "${response.data.name}" actualizado exitosamente`)
            } else {
                // response = await axios.post('http://localhost:8080/api/products', userData);
                setSuccess(`Usuario: "${response.data.name}" creado exitosamente!`);
                setuserName('');
                setUserLastName('');
                setEmail('');
                setPassword('');
                setRepeatPassword('')
            }


        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError('Error al crear el usuario. Intenta de nuevo.');
            }
        }
    }














    return (
        <div className={styles.adminContainer}>
            <div className={styles.titleContainer}>
                <h2>{editing ? 'Editar usuario' : 'Registrarse'}</h2>
            </div>

            {success && (
                <div className={styles.success}>{success}</div>
            )}
            {error && (
                <div className={styles.error}>{error}</div>
            )}



            <form className={styles.form} onSubmit={handleSubmit}>
                <label htmlFor="userName" className={styles.label}> Nombre
                    <input className={styles.input} type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Nombre del usuario"
                        id="userName" />
                </label>

                <label htmlFor="userLastName" className={styles.label}> Apellido
                    <input className={styles.input} type="text"
                        value={userLastName}
                        onChange={(e) => setUserLastName(e.target.value)}
                        placeholder="Apellido del usuario"
                        id="userLastName" />
                </label>

                <label htmlFor="email" className={styles.label}> Correo electrónico
                    <input className={styles.input} type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Correo electrónico"
                        id="email" />
                </label>

                <label htmlFor="password" className={styles.label}> Contraseña
                    <input className={styles.input} type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Contraseña"
                        id="password" />
                </label>

                <label htmlFor="repeatPassword" className={styles.label}> Repetir Contraseña
                    <input className={styles.input} type="password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        placeholder="Repetir Contraseña"
                        id="repeatPassword" />
                </label>



                <button className={styles.button} type="submit">{editing ? 'Actualizar usuario' : 'Crear usuario'}</button>
            </form>
        </div>
    )
}

export default RegistrationForm