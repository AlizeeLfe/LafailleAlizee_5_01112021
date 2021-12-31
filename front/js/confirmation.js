//*****************************AFFICHAGE DE LA PAGE DE CONFIRMATION*****************************

// FONCTION POUR AFFICHER LE NUMERO DE COMMANDE SUR LA PAGE, ET VIDER LE LS
function checkout() {
  // Recuperation de l'élément HTML
  const orderId = document.getElementById("orderId");
  // Injection du code HTML dans le DOM
  orderId.innerHTML = localStorage.getItem("orderId");
  // Vider le Local Storage
  localStorage.clear();
}
// Appel de la fonction
checkout();
