import { ImStarFull } from "react-icons/im";

export const VerFavoritos = ({ favoritos, EsFavorito, handleToogleItemFavorito, handleVerReceta }) => {
    return (
        <ul>
            {favoritos.map((favorito) => (


                <li className={`box-resultado__item id-${favorito.idDrink}`} key={favorito.idDrink}>

                    <img
                        loading="lazy"
                        className='box-resultado__img'
                        src={favorito.strDrinkThumb} alt={favorito.strDrink} />
                    <div className='box-resultado__item__info'>
                        <h2 className='box-resultado__h2'>{favorito.strDrink}</h2>

                        <div
                            className='box-resultado__favorito'
                            data-tooltip={EsFavorito(favorito) ? "Añadido a Mis Favoritos" : "Añadir a Mis Favoritos"}
                        >
                            <a
                                className=''
                                href="#"
                                onClick={function (e) {
                                    e.preventDefault();
                                    handleToogleItemFavorito(favorito)
                                }} >
                                <ImStarFull
                                    className={EsFavorito(favorito) ? "btn-favorito is--favorito" : "btn-favorito"}

                                />
                            </a>
                        </div>
                        <a
                            className='box-resultado__ver'
                            href="#"
                            onClick={function (e) {
                                e.preventDefault();
                                handleVerReceta(favorito.idDrink)

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
