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
    const [id, setId] = useState(undefined)

    useEffect(() => {
        const fetchCharacteristics = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/characteristics`);
                setCharacteristics(response.data)

            } catch (error) {
                console.error('Error al cargar características', error);
            }
        };

        fetchCharacteristics();
    }, []);



    const editing = id !== undefined;

    useEffect(() => {
        if (editing) {
            axios.get(`${import.meta.env.VITE_API_URL}/api/characteristics/${id}`)
                .then(response => {
                    const characteristicToEdit = response.data;
                    setCharacteristicName(characteristicToEdit.name || '');
                    setIcon(characteristicToEdit.icon || '');

                })
                .catch(error => {
                    console.error('Error fetching charcateristic:', error);
                });
        }
    }, [id]);

    const handleDelete = (characteristic) => {
        setShowModal(true);
        setCharacteristicToDelete(characteristic)
    }

    const handleClick = (characteristic) => {
        setId(characteristic.id)


    }

    const data = {
        name: characteristicName,
        icon: icon,

    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put(`${import.meta.env.VITE_API_URL}/api/characteristics/${id}`, data);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/characteristics`); setCharacteristics(response.data)
            } else {

                const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/characteristics`, data);
                setCharacteristics(prev => [...prev, response.data])
            }
        }
        catch (error) {
            console.error("Se produjo un error: ", error)
        }
    }

    const confirmDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/characteristics/${characteristicToDelete.id}`);
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
            <h2 className={styles.title}>
                Características
            </h2>
            <table>
                <thead className={styles.tableHead}>
                    <tr>
                        <th className={styles.th}>ID</th>
                        <th className={styles.th}>Nombre</th>
                        <th className={styles.th}>Nombre icono</th>
                        <th className={styles.th}>Icono</th>
                        <th className={styles.th}>Acciones</th>
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
                                <button className={styles.deleteButton} onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleClick(characteristic)

                                }}>Editar</button>
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

                            <select name="icons" id="icons" className={styles.iconSelector} onChange={(e) => setIcon(e.target.value)} value={icon || ""}>
                                <option value="" disabled>Seleccione un icono</option>
                                <option value="bi-cup-hot-fill">Café gratis</option>
                                <option value="bi-box-seam-fill">Para llevar</option>
                                <option value="bi-cash-coin">Precios elevados</option>
                                <option value="bi-fork-knife">Cubiertos incluidos</option>
                                <option value="bi-wifi">Wi-fi</option>
                            </select>
                        </label>
                    </div>





                    <button className={styles.characteristicButton} type="submit">{editing ? 'Actualizar caracteristica' : 'Añadir caracteristica'}</button>
                </form>
            </div>

        </div>)

}

export default Characteristics