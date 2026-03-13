import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProductList.module.css'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'



function ProductList({ filteredResults, propDate }) {

    const navigate = useNavigate()
    const { user } = useAuth()

    const [activeFilters, setActiveFilters] = useState([]);
    const [products, setProducts] = useState([]);
    const [randomProducts, setRandomProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [reservations, setReservations] = useState([])
    const [productsByDate, setProductsByDate] = useState([])

    const productsPerPage = 10;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;


    //Este useEffect trae todos los productos de la base de datos (simulando un delay de 1.5 seg), los cololca en la variable products, luego la funcion getRandomProducts los mezcla y los coloca en randomProducts
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/products');
                await new Promise(resolve => setTimeout(resolve, 1500));
                setProducts(response.data)
                const random = getRandomProducts(response.data);
                setRandomProducts(random);


            } catch (error) {
                console.error('Error al cargar productos', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();


    }, []);




    //TRAE RESERVATIONS Y EXTRAE LOS ELEMENTOS QUE CONTENGAN LA FECHA QUE LLEGA POR PROP,
    //LUEGO EXTRAE LOS ID DE LOS PRODUCTOS QUE COINCIDEN CON ESA FECHA PARA SER COMPARADOS EN
    //EL FILTRO SIIGUIENTE
    const fetchReservations = async () => {
        try {
            const reserves = await axios.get('http://localhost:8080/api/reservations')
            const formattedDate = propDate ? propDate.toISOString().split('T')[0] : null

            const filtered = reserves.data.filter(r => r.date === formattedDate)
            setReservations(filtered)
            const byDate = filtered.map(r => r.product.id)
            console.log("PRODUCTOS BY DATE ", byDate)
            setProductsByDate(byDate)



        } catch (error) {
            console.error('Error al cargar reservas', error);
        }
    }



    useEffect(() => {
        if (!propDate) return
        fetchReservations();
    }, [propDate])



    let filteredProducts;

    //FUNCION QUE MANEJA LOS PRODUCTOS QUE SE MUESTRAN SEGÚN QUE FILTROS ESTÁN ACTIVOS
    const filtrar = () => {

        //SI LLEGA UNA FECHA POR PROP REALIZA UN PRIMER FILTRADO DEJANDO SOLO LOS PRODUCTOS
        //QUE NO ESTÁN EN LA TABLA DE RESERVAS PARA LA FECHA SELECCIONADA
        if (propDate) {

            filteredProducts = products.filter(p => !productsByDate.includes(p.id))
            console.log(filteredProducts)
        } else {
            filteredProducts = randomProducts
        }

        //LUEGO CONTINUA CON EL FILTRADO POR PALABRAS CLAVE Y POR BOTONES DE FILTROS SEGUN CARACTERISTICAS

        if (filteredResults && (activeFilters.length > 0)) {
            return filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(filteredResults.toLowerCase())).filter(p => activeFilters.includes(p.category))

        } else if (!filteredResults && (activeFilters.length > 0)) {
            return filteredProducts = filteredProducts.filter(p => activeFilters.includes(p.category))

        } else if (filteredResults) {
            return filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(filteredResults.toLowerCase()))

        } else {
            return filteredProducts
        }

    }

    //Acá se hace un slice de 10 productos teniendo en cuenta la página en que nos encontamos y se colocan en currentProducts (que es la variable que se mapea en el renderizado)
    filtrar()
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const getRandomProducts = (products) => {
        const shuffled = [...products];

        // Algoritmo Fisher-Yates para mezclar
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }


        return shuffled;
    };


    //CLICK PARA SETEAR PRODUCTO A ELIMINAR
    const handleClick = (product) => {
        setShowModal(true);
        setProductToDelete(product)

    }

    //FILTRO DE LOS BOTONES SEGUN CARACTERÍSTICAS
    const handleFilterClick = (filter) => {
        setActiveFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        )
        filtrar()
    }

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:8080/api/products/${productToDelete.id}`);
            setShowModal(false)
            setProductToDelete(null)
            setProducts(products.filter(p => p.id !== productToDelete.id));
        }
        catch (error) {
            console.error("Se produjo un error: ", error)
        }
    }

    const cancelDelete = () => {
        setShowModal(false);
        setProductToDelete(null)
    }





    //TRAE TODOS LOS FAVORITOS DE LA BASE DE DATOS

    const [favorites, setFavorites] = useState([])

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



    //FUNCION PARA AGREGAR PRODUCTO A FAVORITOS

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

    
    if (showModal) {
        return (
            <div className={styles.modal}>
                <h2>¿Está seguro que desea eliminar el producto: {productToDelete.name}?</h2>
                <img style={{ width: '250px', heigh: 'auto', margin: '25px' }} src={productToDelete.images[0]} />
                <div className={styles.buttonContainer}>
                    <button className={styles.adminButton} onClick={() => confirmDelete()}>Eliminar</button>
                    <button className={styles.adminButton} onClick={() => cancelDelete()}>Cancelar</button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
                <img src="/public/Spinner@1x-1.0s-200px-200px.gif" alt="spinner" />
                <div className="spinner">Cargando productos...</div>

            </div>
        );
    }

    return (
        <div className={styles.body}>

            <div className={styles.filterContainer}>Filtrar:
                <button className={activeFilters.includes('Individual') ? styles.clickedButton : styles.filterButton} onClick={() => handleFilterClick('Individual')}>Individual</button>
                <button className={activeFilters.includes('Doble') ? styles.clickedButton : styles.filterButton} onClick={() => handleFilterClick('Doble')}>Doble</button>
                <button className={activeFilters.includes('Multiple') ? styles.clickedButton : styles.filterButton} onClick={() => handleFilterClick('Multiple')}>Multiple</button>
            </div>
            <div className={styles.counter}>
                Mostrando {filteredProducts.length} / {products.length} productos
            </div>


            <div className={styles.cardContainer}>
                {currentProducts.map(product => (


                    <div key={product.id} className={styles.card}>
                        <div className={styles.productNameContainer}>
                            <h3>{product.name}</h3>

                            {favorites.includes(product.id)
                                ? <i className="bi bi-heart-fill" onClick={() => handleFavorite(product.id)}></i>
                                : <i className="bi bi-heart" onClick={() => handleFavorite(product.id)}></i>
                            }


                        </div>
                        <Link
                            to={`/product/${product.id}`}
                            key={product.id}
                            className={styles.productLink}
                        >
                            <div className={styles.imageContainer}>
                                {product.images && product.images.length > 0 && (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className={styles.cardImage}
                                    />
                                )
                                }
                            </div>
                            <div className={styles.pContainer}>

                                <p>{product.description}</p>
                            </div>
                        </Link>
                        {user && user.role === 'admin' &&
                            <>
                                <div className={styles.buttonContainer}>
                                    <button
                                        className={styles.adminButton}
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            navigate(`/form/edit/${product.id}`)
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button className={styles.adminButton} onClick={((e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleClick(product)
                                    })}>Borrar</button>

                                </div>

                            </>
                        }
                    </div>
                ))}
            </div>
            <div className={styles.paginationContainer}>
                <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className={styles.paginationButton}
                >
                    ⏮ Inicio
                </button>
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={styles.paginationButton}
                >
                    ← Anterior
                </button>

                <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={currentPage === number ? styles.activePage : styles.pageButton}
                        >
                            {number}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={styles.paginationButton}
                >
                    Siguiente →
                </button>
            </div>
        </div >
    )
}

export default ProductList;