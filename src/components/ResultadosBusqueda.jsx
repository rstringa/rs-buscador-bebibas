import { ImStarFull } from "react-icons/im";


export const ResultadosBusqueda = ({ bebidas, EsFavorito, handleToogleItemFavorito, handleVerReceta }) => {
    return (
        <ul>
            {bebidas.map((bebida) => (
                <li className='box-resultado__item' key={bebida.idDrink}>
              
                    <img
                        className='box-resultado__img'
                        src={bebida.strDrinkThumb} alt={bebida.strDrink} />
                    <div className='box-resultado__item__info'>
                        <h2 className='box-resultado__h2'>{bebida.strDrink}</h2>

                        <div
                            className='box-resultado__favorito'
                            data-tooltip={EsFavorito(bebida) ? "Añadido a Mis Favoritos" : "Añadir a Mis Favoritos"}
                        >
                            <a
                                className=''
                                href="#"
                                onClick={function (e) {
                                    e.preventDefault();
                                    handleToogleItemFavorito(bebida)
                                }} >
                                <ImStarFull
                                    className={EsFavorito(bebida) ? "btn-favorito is--favorito" : "btn-favorito"}

                                />
                            </a>
                        </div>
                        <a
                            className='box-resultado__ver'
                            href="#"
                            onClick={function (e) {
                                e.preventDefault();
                                handleVerReceta(bebida.idDrink)

                            }}
                        >
                            Ver Receta
                        </a>
                    </div>

                </li>
            ))}
        </ul>
    )
}
