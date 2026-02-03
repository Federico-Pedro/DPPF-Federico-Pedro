import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProductList.module.css'
import { Link } from 'react-router-dom';



function ProductList() {

    const [products, setProducts] = useState([])
    const [randomProducts, setRandomProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true);

    const productsPerPage = 10;
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const totalPages = Math.ceil(products.length / productsPerPage);

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


    //Acá se hace un slice de 10 productos teniendo en cuenta la página en que nos encontamos y se colocan en currentProducts (que es la variable que se mapea en el renderizado)
    const currentProducts = randomProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const getRandomProducts = (products) => {
        const shuffled = [...products];

        // Algoritmo Fisher-Yates para mezclar
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }


        return shuffled;
    };

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
        </div>
    )
}

export default ProductList;