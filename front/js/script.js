//*****************************AFFICHAGE DE TOUS LES PRODUITS SUR LA PAGE D'ACCUEIL*****************************

// Récupération de tous les produits que contient L'API avec une requête de type "GET"
// Utilisation de l'API FETCH (+souple, +puissante que "XMLHttpRequest": ancienne version)
// On évite le "Callbackhell" en utilisant des promesses asynchrones
fetch("http://localhost:3000/api/products")
  // Première promesse :
  .then(function (res) {
    if (res.ok) {
      // Elle retourne une réponse qu'on va convertir en JSON
      // (avantage du JSON = directement lu et transformé en objet JS par le navigateur)
      return res.json();
    }
  })
  // Deuxième promesse: 
  .then(function (value) {
    // Concaténation des éléments HTML pour afficher CHAQUE produit de façon dynamique
    // Modification du contenu de chaque variable avec les bonnes données
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
    // Récupération de l'élément HTML
    const items = document.getElementById("items");
    // Injection du code HTML dans le DOM
    items.innerHTML = html;
  })
  // Si la promesse n'a pas été résolue, elle ne sera pas exécutée, alors on récupère l'erreur....
  .catch(function (err) {
    const items = document.getElementById("items");
    //...que l'on affiche dans le message d'erreur
    items.innerHTML = `Une erreur est survenue (${err})`;
  });
