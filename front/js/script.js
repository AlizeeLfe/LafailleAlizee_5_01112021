//*****************************AFFICHAGE DE TOUS LES ARTICLES SUR LA PAGE D'ACCUEIL*****************************

// Récupération des données de L'API avec une requête GET sans paramètre pour récuperer tous les éléments
fetch("http://localhost:3000/api/products")
// Première promesse qui va nous retourner une réponse (si true) qu'on va convertir en JSON
// (avantage du JSON = directement lu et transformé en objet JS par le navigateur)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  // Afficher chaque produit avec ses propres spécificitées grâce à la concatenation Variable/Key
  .then(function (value) {
    let html = "";
    value.forEach((element) => {
      html += ` <a href="./product.html?id=${element._id}">
      <article>
        <img src="${element.imageUrl}" alt="${element.altTxt}">
        <h3 class="productName">${element.name}</h3>
        <p class="productDescription">${element.description}</p>
      </article>
    </a>`;
    });
    // Injection du code HTML dans le DOM
    const items = document.getElementById("items");
    items.innerHTML = html;
  })
  // Non resolution de la promesse (pas d'execution du .then)
  // Affichage d'un message d'erreur si on obtien pas de reponse de l'API (codes de statut 400 à 500+)
  .catch(function (err) {
    const items = document.getElementById("items");
    items.innerHTML = `Une erreur est survenue (${err})`;
  });
