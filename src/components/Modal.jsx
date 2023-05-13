import {useEffect} from "react"
import "./Modal.css"

const Modal = ({ bebidaSeleccionada, setBebidaSeleccionada, handleCloseModal}) => {

    useEffect(() => {
    document.addEventListener("click", function(event) {
       
        // Si hace click afuero del contenido Modal se cierra
        const excludedClasses = ["modal-content__image", "modal-content__info"];
        if(event.target.classList.contains("modal")){
            setBebidaSeleccionada(null)
            handleCloseModal();
        }
       
      });
    }, [])  
      
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