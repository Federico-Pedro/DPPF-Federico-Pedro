import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from './Form.module.css'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


function CreateProduct() {

    const { user } = useAuth()
    if (!user || user.role !== 'admin') return <Navigate to="/" />

    const { id } = useParams();

    const editing = id !== undefined;
    const [product, setProduct] = useState('')

    useEffect(() => {
        if (editing) {
            axios.get(`http://localhost:8080/api/products/${id}`)
                .then(response => {
                    const product = response.data;
                    setProduct(product)
                    setProductName(product.name || '');
                    setDescription(product.description || '');
                    setProductCategory(product.category || '');
                    setSelectedCharacteristics(product.characteristics.map(char => char.id) || [])

                })
                .catch(error => {
                    console.error('Error fetching product:', error);
                });
        }
    }, [id]);

    //Trae las características de la base de datos 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesRes, characteristicsRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/categories'),
                    axios.get('http://localhost:8080/api/characteristics')
                ]);
                setCategories(categoriesRes.data);
                setCharacteristics(characteristicsRes.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [])




    const navigate = useNavigate()
    const [productName, setProductName] = useState('')
    const [description, setDescription] = useState('')
    const [productCategory, setProductCategory] = useState('')
    const [selectedCharacteristics, setSelectedCharacteristics] = useState([])
    const [characteristics, setCharacteristics] = useState([])
    const [categories, setCategories] = useState([])
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


        //VALIDACIONES EN EL FRONT
        if (!productName.trim()) {
            setError('El nombre es obligatorio');
            return;
        }
        if (!description.trim()) {
            setError('La descripción es obligatoria');
            return;
        }

        if (selectedFile.length === 0 && !editing) {
            setError('Debe agregar al menos una imagen');
            return;
        }

        try {
            let imageUrls = [];
            if (selectedFile.length > 0) {
                imageUrls = await uploadImages(selectedFile)
            } else if (editing && product?.images) {
                imageUrls = product.images
            }


            const productData = {
                name: productName,
                description: description,
                images: imageUrls,
                category: productCategory,
                characteristicIds: selectedCharacteristics
            }

            let response;
            console.log(productData)
            if (editing) {
                response = await axios.put(`http://localhost:8080/api/products/${id}`, productData);
                setSuccess(`Producto "${response.data.name}" actualizado exitosamente`)
                navigate('/table')
            } else {
                response = await axios.post('http://localhost:8080/api/products', productData);
                setSuccess(`Producto "${response.data.name}" creado exitosamente!`);
                setProductName('');
                setDescription('');
                setProductCategory('');
                setSelectedFile([]);
            }


        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setError(error.response.data.error);
            } else {
                setError('Error al guardar el producto. Intenta de nuevo.');
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
                <h2>{editing ? 'Editar Producto' : 'Panel de Administración'}</h2>
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
                        rows='6'
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descripción del producto"
                        id="productDescription" />
                </label>

                <div className={styles.form}>
                    <label className={styles.titleContainer}>Categoría del producto</label>

                    <div className={styles.categoryContainer}>
                        {categories.map(c => (
                            <label htmlFor={c.name}>
                                <input
                                    type="radio"
                                    id={c.id}
                                    name={c.name}
                                    value={c.name}
                                    checked={productCategory === c.name}
                                    onChange={(e) => setProductCategory(e.target.value)}
                                />
                                {c.name}
                            </label>
                        ))}

                    </div>

                    <label>Características del producto</label>
                    <div className={styles.characteristicsContainer}>
                        {characteristics.map(char => (

                            <label htmlFor={char.id}>{char.name}

                                <input
                                    type="checkbox"
                                    id={char.id}
                                    name={char.name}
                                    value={char.id}
                                    checked={selectedCharacteristics.includes(char.id)}
                                    onChange={(e) => {
                                        const value = Number(e.target.value);
                                        if (e.target.checked) {
                                            setSelectedCharacteristics(prev => [...prev, value]);
                                        } else {
                                            setSelectedCharacteristics(prev => prev.filter(id => id !== value));
                                        }
                                    }}
                                />
                            </label>
                        ))}
                    </div>
                </div>


                <label htmlFor="productimages"> Imágenes del producto
                    <input type="file" multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        id="productimages" />
                </label>

                {
                    editing && product?.images && selectedFile.length === 0 && (
                        <div className={styles.imagePreview}>
                            {product.images.map((url, index) => (
                                <img
                                    className={styles.productImage}
                                    key={index}
                                    src={url}
                                    alt={`Imagen ${index}`}
                                />
                            ))}
                        </div>
                    )
                }

                {
                    selectedFile.length > 0 && (
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
                    )
                }
                <button className={styles.button} type="submit">{editing ? 'Actualizar producto' : 'Agregar producto'}</button>
            </form >
        </div >
    )
}

export default CreateProduct