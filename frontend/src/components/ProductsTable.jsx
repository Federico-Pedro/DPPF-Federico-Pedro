import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProductsTable.module.css'
import { Link } from 'react-router-dom';


function ProductsTable() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/products');
                setProducts(response.data)

            } catch (error) {
                console.error('Error al cargar productos', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

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
            <table>
                <thead className={styles.tableHead}>
                    <tr>
                        <th className={styles.th}>ID</th>
                        <th className={styles.th}>Nombre</th>
                        <th className={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td className={styles.cell}>{product.id}</td>
                            <td className={styles.cell}>{product.name}</td>
                            <td className={styles.buttonCell}>
                                <button className={styles.editButton}>Editar</button>
                                <button className={styles.deleteButton}>Borrar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>)

}

export default ProductsTable