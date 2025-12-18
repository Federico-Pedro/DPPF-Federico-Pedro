import styles from './Body.module.css'
import ProductList from './ProductList'

function Body() {
    return (
        <main className={styles.mainContainer}>

            <div className={styles.searchContainer}>
                <form action="">
                    <label htmlFor="search">
                        <input type="text" name="search" id="search" />
                    </label>
                    <button className={styles.searchButton} type="submit">Buscar</button>
                </form>
            </div>

            <div className={styles.container}>
                <div className={styles.productsContainer}>

                    <div className={styles.titleContainer}><h2>Productos</h2></div>

                    
                    <ProductList />

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