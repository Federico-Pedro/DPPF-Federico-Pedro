import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProductList.module.css'
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'



function ProductList() {

    const { user } = useAuth()

    const [activeFilters, setActiveFilters] = useState([]);
    const [products, setProducts] = useState([]);
    const [randomProducts, setRandomProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null)

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

    //Esta variable contiene los productos filtrados (ya mezclados aleatoriamente) segun que botones estan clickeados
    const filteredProducts = activeFilters.length === 0
        ? randomProducts
        : randomProducts.filter(p => activeFilters.includes(p.category));

    //Acá se hace un slice de 10 productos teniendo en cuenta la página en que nos encontamos y se colocan en currentProducts (que es la variable que se mapea en el renderizado)

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


    const handleClick = (product) => {
        setShowModal(true);
        setProductToDelete(product)

    }

    const handleFilterClick = (filter) => {
        setActiveFilters(prev =>
            prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
        )
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
                <button className={activeFilters.includes('Simple') ? styles.clickedButton : styles.filterButton} onClick={() => handleFilterClick('Simple')}>Simple</button>
                <button className={activeFilters.includes('Doble') ? styles.clickedButton : styles.filterButton} onClick={() => handleFilterClick('Doble')}>Doble</button>
                <button className={activeFilters.includes('Multiple') ? styles.clickedButton : styles.filterButton} onClick={() => handleFilterClick('Multiple')}>Multiple</button>
            </div>
            <div className={styles.counter}>
                Cantidad de productos: {filteredProducts.length} / {products.length}
            </div>


            <div className={styles.cardContainer}>
                {currentProducts.map(product => (

                    <Link
                        to={`/product/${product.id}`}
                        key={product.id}
                        className={styles.productLink}
                    >
                        <div key={product.id} className={styles.card}>
                            <h3>{product.name}</h3>
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
                    </Link>))}
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