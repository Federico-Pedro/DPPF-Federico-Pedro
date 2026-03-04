import styles from './Body.module.css'
import ProductList from './ProductList'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useState, useEffect } from 'react'
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { es } from 'date-fns/locale/es';
import axios from 'axios';
registerLocale('es', es)

function Body() {

    const [selectedDate, setSelectedDate] = useState(null)
    const [products, setProducts] = useState([])
    const [searchText, setSearchText] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [filteredResults, setFiltedredResults] = useState('')


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/products');
                setProducts(response.data)
            } catch (error) {
                console.error('Error al cargar productos', error);
            }

        }
        fetchProducts();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        await setFiltedredResults(searchText)
        setSuggestions([])

    }

    const clearSearch = async (e) => {
        e.preventDefault()
        await setFiltedredResults('')
        setSuggestions([])
        setSearchText('')
    }

    return (
        <main className={styles.mainContainer}>

            <div className={styles.searchContainer}>
                Buscador
                <form onSubmit={handleSubmit}>
                    <div>

                        <label htmlFor="search">
                            <input type="text" name="search" id="search" placeholder="Ingrese su busqueda" autoComplete="off" className={styles.search}
                                onChange={(e) => {
                                    const value = e.target.value
                                    setSearchText(value)
                                    if (value.length > 0) {
                                        setSuggestions(products.filter(p =>
                                            p.description.toLowerCase().includes(value.toLowerCase())
                                        ))

                                    } else {
                                        setSuggestions([])
                                    }
                                }}
                            />
                        </label>

                        <div>

                            <DatePicker
                                placeholderText="Seleccionar fecha"
                                locale="es"
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                monthsShown={2}
                                dateFormat="dd/MM/yyyy"

                            // inline
                            />

                        </div>

                    </div>
                    <div>

                        <button className={styles.searchButton} type="submit">Buscar</button>
                        <button className={styles.searchButton} type="button" onClick={clearSearch}>Limpiar búsqueda</button>
                    </div>
                </form>
                <p>Ingrese una palabra clave y/o la fecha deseada para filtrar resultados</p>

                {suggestions.length > 0 &&

                    <div className={styles.sugerencias}>Sugerencias: {
                        suggestions.map(s => (<p key={s.id}>{s.name}</p>))
                    } </div>
                }
            </div>

            <div className={styles.container}>
                <div className={styles.productsContainer}>

                    <div className={styles.titleContainer}><h2>Productos</h2></div>


                    <ProductList filteredResults={filteredResults} />

                </div>

            </div>
            <div className={styles.specialOfferContainer}>
                <div className={styles.specialTitleContainer}> <h2>Ofertas</h2></div>
                <div className={styles.specialCardContainer}>
                    <div className={styles.specialCard}>
                        <img className={styles.cardImage} src="/wine.jpg" alt="" />
                    </div>
                    <div className={styles.specialCard}>
                        <img className={styles.cardImage} src="/rome.jpg" alt="" />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Body;