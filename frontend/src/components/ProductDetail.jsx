import styles from './ProductDetail.module.css'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker'
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';
import { useNavigate } from 'react-router-dom'
registerLocale('es', es)



const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [selectedDate, setSelectedDate] = useState('')
    const [reservedDates, setReservedDates] = useState([])
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [share, setShare] = useState(false)
    const [shareMessage, setShareMessage] = useState('')
    const [copied, setCopied] = useState(false)
    const { id } = useParams();
    const { user } = useAuth()
    const navigate = useNavigate()
    

    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${id}`)
            .then(response => {
                setProduct(response.data);
                console.log(response.data)
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




    // console.log("Fechas reservadas para este producto: ", reservedDates)

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

    // const fetchData = () => {
    //     setError(false)
    //     axios.get(`http://localhost:8080/api/products/${id}`)
    //         .then(response => setProduct(response.data))
    //         .catch(() => setError(true))
    // }

    // useEffect(() => {
    //     fetchData()
    // }, [id])


    const [favorites, setFavorites] = useState([])
    // console.log("Id de los productos favoritos", favorites)

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

    const closeModal = () => {
        setShare(false)
        setCopied(false)
    }

    if (!product) {
        return (<div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
            <img src="/public/Spinner@1x-1.0s-200px-200px.gif" alt="spinner" />
            <div className="spinner">Cargando producto...</div>

        </div>)
    }
    const shareText = `${product.name}\n\n${product.description}\n\n${shareMessage}`

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>

                <div className={styles.productNameContainer}>

                    <h1>{product.name}</h1>

                    <div>

                        {favorites.includes(product.id)
                            ? <i className="bi bi-heart-fill" onClick={() => handleFavorite(product.id)}></i>
                            : <i className="bi bi-heart" onClick={() => handleFavorite(product.id)}></i>
                        }

                        <i className={"bi bi-share"} onClick={() => setShare(true)}></i>

                        <i className="bi bi-chevron-left" onClick={() => navigate('/')}></i>

                    </div>
                </div>


                {/* MODAL */}
                {share && (
                    <div className={styles.overlay}>
                        <div className={styles.shareModal}>
                            <div className={styles.shareModalTitle}>
                                <h2>
                                    {product.name}
                                </h2>
                                <i className="bi bi-x" onClick={() => closeModal()}></i>
                            </div>

                            <img src={`${product.images[0]}`} alt="" className={styles.modalImage} />


                            <p>
                                {product.description}
                            </p>

                            <a href={`http://localhost:5173/product/${product.id}`} target="_blank" className={styles.productLink}>
                                {`http://localhost:5173/product/${product.id}`}
                            </a>

                            <textarea name="" id="" placeholder="Ingresa un comentario"
                                onChange={(e) => setShareMessage(e.target.value)}
                                value={shareMessage}
                            >

                            </textarea>
                            <div className={styles.shareModalTitle}>
                                <h3>
                                    Elige una red social para compartir: "{product.name}"
                                </h3>
                                {copied && <p>Contenido copiado, podés pegarlo en Instagram</p>}
                                
                            </div>
                            <div className={styles.iconContainter}>
                                <i
                                    className="bi bi-instagram"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${shareText}\n\nhttp://localhost:5173/product/${product.id}`)
                                        window.open('https://www.instagram.com')
                                        setCopied(true)
                                    }}
                                />
                                <i className="bi bi-facebook"
                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`http://localhost:5173/product/${product.id}`)}&quote=${encodeURIComponent(shareText)}`)} />
                                <i
                                    className="bi bi-twitter"
                                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(`http://localhost:5173/product/${product.id}`)}`)}
                                />
                            </div>
                        </div>
                    </div>
                )

                }




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
            <div className={`${styles.productDescription} ${styles.productCharacteristics}`}>
                <h3 className={styles.politicsTitle}>Políticas del producto</h3>
                <div className={styles.politicsContainer}>

                    {product.politics && product.politics.map((p, index) => {
                        const politic = JSON.parse(p)
                        return (
                            <div key={index}>
                                <h3 className={styles.politicsName}>{politic.title}</h3>
                                <p className={styles.politicsDescription}>{politic.description}</p>
                            </div>
                        )
                    })}

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