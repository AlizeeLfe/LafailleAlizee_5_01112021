//*****************************AFFICHAGE DE LA PAGE DE CONFIRMATION*****************************
// AFFICHER LE NUMERO DE COMMANDE SUR LA PAGE
function checkout() {
  const orderId = document.getElementById("orderId");
  orderId.innerHTML = localStorage.getItem("orderId");
  // Vider le Local Storage
  localStorage.clear();
}
checkout();
