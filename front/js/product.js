//*************************************AFFICHAGE DE LA PAGE PRODUIT*********************************

// Recuperation des paramètres "get" dans l'URL 
const urlWithId = window.location.search;
// Découpage des différents paramètres de l'URL
const urlSearchparams = new URLSearchParams(urlWithId);
// Extraire l'id
const id = urlSearchparams.get("id");

// Récuperer les caractéristiques d'un produit selon son ID, avec une requête GET qui a en paramètre l'ID du produit
fetch("http://localhost:3000/api/products/" + id)
// Première promesse :
  .then(function (res) {
    if (res.ok) {
       // Elle retourne une réponse qu'on va convertir en JSON
      return res.json();
    }
  })
  // Deuxième promesse: 
  .then(function (value) {
    // Concaténation des éléments HTML pour afficher le produit de façon dynamique
    // Modification du contenu de chaque variable avec les bonnes données
    let produit = "";
    produit += `
      <div class="limitedWidthBlock">
        <section class="item">
          <article>
            <div class="item__img">
              <img class="img" src="${value.imageUrl}" alt="${value.altTxt}">
            </div>
            <div class="item__content">

              <div class="item__content__titlePrice">
                <h1 id="title">${value.name}</h1>
                <p>Prix : <span id="price">${value.price}</span>€</p>
              </div>

              <div class="item__content__description">
                <p class="item__content__description__title">Description :</p>
                <p id="description">${value.description}</p>
              </div>

              <div class="item__content__settings">
                <div class="item__content__settings__color">
                  <label for="color-select">Choisir une couleur :</label>
                  <select name="color-select" id="colors">
                  <option class="button_visibility" value="">--SVP, choisissez une couleur --</option> 
                  </select>
                </div>

                <div class="item__content__settings__quantity">
                  <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
                  <input type="number" name="itemQuantity" min="1" max="100" value="1" id="quantity">
                </div>
              </div>

              <div class="item__content__addButton">
                <button id="addToCart">Ajouter au panier</button>
              </div>

            </div>
          </article>
        </section>
      </div>`;
    // Récupération de l'élément HTML
    const pageProduit = document.getElementById("limitedWidthBlock");
    // Injection du code HTML dans le DOM
    pageProduit.innerHTML = produit;

    // AFFICHER TOUTES LES COULEURS DISPONIBLES POUR UN PRODUIT.
    // Recuperer l'élément HTML
    let colors = document.getElementById("colors");
    // On boucle sur toutes les couleurs disponibles ...
    // ... et on va créer un nouvel element "option" qui se rajoute à la suite des autres
    for (let i = 0; i < value.colors.length; i += 1) {
      let colorOption = document.createElement("option");
      // Injection de texte dans le DOM 
      colorOption.innerText = value.colors[i];
      // Le texte correspond à la valeur de chaque objet sur lequel la boucle passe dans le tableau de couleurs
      colorOption.value = value.colors[i];
      // Une option sera créée tant qu'il y aura des couleurs dans le tableau
      colors.appendChild(colorOption);
    }

    // GESTION DES OPTIONS OBLIGATOIRES POUR L'AJOUT AU PANIER ("couleur" et "quantitée" )
    // Récupération de l'élément HTML
    const addToCart = document.querySelector("#addToCart");
    // DÉBUT DE L'ÉCOUTEUR D'ÉVENEMENT SUR LE BOUTON "ajouter au panier"
    addToCart.addEventListener("click", () => {
      // Déclaration des variables permettant de récupérer les éléments HTML
      let setColor = document.getElementById("colors");
      let setQuantity = document.getElementById("quantity");
      // AJOUT DE CONDITIONS
      // Si on ne récupère pas de valeurs au niveau de l'élément "select" (pas de couleur choisie)....
      if (!setColor.value) {
        //...on ajoute la classe permettant d'ajouter le liseret rouge autour de l'option couleur
        setColor.classList.add("red_alert");
        //...on met fin à l'exécution de la fonction
        return;
        // Si la quantité ajoutée est inférieure ou égale à 0 ...
      } else if (setQuantity.value <= 0) {
        //...on ajoute la classe permettant d'ajouter le liseret rouge autour de l'option quantitée
        setQuantity.classList.add("red_alert");
        //...on met fin à l'exécution de la fonction
        return;
      } else {
        // Sinon, (si tout est renseigné), on enlève la classe du liseret rouge
        setColor.classList.remove("red_alert");
        setQuantity.classList.remove("red_alert");
      }

      // AJOUT DE LA COULEUR ET DE LA QUANTITÉ AU SEIN DU PRODUIT
      value["color"] = document.getElementById("colors").value;
      value["qty"] = Number(document.getElementById("quantity").value);

      //GESTION DU LOCAL STORAGE
      //On défini un panier vide
      let cart = [];
      // Si le panier existe en LS, alors on l'assigne à la variable cart
      if (localStorage.getItem("cart") !== null) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // Si le produit ajouté à le même id ET la même couleur qu'un produit du Local Storage....
      let found = false;
      cart.forEach((product, index) => {
        if (cart[index]._id == id && cart[index].color == value["color"]) {
          // ....alors on incremente la quantité dans le LS
          cart[index].qty += Number(value["qty"]);
          found = true;
          alert(
            "Vous avez augmenté la quantité de votre article dans le panier"
          );
        }
      });
      // Si le produit demandé n'existe pas dans le panier...
      if (!found) {
        //...alors on va ajouter le produit dans le local storage
        cart.push(value);
        alert("Votre article a bien été ajouté au panier");
      }
      // On met à jour "cart" dans le LS et on converti le contenu en format JSON
      localStorage.setItem("cart", JSON.stringify(cart));
    }); // FIN DE L'ÉCOUTEUR D'ÉVENEMENT SUR LE BOUTON "ajouter au panier"
  })
  // Si la promesse n'a pas été résolue, elle ne sera pas exécutée
  .catch(function (err) {
    // On récupère l'élément HTML...
    const pageProduit = document.getElementsByClassName("limitedWidthBlock");
    //...on affiche le message avec l'erreur récupérée
    pageProduit.innerHTML = `Une erreur est survenue (${err})`;
  });
