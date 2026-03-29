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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
registerLocale('es', es)



const ProductDetail = () => {

    const token = localStorage.getItem('token')
    const [product, setProduct] = useState(null);
    const [selectedDate, setSelectedDate] = useState('')
    const [formatedDate, setFormatedDate] = useState('')
    const [reservedDates, setReservedDates] = useState([])
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [share, setShare] = useState(false)
    const [shareMessage, setShareMessage] = useState('')
    const [copied, setCopied] = useState(false)
    const [hovered, setHovered] = useState(0)
    const [reviews, setReviews] = useState([])
    const [review, setReview] = useState('')
    const [reviewComment, setReviewComment] = useState('')
    const [reviewMessage, setReviewMessage] = useState('')
    const [stats, setStats] = useState([])
    const [reviewByUser, setReviewByUser] = useState(null)
    const [reserveModal, setReserveModal] = useState(false)
    const { id } = useParams();
    const { user } = useAuth()
    const navigate = useNavigate()



    // FUNCION Y USEEFFECT PARA FORMATEAR LA FECHA SELECCIONADA

    const formatDate = (date) => {
        const [year, month, day] = new Date(date).toISOString().split('T')[0].split('-')
        return `${day}/${month}/${year}`
    }

    useEffect(() => {
        if (selectedDate) {
            setFormatedDate(formatDate(selectedDate))
        }

    }, [selectedDate])


    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
            .then(response => {
                setProduct(response.data);
                //console.log(response.data)
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });


        getReservedDates();
        fetchReviewData();


    }, [id]);


    //TRAE TODAS LAS FECHAS EN QUE ESTE PRODUCTO SE ENCUENTRA RESERVADO
    const getReservedDates = () => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/reservations/product/${id}`)
            .then(response => setReservedDates(response.data.map(date => {
                const [year, month, day] = date.split('-')
                const d = new Date(year, month - 1, day)
                d.setHours(12, 0, 0, 0)
                // console.log(response.data)
                return d
            })))
            .catch(error => setError(error.response?.data?.message || 'Error al cargar las fechas reservadas'));
    }

    // TRAE REVIEWS DEL PRODUCTO Y STATS
    const fetchReviewData = () => {

        axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/product/${id}`)
            .then(response => setReviews(response.data))

        axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/product/${id}/stats`)
            .then(response => setStats(response.data))

        if (user) {
            axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/product/${id}/user/${user.id}`)
                .then(response => setReviewByUser(response.data))
                .catch(error => {
                    if (error.response?.status !== 404) {
                        console.error(error)
                    }

                })
        }
    }


    const openReserveModal = () => {
        if (!selectedDate) {
            setError('Debes seleccionar una fecha');
            return;
        }
        if (user) {
            setReserveModal(true)
        } else {
            setError('Debes iniciar sesión para hacer una reserva, redirigiendo al login en 2s');
            setTimeout(() => {
                navigate("/login")
            }, 2000);
            return;
        }
    }

    const handleReserve = async (e) => {
        e.preventDefault();


        try {
            const reservationData = {
                date: selectedDate,
                creationDate: new Date().toISOString().split('T')[0],
                productId: product.id,
                userId: user.id
            }
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/reservations`, reservationData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(`Reserva de "${response.data.product.name}" para el día: "${response.data.date}" creada exitosamente!`);
            setSelectedDate('')
            setSuccess('')
            setTimeout(() => {
                closeModal()
            }, 3000);
            getReservedDates();

        } catch (error) {
            console.error(error);
            setError('Error al crear la reserva')
        }
    }

    const fetchData = () => {
        setError(false)
        axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
            .then(response => setProduct(response.data))
            .catch(() => setError(true))
    }

    useEffect(() => {
        fetchData()
    }, [id])


    const [favorites, setFavorites] = useState([])
    // console.log("Id de los productos favoritos", favorites)

    useEffect(() => {
        const fetchFavorites = async () => {
            try {

                //ESTE ENDPOINT TRAE LOS FAVORITOS CORRESPONDIENTES AL USUARIO LOGGEADO
                if (user) {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/favorites/user/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    //SETEA LOS ID DE LOS PRODUCTOS QUE EL USUARIO MARCÓ COMO FAVORITOS
                    setFavorites(response.data.map(p => p.id))

                    //console.log("Todos los favoritos: ", response.data)

                }
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
                await axios.post(`${import.meta.env.VITE_API_URL}/api/favorites`, favoriteData, {
                    headers: { Authorization: `Bearer ${token}` }
                })

                setFavorites(prev => [...prev, productId])

            } catch (error) {
                console.log(error)
            }
        } else {
            try {

                await axios.delete(`${import.meta.env.VITE_API_URL}/api/favorites/product/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setFavorites(prev => prev.filter(id => id !== productId))

            } catch (error) {
                console.log(error)
            }
        }
    }



    const handleReview = (star) => {

        try {
            setReview(star)


        } catch (error) {

            console.log(error)
        }
    }


    const submitReview = async () => {

        try {
            const data = {
                userId: user.id,
                productId: product.id,
                rating: review,
                comment: reviewComment,
                date: new Date().toISOString().split('T')[0]
            }
            await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews/product/${product.id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setReviewMessage('Reseña creada con éxito')
            setReviewComment('')

            setTimeout(() => {
                closeModal()
                fetchReviewData()
            }, 3000)

        } catch (error) {
            console.log(error)
        }
    }




    const closeModal = () => {
        setShare(false)
        setReview('')
        setCopied(false)
        setReserveModal(false)
    }

    if (!product) {
        return (<div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
            <img src="/public/Spinner@1x-1.0s-200px-200px.gif" alt="spinner" />
            <div className="spinner">Cargando producto...</div>

        </div>)
    }
    const shareText = `${product.name}\n\n${product.description}\n\n${shareMessage}`


    // SETTINGS PARA EL SLIDER DE LAS REVIEWS
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1500,
        autoplaySpeed: 6000,
        cssEase: "linear"
    }



    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>

                <div className={styles.productNameContainer}>

                    <h1>{product.name}</h1>

                    <div>

                        {
                            favorites.includes(product.id)
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


            {/* IMAGENES DEL PRODUCTO */}
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

            {/* VALORAR PRODUCTO */}
            <div className={styles.starsContainer}>

                {(user && !reviewByUser) ? [1, 2, 3, 4, 5].map(star => (
                    <i
                        key={star}
                        className={star <= hovered ? "bi bi-star-fill" : "bi bi-star"}
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => handleReview(star)}
                    />
                )) : (user && reviewByUser) ? [1, 2, 3, 4, 5].map(star => (
                    <i
                        key={star}
                        className={star <= reviewByUser.rating ? "bi bi-star-fill" : "bi bi-star"}
                        style={{ cursor: 'default' }}
                    />
                )) : <></>

                }


                {/* REVIEW MODAL */}

                {review && !reviewByUser && (
                    <div className={styles.overlay}>
                        <div className={styles.shareModal}>
                            <div className={styles.shareModalTitle}>
                                <h2 className={styles.reviewTitle}>
                                    {product.name}
                                </h2>
                                <i className="bi bi-x" onClick={() => closeModal()}></i>
                            </div>
                            <img src={product.images[0]} alt="Imagen del producto" className={styles.reviewImage} />
                            <div>
                                {user && [1, 2, 3, 4, 5].map(star => (
                                    <i
                                        key={star}
                                        className={star <= review ? "bi bi-star-fill" : "bi bi-star"}
                                    />
                                ))}
                            </div>
                            <textarea
                                className={styles.reviewTextArea}
                                placeholder="Ingresa un comentario"
                                rows={5}
                                onChange={(e) => setReviewComment(e.target.value)}
                                value={reviewComment}
                            >
                            </textarea>
                            <h5>{reviewMessage}</h5>


                            {!reviewByUser && (<button className={styles.button} onClick={() => submitReview()}>Enviar reseña</button>)}

                        </div>
                    </div>
                )

                }

            </div>

            {/* DESCRIPCION DEL PRODUCTO */}
            <div className={styles.productDescription}>

                <p>{product.description}</p>
            </div>

            {/* CARACTERISTICAS DEL PRODUCTO */}
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

            {/* POLITICAS DEL PRODUCTO */}
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

            {/* RESEÑAS DEL PRODUCTO */}

            <div className={`${styles.productDescription} ${styles.productCharacteristics}`}>
                <h3 className={styles.politicsTitle}>Reseñas</h3>
                <div className={styles.reviewsContainer}>

                    <Slider {...settings} className={styles.slider}>
                        {reviews.map(review => (
                            <div key={review.id} className={styles.review}>
                                <p>{review.user.name} {review.user.lastName}</p>
                                <p>{review.date}</p>
                                <p>{review.comment}</p>
                                <div>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <i key={star} className={star <= review.rating ? "bi bi-star-fill" : "bi bi-star"}></i>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </Slider>

                    <div className={styles.statsContainer}>

                        <p>Puntaje: {stats.average ? stats.average : "*"}/5</p>
                        <p>Total de valoraciones: {stats.total ? stats.total : "0"}</p>
                    </div>



                </div>
            </div>
            <div className={styles.reservationMessage}>
                <p>
                    Elija una fecha para hacer la reserva
                </p>


            </div>

            <DatePicker
                placeholderText="Seleccionar fecha"
                locale="es"
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                monthsShown={2}
                dateFormat="dd/MM/yyyy"
                excludeDates={reservedDates}
                minDate={new Date()}
                highlightDates={[new Date()]}
                inline
            />


            {/* MODAL DE RESERVAS */}
            {user && reserveModal && (
                <div className={styles.overlay}>
                    <div className={` ${styles.reserveModal}`}>
                        <div className={styles.reserveTitleContainer}>
                            <h2 className={styles.reserveTitle}>
                                Reserva: {product.name}
                            </h2>
                            <i className="bi bi-x" onClick={() => closeModal()}></i>
                        </div>
                        <div className={styles.grid}>
                            <div className={styles.reserveInfoContainer}>
                                <div>
                                    {product.description}
                                </div>
                                <img
                                    className={styles.reserveImage}
                                    src={product.images[0]}
                                    alt=""
                                />
                                <div className={styles.mapContainer}>
                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12691.286394220266!2d-59.138622049999995!3d-37.323053349999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95911f93a525bcab%3A0xefeadbe86a08d8d5!2sTierra%20de%20Azafranes!5e0!3m2!1ses-419!2sar!4v1773764996482!5m2!1ses-419!2sar" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
                                </div>

                                <div className={styles.starContainer}>
                                    <div>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <i key={star} className={star <= stats.average ? "bi bi-star-fill" : "bi bi-star"}></i>
                                        ))}
                                    </div>
                                    <div>
                                        Puntuación:  {stats.average} / 5
                                    </div>
                                    <div>
                                        Total de valoraciones: {stats.total}
                                    </div>
                                </div>

                            </div>
                            <form className={styles.reserveForm}>
                                <label>
                                    Nombre de usuario:
                                    <input type="text"
                                        name=""
                                        id=""
                                        value={`${user.name} ${user.lastName}`}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    Email:
                                    <input type="text"
                                        name=""
                                        id=""
                                        value={user.email}
                                        readOnly
                                    />
                                </label>
                                <label>
                                    Mesa:
                                    <input
                                        type="text"
                                        name=""
                                        id=""
                                        value={product.name} readOnly />
                                </label>
                                <label>
                                    Fecha:
                                    <input
                                        type="text"
                                        name=""
                                        id=""
                                        value={formatedDate} readOnly />
                                </label>
                                <div className={styles.buttonContainer}>
                                    <button className={styles.reserveButton} onClick={handleReserve}>Confirmar reserva</button>
                                    <button className={`${styles.reserveButton} ${styles.cancelButton}`}
                                        onClick={() => closeModal()}
                                    >Cancelar</button>
                                </div>
                            </form>
                            {success && <h3 className={styles.success}>{success}</h3>}
                        </div>
                    </div>
                </div>
            )}

            {error &&
                <div className={styles.errorContainer}>
                    <h3 className={styles.error}>{error}</h3>

                </div>
            }
            {error ? <button className={styles.button} onClick={fetchData}>Reintentar</button> : <button type="button" className={styles.button} onClick={openReserveModal}>Reservar</button>}

        </div>
    );
};

export default ProductDetail;