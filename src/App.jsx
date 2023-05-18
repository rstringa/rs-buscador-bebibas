import 'normalize.css';
import "./App.css"
/* Componentes */
import { useState, useEffect } from 'react'
import Modal from './components/Modal';
import Spinner from './components/Spinner';
import { ResultadosBusqueda } from './components/ResultadosBusqueda';
import { VerFavoritos } from './components/VerFavoritos';
/* Extras */
import Lottie from "lottie-react";
import CoctailAnimation from "./assets/coctail-animation.json";
import { notificacionFavorito, scrollResultado } from "./helpers/helpers";
import { ImStarFull } from "react-icons/im";
import { ImHome } from "react-icons/im";

function App() {

  const [bebida, setBebida] = useState("")
  const [bebidas, setBebidas] = useState([])
  const [categoria, setCategoria] = useState("")
  const [opcionesCategoria, setOpcionesCategoria] = useState([])
  const [bebidaSeleccionada, setBebidaSeleccionada] = useState(null)
  const [pantallaInicial, setPantallaInicial] = useState(true)
  const [pantallaError, setPantallaError] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)
  const [verFavoritos, setVerFavoritos] = useState(false)
  const [hayFavoritos, setHayFavoritos] = useState(false)
  const [favoritos, setFavoritos] = useState(JSON.parse(localStorage.getItem('favoritos')))
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

    obtenerListadoTragos()

  }

  const obtenerListadoTragos = async () => {
    let url = "";

    if ((categoria.length !== 0) && bebida) {

      url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${categoria}&s=${bebida}`;

    } else if ((categoria.length !== 0) && !bebida) {

      url = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${categoria}`;

    } else if ((categoria.length === 0) && bebida) {

      url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${bebida}`;
    }

    let response = await fetch(url);
    
    console.log(url);
    try {
      let data = await response.json();
      
      console.log(data);

      // Verificar si existen bebidas en los datos
      if (data.drinks) {

        setShowSpinner(true);
        setPantallaInicial(false);
        setPantallaError(false);
        setVerFavoritos(false);
        setBebidas([]);
       
        
        setTimeout(() => {
          setBebidas(data.drinks.map((bebida) => ({ ...bebida, detalles: null })));
          setShowSpinner(false);
          
          scrollResultado();
        

        }, 1500); // Mostrar el spinner durante 2 segundos
       

      } else {
        setBebidas([]);
        setPantallaError(true);
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

const handleVolverPantallaInicial = (e) => {
      e.preventDefault();
      setBebidas([]);
      setBebida([]);
      setCategoria([]);
      setBebidaSeleccionada(null);
      setPantallaInicial(true);
      setPantallaError(false);
      setShowSpinner(false);
      setVerFavoritos(false);
    };

  const handleCloseModal = () => {
    setBebidaSeleccionada(null);
    body.classList.toggle('modal--open');
  };


  const EsFavorito = (bebida) => {
    const favoritosStorage = JSON.parse(localStorage.getItem('favoritos'));
    const existeFavorito = favoritosStorage && favoritosStorage.some(favorito => favorito.idDrink === bebida.idDrink);
    return existeFavorito;
  }

  const handleVerFavoritos = () => {
    setVerFavoritos(true);
    setPantallaInicial(false);
    setPantallaError(false);
    setBebidas([]);
    setShowSpinner(true);
    scrollResultado();
    // Listado de Favoritos desde LocalStorage
    const nuevosFavoritos = JSON.parse(localStorage.getItem('favoritos'));
    setFavoritos(nuevosFavoritos || []);

    // Comprobar si hay favoritos
    const hayFavoritos = nuevosFavoritos && nuevosFavoritos.length > 0;
    setHayFavoritos(hayFavoritos);

    setTimeout(() => {
      setShowSpinner(false);
    }, 1500); // Mostrar el spinner durante 2 segundos

  }


  // Toggle activar Favorito en Resultados de busqueda
  const handleToogleItemFavorito = (bebidaActual) => {
 
    // Obtener los favoritos existentes del localStorage
    const favoritos2 = JSON.parse(localStorage.getItem('favoritos')) || [];
    // Verificar si la bebida seleccionada ya existe en favoritos
    const existeFavorito = favoritos2.some((favorito) => favorito.idDrink === bebidaActual.idDrink);
   
    if (existeFavorito) {
       // La bebida seleccionada ya está en favoritos, se elimina del array
      const nuevosFavoritos = favoritos2.filter(favorito => favorito.idDrink !== bebidaActual.idDrink)
      localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
      
      // Animacion de Salida cuando se borra un item de Favoritos
      // Solo para Pantalla de Ver Favoritos
          if ( verFavoritos ) {
              let itemActual = body.querySelector(`.id-${bebidaActual.idDrink}`)
              itemActual ? itemActual.classList.add("animacion-salida") : "";
              setTimeout(() => {
                  setFavoritos(nuevosFavoritos);
                  itemActual ? itemActual.classList.remove("animacion-salida") : "";
              }, 2000);

          } else {
              setFavoritos(nuevosFavoritos);
          }
          notificacionFavorito("Eliminado de Mis Favoritos");

    } else {
      // Agregar la bebida seleccionada al array de favoritos
      const nuevosFavoritos = [...favoritos2, bebidaActual];
      // Guardar el array actualizado en el localStorage
      localStorage.setItem('favoritos', JSON.stringify(nuevosFavoritos));
      setFavoritos(nuevosFavoritos);
      notificacionFavorito("Añadido a Mis Favoritos");
    }
  }


        /* Fix Buscador on Scroll */
        const [scroll, setScroll] = useState(false);
        useEffect(() => {
          window.addEventListener("scroll", () => {
            setScroll(window.scrollY > (document.body.scrollHeight - 1500) && window.scrollY > 2000);
          });
        }, []);

  return (
    <>


      <h1 className='titulo'>Cocktails & Tragos</h1>
        <h3 className='subtitulo'>Buscador de bebidas</h3>
        <div className={scroll ? "box-buscador is--fixed" : "box-buscador"}>
          <div
            className="box-buscador__reset"
            onClick={handleVolverPantallaInicial}>
            <ImHome />
          </div>
          <div
            onClick={handleVerFavoritos}
            className={`header-favoritos ${favoritos.length ? 'tiene--favoritos' : 'sin--favoritos'}`}>
            <ImStarFull
              className="btn-favorito"
            />Mis Favoritos ({favoritos.length})
          </div>
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
                
            </div>
          </form>
        </div>
      <div id="scrollResultado"></div>            
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
      {showSpinner &&
          <Spinner />
        }
     { bebidas.length !== 0 &&
      <div className='box-resultado' id="resultado">
        
        <ResultadosBusqueda
          bebidas={bebidas}
          EsFavorito={EsFavorito}
          handleToogleItemFavorito = {handleToogleItemFavorito}
          handleVerReceta={ handleVerReceta}
        />

      </div>
      }
      {bebidaSeleccionada &&

        <Modal
          bebidaSeleccionada={bebidaSeleccionada}
          setBebidaSeleccionada={setBebidaSeleccionada}
          handleCloseModal={handleCloseModal}
          setFavoritos={setFavoritos}
        />
      }

      {verFavoritos &&
        <div className='box-favoritos'>
          <h2 className='box-favoritos__titulo'>Mis Favoritos</h2>
          <div className='box-resultado'>
            {hayFavoritos ?
              (
               <VerFavoritos 
               favoritos={favoritos}
               EsFavorito={EsFavorito}
               handleToogleItemFavorito = {handleToogleItemFavorito}
               handleVerReceta={ handleVerReceta}
               />
              ) : (
                <div className="box-error"><h3>No tienes tragos favoritos aún.</h3></div>
              )
            }

          </div>
        </div>
      }

    </>

  )
}

export default App
