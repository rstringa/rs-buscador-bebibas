import { useState, useEffect } from 'react'
import 'normalize.css';
import "./App.css"
import Lottie from "lottie-react";
import CoctailAnimation from "./assets/coctail-animation.json";
import Modal from './components/Modal';
import Spinner from './components/Spinner';

function App() {

  const [bebida, setBebida] = useState("")
  const [bebidas, setBebidas] = useState([])
  const [categoria, setCategoria] = useState("")
  const [opcionesCategoria, setOpcionesCategoria] = useState([])
  const [bebidaSeleccionada, setBebidaSeleccionada] = useState(null)
  const [pantallaInicial, setPantallaInicial] = useState(true)
  const [pantallaError, setPantallaError] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  
  const body = document.getElementsByTagName('body')[0];

  // Obtener Categorias
  useEffect(() => {
    const obtenerCategorias = async () => {
      const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list")
      const data = await response.json()
      setOpcionesCategoria(data.drinks.map(drink => drink.strCategory))
    }
    obtenerCategorias()
  }, [])


  // SUBMIT
  const handleSubmit = e => {
    e.preventDefault()

    // Verificar los campos no este vacios
    if (!bebida && categoria === "") {
      window.alert("Seleccione un tipo de búsqueda")
      return
    }

    obtenerBebidas()

  }

  const obtenerBebidas = async () => {
    let url = "";

    if (categoria && bebida) {

      url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${categoria}&i=${bebida}`;
    } else if (categoria && !bebida) {

      url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${categoria}`;
    } else if (!categoria && bebida) {

      url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${bebida}`;
    }

    let response = await fetch(url);

    try {
      let data = await response.json();

      // Verificar si existen bebidas en los datos
      if (data.drinks) {

        setShowSpinner(true);
        setPantallaInicial(false);
        setPantallaError(false);
        setBebidas([]);

        setTimeout(() => {
          setBebidas(data.drinks.map((bebida) => ({ ...bebida, detalles: null })));
          setShowSpinner(false);

        }, 2000); // Mostrar el spinner durante 2 segundos

      } else {
        setBebidas([]);
        setPantallaInicial(true);
      }
    } catch (error) {
      console.error("Error al parsear el JSON:", error);
      // Manejar el error y establecer el estado adecuado

      setPantallaError(true);
      setBebidas([]);
    }
  };

  const obtenerDetallesBebida = async (id) => {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await response.json();
    return data.drinks[0];
  };

  const handleVerReceta = async (id) => {
    const detalles = await obtenerDetallesBebida(id);
    setBebidaSeleccionada(detalles);
    body.classList.add('modal--open');
  };

  const handleResetAll = e => {
    e.preventDefault()
    setBebidas([]);
    setBebida([]);
    setCategoria([]);
    setBebidaSeleccionada(null);
    setPantallaInicial(true);
    setPantallaError(false);
    setShowSpinner(false);
  }
  const handleCloseModal = () => {
    setBebidaSeleccionada(null);
    body.classList.toggle('modal--open');
  };

  /* Fix Buscador on Scroll */
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > (document.body.scrollHeight - 1500) && window.scrollY > 2000);
    });
  }, []);

  const EsFavorito = (bebida) => {
    const favoritos = JSON.parse(localStorage.getItem('favoritos'));
    const existeFavorito = favoritos.some(favorito => favorito.idDrink === bebida.idDrink);
    return existeFavorito;
  }

  return (
    <>
      <h1 className='titulo'>Cocktails & Tragos</h1>
      <h3 className='subtitulo'>Buscador de bebidas</h3>
      <div className={scroll ? "box-buscador is--fixed" : "box-buscador"}>
        <form className="box-buscador__form" onSubmit={handleSubmit}>
          <div className='box-buscador__col'>
            <label className="box-buscador__label" htmlFor="nombre">Nombre del trago</label>
            <input
              placeholder="Ej: Tequila, Vodka, etc"
              name="nombre"
              type="text"
              id="nombre"
              className="box-buscador__text"
              value={bebida}
              onChange={e => setBebida(e.target.value)}
            />
          </div>
          <div className='box-buscador__col'>
            <label className="box-buscador__label" htmlFor="categoria">Categoría del trago</label>
            <select
              name="categoria"
              className="box-buscador__select"
              id="categoria"
              value={categoria}
              onChange={function (e) {
                return setCategoria(e.target.value)
              }}
            >
              <option value="">- Selecciona Categoria -</option>
              {opcionesCategoria.map((opcion, index) => (
                <option key={index}>{opcion}</option>
              ))}
            </select>
            <div className="caret"></div>
          </div>
          <div className='box-buscador__col col--last'>

            <button
              type="submit"
              className="box-buscador__submit">Buscar Bebidas</button>
            <button
              type="button"
              onClick={handleResetAll}
              className="box-buscador__reset">Borrar</button>
          </div>
        </form>
      </div>

      {pantallaError &&
        <div className='box-error'>
          <h3>No hay tragos en esa búsqueda.</h3>
        </div>
      }

      {pantallaInicial &&
        <div className='pantalla-inicial'>
          <Lottie animationData={CoctailAnimation} loop={true} />

        </div>
      }

      <div className='box-resultado'>
        {showSpinner &&
          <Spinner />
        }
        <ul>
          {bebidas.map((bebida) => (
            <li className='box-resultado__item' key={bebida.idDrink}>
              <a
                className='box-resultado__a'
                href="#"
                onClick={function (e) {
                  e.preventDefault();
                  handleVerReceta(bebida.idDrink)

                }}
              >
                <img
                  className='box-resultado__img'
                  src={bebida.strDrinkThumb} alt={bebida.strDrink} />
                <div className='box-resultado__item__info'>
                  <h2 className='box-resultado__h2'>{bebida.strDrink}</h2>
                  <button
                    className={EsFavorito(bebida) ? "btn-favorito is--favorito" : "btn-favorito"}

                  >F</button>
                  <p
                    className='box-resultado__p'
                  >Ver Receta</p>

                </div>
              </a>
            </li>
          ))}
        </ul>

      </div>

      {bebidaSeleccionada &&

        <Modal
          bebidaSeleccionada={bebidaSeleccionada}
          setBebidaSeleccionada={setBebidaSeleccionada}
          handleCloseModal={handleCloseModal}

        />
      }

    </>

  )
}

export default App