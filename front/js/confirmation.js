//*****************************AFFICHAGE DE LA PAGE DE CONFIRMATION*****************************

// FONCTION POUR AFFICHER LE NUMERO DE COMMANDE SUR LA PAGE, ET VIDER LE LS
function checkout() {
  // Recuperation des paramètres "get" dans l'URL
  const urlWithId = window.location.search;
  // Découpage des différents paramètres de l'URL
  const urlSearchparams = new URLSearchParams(urlWithId);
  // Extraire l'id
  const orderId = urlSearchparams.get("orderId");
  if (orderId) {
    // Recuperation de l'élément HTML
    const orderIdHtml = document.getElementById("orderId");
    // Injection du code HTML dans le DOM
    orderIdHtml.innerHTML = orderId;
  } else {
    window.location.href = "./index.html";
  }
}
// Appel de la fonction
checkout();
