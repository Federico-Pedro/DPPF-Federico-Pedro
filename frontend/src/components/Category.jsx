import styles from './Category.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Category = () => {

  const { user } = useAuth()
  if (!user || user.role !== 'admin') return <Navigate to="/" />

  const { id } = useParams();

  const editing = id !== undefined;

  const [categories, setCategories] = useState('')
  const [category, setCategory] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedFile, setSelectedFile] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (editing) {
      axios.get(`http://localhost:8080/api/categories/${id}`)
        .then(response => {
          const category = response.data;
          setCategory(category)
          setCategoryName(category.name || '');
          setDescription(category.description || '');

          setSelectedCategory(category || [])

        })
        .catch(error => {
          console.error('Error fetching product:', error);
        });
    }
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/categories');
        setCategories(response.data)

      } catch (error) {
        console.error('Error al cargar características', error);
      }
    };

    fetchCategories();
  }, []);



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


  const handleFileChange = (e) => {
    const file = Array.from(e.target.files);
    setSelectedFile(file);
    console.log(file)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    //VALIDACIONES EN EL FRONT
    if (!categoryName.trim()) {
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
      let imageUrl = [];
      if (selectedFile) {
        imageUrl = await uploadImages(selectedFile)
      } else if (editing && category?.image) {
        imageUrl = category.image
      }


      const categoryData = {
        name: categoryName,
        description: description,
        image: imageUrl[0],

      }

      let response;

      if (editing) {
        response = await axios.put(`http://localhost:8080/api/categories/${id}`, categoryData);

        navigate('/administracion')
      } else {
        response = await axios.post('http://localhost:8080/api/categories', categoryData);

        setCategoryName('');
        setDescription('');
        setSelectedFile([]);
      }


    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Error al guardar la categoria. Intenta de nuevo.');
      }
    }
  }









  return (
    <div className={styles.body}>
      Agregar categoría
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="categoryName"> Categoria
          <input type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Nombre de la categoría"
            id="categoryName" />
        </label>

        <label htmlFor="description"> Descripción
          <textarea
            value={description}
            rows="4"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción"
            id="description"></textarea>
        </label>

        <label htmlFor="categoryImage">
          <input type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="categoryImage"
          />
        </label>

        <button className={styles.button} type="submit">{editing ? 'Actualizar categoría' : 'Agregar categorìa'}</button>
      </form>
    </div>
  )
}

export default Category