import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Characteristics.module.css'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function Characteristics() {

    const { user } = useAuth()
    if (!user || user.role !== 'admin') return <Navigate to="/" />
    const [characteristics, setCharacteristics] = useState([]);
    const [characteristicName, setCharacteristicName] = useState('')
    const [icon, setIcon] = useState('')
    const [showModal, setShowModal] = useState(false);
    const [characteristicToDelete, setCharacteristicToDelete] = useState(null)

    useEffect(() => {
        const fetchCharacteristics = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/characteristics');
                setCharacteristics(response.data)

            } catch (error) {
                console.error('Error al cargar características', error);
            }
        };

        fetchCharacteristics();
    }, []);

    const handleDelete = (characteristic) => {
        setShowModal(true);
        setCharacteristicToDelete(characteristic)
    }

    const handleClick = (characteristic) => {

        //FUNCION EDITAR CARACTERISTICA
    }

    const data = {
        name: characteristicName,
        icon: icon,

    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(data)
            const response = await axios.post('http://localhost:8080/api/characteristics', data);
            setCharacteristics(prev => [...prev, response.data])
        }
        catch (error) {
            console.error("Se produjo un error: ", error)
        }
    }

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/characteristics/${characteristicToDelete.id}`);
            setShowModal(false)
            setCharacteristicToDelete(null)

            setCharacteristics(prev => prev.filter(c => c.id !== characteristicToDelete.id))
        }
        catch (error) {
            console.error("Se produjo un error: ", error)
        }
    }

    const cancelDelete = () => {
        setShowModal(false);
        setCharacteristicToDelete(null)
    }

    if (showModal) {
        return (
            <div style={{ textAlign: 'center', padding: '200px', color: 'white' }}>
                <h2>¿Está seguro que desea eliminar esta caracterìstica: {characteristicToDelete.name}?</h2>

                <div>
                    <button className={styles.deleteButton} onClick={() => confirmDelete()}>Eliminar</button>
                    <button className={styles.deleteButton} onClick={() => cancelDelete()}>Cancelar</button>
                </div>
            </div>
        )
    }



    return (
        <div className={styles.body}>
            <table>
                <thead className={styles.tableHead}>
                    <tr>
                        <th className={styles.th}>ID</th>
                        <th className={styles.th}>Nombre</th>
                        <th className={styles.th}>Nombre icono</th>
                        <th className={styles.th}>Icono</th>
                        <th className={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {characteristics.map(characteristic => (
                        <tr key={characteristic.id}>
                            <td className={styles.cell}>{characteristic.id}</td>
                            <td className={styles.cell}>{characteristic.name}</td>
                            <td className={styles.cell}>{characteristic.icon}</td>
                            <td className={styles.cell}><i className={`bi ${characteristic.icon}`}></i></td>

                            <td className={styles.buttonCell}>
                                <button className={styles.deleteButton} onClick={() => handleClick(characteristic)}>Editar</button>
                                <button className={styles.deleteButton} onClick={() => handleDelete(characteristic)}>Eliminar</button>


                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={styles.addButtonContainer}>

                <form className={styles.form} onSubmit={handleSubmit}>

                    <div className={styles.inputContainer}>

                        <label htmlFor="charName"> Nombre de la caracteristica:
                            <input type="text"
                                value={characteristicName}
                                onChange={(e) => setCharacteristicName(e.target.value)}
                                placeholder="Nombre de la caracterìstica"
                                id="charName" />

                        </label>



                        <label htmlFor="icons">Elige un ícono:

                            <select name="icons" id="icons" className={styles.iconSelector} onChange={(e) => setIcon(e.target.value)} defaultValue="">
                                <option value="" disabled>Seleccione un icono</option>
                                <option value="bi-cup-hot-fill">Café gratis</option>
                                <option value="bi-box-seam-fill">Para llevar</option>
                                <option value="bi-cash-coin">Precios elevados</option>
                                <option value="bi-fork-knife">Cubiertos incluidos</option>
                                <option value="bi-wifi">Wi-fi</option>
                            </select>
                        </label>
                    </div>





                    <button className={styles.characteristicButton} type="submit">Añadir caracteristica</button>
                </form>
            </div>

        </div>)

}

export default Characteristics