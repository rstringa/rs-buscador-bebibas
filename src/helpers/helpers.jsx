export function notificacionFavorito(mensaje){

    const div = document.createElement("div");
    div.className = "mensaje-favorito";
    let texto = document.createTextNode(mensaje);
    const p = document.createElement("p");
    p.appendChild(texto);
    div.appendChild(p);
    document.body.appendChild(div);

    setTimeout(function(){
      document.querySelector(".mensaje-favorito").remove();
    },2500)
}
export function scrollResultado() {
  
  const scrollResultado = document.querySelector("#scrollResultado");
  if( scrollResultado && window.outerWidth <= 767 ) {
  const topOffset = scrollResultado.offsetTop;
 
  setTimeout(function(){
    window.scrollTo({
      top: topOffset,
      behavior: 'smooth'
    });
  },500)
 
}
}