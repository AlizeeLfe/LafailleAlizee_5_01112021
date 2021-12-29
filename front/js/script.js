//*****************************AFFICHAGE DE TOUS LES ARTICLES SUR LA PAGE D'ACCUEIL*****************************

// Récupération de tous les articles que contient L'API avec une requête GET
fetch("http://localhost:3000/api/products")
  // Première promesse qui retourne une réponse qu'on va convertir en JSON
  // (avantage du JSON = directement lu et transformé en objet JS par le navigateur)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  // Ensuite : afficher chaque article de façon dynamique, avec leurs valeurs grâce à des variables
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
  // Si la promesse n'a pas été résolue, elle ne sera pas exécutée, alors on récupère l'erreur.
  .catch(function (err) {
    const items = document.getElementById("items");
    // Affichage d'un message d'erreur
    items.innerHTML = `Une erreur est survenue (${err})`;
  });
