import { useState } from 'react'
import axios from 'axios'
import styles from './AdminPanel.module.css'

function AdminPanel() {

    const [productName, setProductName] = useState('')
    const [description, setDescription] = useState('')
    const [selectedFile, setSelectedFile] = useState([])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')



    const uploadImages = async (files) => {
    const formData = new FormData();
    
   
    files.forEach(file => {
        formData.append('files', file);
    });

    try {
        const response = await axios.post('http://localhost:8080/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;

    } catch (error) {
        console.error('Error uploading images:', error);
        throw error;
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!productName.trim()) {
        setError('El nombre es obligatorio');
        return;
    }

    try {
        let imageUrls = [];
        if (selectedFile.length > 0) {
            imageUrls = await uploadImages(selectedFile)
        }

        const response = await axios.post('http://localhost:8080/api/products', {
            name: productName,
            description: description,
            images: imageUrls
        });

        setSuccess(`Producto "${response.data.name}" creado exitosamente!`);
        setProductName('');
        setDescription('');
        setSelectedFile([]);

    } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            setError(error.response.data.error);
        } else {
            setError('Error al crear el producto. Intenta de nuevo.');
        }
    }
}

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFile(files);
        console.log(files)
    };




    return (
        <div className={styles.adminContainer}>
            <div className={styles.titleContainer}>
                <h2>Panel de Administración</h2>
            </div>

            {success && (
                <div className={styles.success}>{success}</div>
            )}
            {error && (
                <div className={styles.error}>{error}</div>
            )}



            <form className={styles.form} onSubmit={handleSubmit}>
                <label htmlFor="productName"> Nombre del producto
                    <input type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Nombre del producto"
                        id="productName" />

                </label>
                <label htmlFor="productDescription"> Descripción del producto
                    <textarea
                        value={description}
                        rows='4'
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción del producto"
                        id="productDescription" />
                </label>
                <label htmlFor="productimages"> Imágenes del producto
                    <input type="file" multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        id="productimages" />
                </label>

                {selectedFile.length > 0 && (
                    <div className={styles.imagePreview}>
                        {selectedFile.map((file, index) => (
                            <img
                                className={styles.productImage}
                                key={index}
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index}`}

                            />
                        ))}
                    </div>
                )}
                <button className={styles.button} type="submit">Agregar producto</button>
            </form>
        </div>
    )
}

export default AdminPanel