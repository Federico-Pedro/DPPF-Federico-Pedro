import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProductList.module.css'



function ProductList() {

    const [products, setProducts] = useState([])
    const [randomProducts, setRandomProducts] = useState([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/products');
                await new Promise(resolve => setTimeout(resolve, 2000));
                setProducts(response.data)
                const random = getRandomProducts(response.data, 10);
                setRandomProducts(random);
            } catch (error) {
                console.error('Error al cargar productos', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    console.log(randomProducts)


    const getRandomProducts = (products, count = 10) => {
        const shuffled = [...products];

        // Algoritmo Fisher-Yates para mezclar
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Tomar solo los primeros 10 (o menos si hay menos productos)
        return shuffled.slice(0, Math.min(count, shuffled.length));
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
        <div className={styles.cardContainer}>
            {randomProducts.map(product => <div key={product.id} className={styles.card}>
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

            </div>)}

        </div>
    )
}

export default ProductList;