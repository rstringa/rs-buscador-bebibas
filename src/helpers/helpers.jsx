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
  const divResultado = document.querySelector("#resultado");
  const topOffset = divResultado.offsetTop;

  window.scrollTo({
    top: topOffset,
    behavior: 'smooth'
  });
}