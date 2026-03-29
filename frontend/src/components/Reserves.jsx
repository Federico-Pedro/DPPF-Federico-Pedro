import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Reserves.module.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function Reserves() {
    const { user } = useAuth()
    if (!user) return <Navigate to="/" />
    const [reservations, setReservations] = useState([]);
    const navigate = useNavigate();
    


    useEffect(() => {
    const fetchReserves = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reservations/user/${user.id}`);
            const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));

            const reservationsWithReviews = await Promise.all(
                sorted.map(async (reserve) => {
                    try {
                        const rev = await axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/product/${reserve.product.id}/user/${user.id}`)
                        return { ...reserve, review: rev.data }
                    } catch {
                        return { ...reserve, review: "Sin valoraciones" }
                    }
                })
            )

            setReservations(reservationsWithReviews)
            console.log(reservationsWithReviews)
        } catch (err) {
            console.error(err)
        }
    }
    fetchReserves()
}, [user.id])


    return (
        <div className={styles.body}>
            <div className={styles.backicon}>
                <i className="bi bi-chevron-left" onClick={() => navigate('/profile')}></i>
            </div>
            <table>
                <thead className={styles.tableHead}>
                    <tr>
                        <th className={styles.th}>Fecha</th>
                        <th className={styles.th}>Nombre</th>
                        <th className={styles.th}>Mi valoración</th>
                        <th className={styles.th}>Imagen</th>
                        <th className={styles.th}>Fecha de reservación</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {reservations.map(res => (
                        <tr key={res.id}>
                            <td className={styles.cell}>{new Date(res.date).toLocaleDateString('es-AR')}</td>
                            <td className={styles.cell}>{res.product.name}</td>
                            <td className={styles.cell}>{[1, 2, 3, 4, 5].map(star => (
                                            <i key={star} className={star <= res.review.rating ? "bi bi-star-fill" : "bi bi-star"}></i>
                                        ))}</td>
                            <td className={styles.cell}><img className={styles.tableImage} src={res.product.images[0]} alt="Imagen principal del producto" /></td>
                            <td className={styles.cell}></td>

                        </tr>
                    ))}
                </tbody>
            </table>

        </div>)

}

export default Reserves