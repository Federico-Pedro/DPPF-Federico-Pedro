import styles from './ProductDetail.module.css'
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';



const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        axios.get(`http://localhost:8080/api/products/${id}`)
            .then(response => {
                setProduct(response.data);
                console.log(response.data)
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
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h1>{product.name}</h1>
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
        </div>
    );
};

export default ProductDetail;