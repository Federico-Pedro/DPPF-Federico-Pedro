import styles from './Category.module.css'

const Category = () => {
  return (
    <div className={styles.body}>
        Agregar categoría
        <form>
            <label htmlFor=""> Categoria
            <input type="text" />
            </label>
            <label htmlFor=""> Descripción
            <textarea name="" id=""></textarea>
            </label>
            <input type="file" />
        </form>
    </div>
  )
}

export default Category