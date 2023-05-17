import { useState, useEffect } from "react"
import "./Modal.css"
import { ImStarFull } from "react-icons/im";

const Modal = ({ bebidaSeleccionada, setBebidaSeleccionada, handleCloseModal, setFavoritos }) => {
  const [favorito, setFavorito] = useState(false);

  useEffect(() => {
    comprobarFavoritoInicial();
    document.addEventListener("click", function (event) {

      // Si hace click afuero del contenido Modal se cierra
      if (event.target.classList.contains("modal")) {
        setBebidaSeleccionada(null)
        handleCloseModal();

      }

    });
  }, [])

 /* const actualizarFavoritos = ()=>{
    const favoritos = JSON.parse(localStorage.getItem('favoritos'));
    setFavoritos([...favoritos]);
    console.log(favoritos);
  }  
  */
  const comprobarFavoritoInicial = () => {
    // Obtener los favoritos existentes del localStorage
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    // Verificar si la bebida seleccionada ya existe en favoritos
    const existeFavorito = favoritos.some((favorito) => favorito.idDrink === bebidaSeleccionada.idDrink);
    if (existeFavorito) {
      setFavorito(true);
    }
  }

  /* Favoritos */
  const handleFavorito = (idDrink) => {
    
    // Obtener los favoritos existentes del localStorage
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    // Verificar si la bebida seleccionada ya existe en favoritos
    const existeFavorito = favoritos.some((favorito) => favorito.idDrink === bebidaSeleccionada.idDrink);

    if (existeFavorito) {
       // La bebida seleccionada ya está en favoritos, se elimina del array
      const nuevosFavoritos = favoritos.filter(favorito => favorito.idDrink !== bebidaSeleccionada.idDrink)
      localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
      setFavorito(false);

    } else {
      // Agregar la bebida seleccionada al array de favoritos
      const nuevosFavoritos = [...favoritos, bebidaSeleccionada];
      // Guardar el array actualizado en el localStorage
      localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
      setFavorito(true);
  
    }

  }

  return (
    <div className="modal">
      <div className="modal-content">

        <img
          className='modal-content__image'
          src={bebidaSeleccionada.strDrinkThumb} alt={bebidaSeleccionada.strDrink}
        />
        <div className="modal-content__info">
          <span className="modal-content__close" onClick={handleCloseModal}>
            &times;
          </span>
          <div 
           data-tooltip={ favorito ? "Añadido a Mis Favoritos" : "Añadir a Mis Favoritos"}
          className="modal-content__favorito">
          <ImStarFull
            className={favorito ? "btn-favorito is--favorito" : "btn-favorito"}
            onClick={() => handleFavorito(bebidaSeleccionada.idDrink)}
          />
          </div>
          <h2>{bebidaSeleccionada.strDrink}</h2>
          <h4>{bebidaSeleccionada.strGlass}</h4>
          <p>{bebidaSeleccionada.strInstructions}</p>
          <ul>
            {Object.keys(bebidaSeleccionada)
              .filter((key) => key.startsWith("strIngredient") && bebidaSeleccionada[key])
              .map((key) => (
                <li key={key}>{bebidaSeleccionada[key]}</li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Modal