import styles from './ProductDetail.module.css'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker'
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';
registerLocale('es', es)



const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [selectedDate, setSelectedDate] = useState('')
    const [reservedDates, setReservedDates] = useState([])
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const { id } = useParams();
    const { user } = useAuth()

    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${id}`)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });

        //TRAE TODAS LAS FECHAS EN QUE ESTE PRODUCTO SE ENCUENTRA RESERVADO
        axios.get(`http://localhost:8080/api/reservations/product/${id}`)
            .then(response => setReservedDates(response.data.map(date => {
                const [year, month, day] = date.split('-')
                const d = new Date(year, month - 1, day)
                d.setHours(12, 0, 0, 0)
                return d
            })))
            .catch(error => setError(error));

    }, [id]);

    console.log("Fechas reservadas para este producto: ", reservedDates)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            setError('Debes iniciar sesión para hacer una reserva');
            return;
        }
        if (!selectedDate) {
            setError('Debes seleccionar una fecha');
            return;
        }
        try {
            const reservationData = {
                date: selectedDate,
                productId: product.id,
                userId: user.id
            }
            const response = await axios.post('http://localhost:8080/api/reservations', reservationData);
            setSuccess(`Reserva de "${response.data.product.name}" para el día: "${response.data.date}" creada exitosamente!`);
        } catch (error) {
            console.error(error);
            setError('Error al crear la reserva')
        }
    }

    const fetchData = () => {
        setError(false)
        axios.get(`http://localhost:8080/api/products/${id}`)
            .then(response => setProduct(response.data))
            .catch(() => setError(true))
    }

    useEffect(() => {
        fetchData()
    }, [id])


    const [favorites, setFavorites] = useState([])
console.log("Id de los productos favoritos", favorites)
    useEffect(() => {
        const fetchFavorites = async () => {
            try {

                //ESTE ENDPOINT TRAE LOS FAVORITOS CORRESPONDIENTES AL USUARIO LOGGEADO
                const response = await axios.get(`http://localhost:8080/api/favorites/user/${user.id}`);

                //SETEA LOS ID DE LOS PRODUCTOS QUE EL USUARIO MARCÓ COMO FAVORITOS
                setFavorites(response.data.map(p => p.id))

                console.log("Todos los favoritos: ", response.data)

            } catch (error) {
                console.error('Error al cargar favoritos', error);
            }
        };

        fetchFavorites();

    }, []);


    const handleFavorite = async (productId) => {

        if (!favorites.includes(productId)) {

            try {
                const favoriteData = {
                    productId: productId,
                    userId: user.id
                }
                await axios.post(`http://localhost:8080/api/favorites`, favoriteData)

                setFavorites(prev => [...prev, productId])
                
            } catch (error) {
                console.log(error)
            }
        } else {
            try {

                await axios.delete(`http://localhost:8080/api/favorites/product/${productId}`)
                setFavorites(prev => prev.filter(id => id !== productId))

            } catch (error) {
                console.log(error)
            }
        }
    }



    if (!product) {
        return (<div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
            <img src="/public/Spinner@1x-1.0s-200px-200px.gif" alt="spinner" />
            <div className="spinner">Cargando producto...</div>

        </div>)
    }

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>

                <div className={styles.productNameContainer}>

                <h1>{product.name}</h1>

                {favorites.includes(product.id)
                    ? <i className="bi bi-heart-fill" onClick={() => handleFavorite(product.id)}></i>
                    : <i className="bi bi-heart" onClick={() => handleFavorite(product.id)}></i>
                }
                </div>
                <Link
                    to={`/`}
                    className={styles.productLink}
                >
                    <img className={styles.back} src="/public/arrow.png" alt="back" />
                </Link>
            </div>
            <div className={styles.imageContainer}>
                {product.images && product.images.length > 0 && product.images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className={index === 0 ? styles.mainImage : styles.smallImage}
                    />
                ))
                }
            </div>
            <div className={styles.seeMore}>
                <Link
                    to={`/productGallery/${product.id}`}
                    key={product.id}
                    className={styles.productLink}
                >

                    <p>Ver mas</p>
                </Link>
            </div>
            <div className={styles.productDescription}>

                <p>{product.description}</p>
            </div>
            <div className={`${styles.productDescription} ${styles.productCharacteristics}`}>
                <h3>Características</h3>

                <div className={styles.iconsContainer}>
                    {product.characteristics.map(char =>

                        <div className={styles.charContainer} key={char.id}>
                            <i className={`bi ${char.icon}`} ></i>
                            <p>{char.name}</p>
                        </div>

                    )}
                </div>

            </div>

            <DatePicker
                placeholderText="Seleccionar fecha"
                locale="es"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                monthsShown={2}
                dateFormat="dd/MM/yyyy"
                excludeDates={reservedDates}

                inline
            />
            {success && <h3 className={styles.success}>{success}</h3>}
            {error &&
                <div>
                    <h3 className={styles.error}>{error}</h3>
                    <button className={styles.button} onClick={fetchData}>Reintentar</button>
                </div>
            }
            <button type="button" className={styles.button} onClick={handleSubmit}>Reservar</button>
        </div>
    );
};

export default ProductDetail;