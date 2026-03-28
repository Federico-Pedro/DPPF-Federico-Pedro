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

                    setSelectedCategories(product.categories?.map(c => c.id) || [])
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
    const [selectedCategories, setSelectedCategories] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedFile, setSelectedFile] = useState([])
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [politics, setPolitics] = useState([])

    const token = localStorage.getItem('token')


    const uploadImages = async (files) => {
        const formData = new FormData();


        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            const response = await axios.post('http://localhost:8080/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
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
        if (!characteristics) {
            setError('Debe agregar al menos una caracteristica');
            return;
        }
        if (selectedCategories.length === 0) {
            setError('La categoría es obligatoria');
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
                categoryIds: selectedCategories,
                characteristicIds: selectedCharacteristics,
                politics: politics.map(p => JSON.stringify(p))
            }

            let response;
            console.log(productData)
            if (editing) {
                response = await axios.put(`http://localhost:8080/api/products/${id}`, productData,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setSuccess(`Producto "${response.data.name}" actualizado exitosamente`)
                navigate('/table')
            } else {
                response = await axios.post('http://localhost:8080/api/products', productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setSuccess(`Producto "${response.data.name}" creado exitosamente!`);
                setProductName('');
                setDescription('');
                setProductCategory('');
                setSelectedFile([]);
                setSelectedCharacteristics([]);
                setPolitics([]);
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



    //FUNCIONES DE POLITICAS DEL PRODUCTO
    const addPolitic = (e) => {
        e.preventDefault();
        setPolitics(prev => [...prev, { title: '', description: '' }])
    }

    const handlePoliticChange = (index, field, value) => {
        const updated = [...politics]
        updated[index][field] = value
        setPolitics(updated)
    }


    return (
        <div className={styles.adminContainer}>
            <div className={styles.titleContainer}>
                <h2>{editing ? 'Editar Producto' : 'Cargar producto'}</h2>
            </div>





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
                            <label key={c.id} htmlFor={c.id}>
                                <input
                                    type="checkbox"
                                    id={c.id}
                                    value={c.id}
                                    checked={selectedCategories.includes(c.id)}
                                    onChange={(e) => {
                                        const value = Number(e.target.value)
                                        if (e.target.checked) {
                                            setSelectedCategories(prev => [...prev, value])
                                        } else {
                                            setSelectedCategories(prev => prev.filter(id => id !== value))
                                        }
                                    }}
                                />
                                {c.name}
                            </label>
                        ))}



                    </div>

                    <label>Características del producto</label>
                    <div className={styles.characteristicsContainer}>
                        {characteristics.map(char => (

                            <label htmlFor={char.id} className={styles.charLabel}>{char.name}

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



                <div className={styles.imagesContainer}>
                    Imagenes del producto

                    <label htmlFor="fileInput" className={styles.customButton}>
                        Subir imagenes
                        <input
                            id="fileInput"
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                    </label>

                </div>


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


                <label className={styles.labelImages} htmlFor="productpolicies">

                    {/* POLITICAS DEL PRODUCTO */}
                    Politicas del producto

                    {politics.map((p, index) => (
                        <div className={styles.politicsContainer} key={index}>

                            <input
                                type="text"
                                value={p.title}
                                onChange={(e) => handlePoliticChange(index, 'title', e.target.value)}
                                placeholder="Título"
                            />
                            <textarea
                                value={p.description}
                                onChange={(e) => handlePoliticChange(index, 'description', e.target.value)}
                                placeholder="Descripción"
                            />
                            <button onClick={() => setPolitics(prev => prev.filter((_, i) => i !== index))}>
                                Eliminar
                            </button>
                        </div>
                    ))}
                </label>
                <button className={styles.button} onClick={addPolitic}>Agregar política</button>

                {success && (
                    <div className={styles.success}>{success}</div>
                )}
                {error && (
                    <div className={styles.error}>{error}</div>
                )}

                <button className={styles.button} type="submit">{editing ? 'Actualizar producto' : 'Crear producto'}</button>
            </form >
        </div >
    )
}

export default CreateProduct