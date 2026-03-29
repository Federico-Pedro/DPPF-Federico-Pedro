import styles from './ProductGallery.module.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';




const ProductGallery = () => {
    const [product, setProduct] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
            .then(response => {
                setProduct(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }, [id]);

    if (!product) {
        return (<div style={{ textAlign: 'center', padding: '20px', color: 'white' }}>
            <img src="/public/Spinner@1x-1.0s-200px-200px.gif" alt="spinner" />
            <div className="spinner">Cargando producto...</div>

        </div>)
    }

    return (
        <div className={styles.imageContainer}>
            <div className={styles.backContainer}>

            <Link
                to={`/product/${product.id}`}
                className={styles.productLink}
                >
                <img className={styles.back} src="/public/arrow.png" alt="back" />
            </Link>
                </div>
            <div>
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
        </div>
    )
};

export default ProductGallery