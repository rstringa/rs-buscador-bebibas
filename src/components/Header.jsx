import { useEffect, useState } from "react";
import { ImStarFull } from "react-icons/im";
import { ImHome } from "react-icons/im";

export const Header = ({handleVolverPantallaInicial,handleVerFavoritos,handleSubmit,bebida,setBebida,setCategoria, favoritos, setFavoritos, categoria,opcionesCategoria}) => {
    
    
      /* Fix Buscador on Scroll */
  // const [scroll, setScroll] = useState(false);
  // useEffect(() => {
  //   window.addEventListener("scroll", () => {
  //     setScroll(window.scrollY > (document.body.scrollHeight - 1500) && window.scrollY > 2000);
  //   });
  // }, []);


  const handleFormSubmit = (event) => {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente
    handleSubmit();
  };

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
                onKeyDown={handleFormSubmit}
                className="box-buscador__submit">Buscar Bebidas</button>
                
            </div>
          </form>
        </div>
        </>
    )
  }
  