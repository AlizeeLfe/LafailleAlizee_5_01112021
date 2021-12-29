//*****************************AFFICHAGE DE LA PAGE PRODUIT*****************************
// Recuperation de la l'URL actuelle de la fenêtre à partir du paramètre (point d'interrogation)
const urlWithId = window.location.search;
// On passe l'URL par le constructeur URLSP pour obtenir une nouvelle instance que l'on pourra facilement manipuler
const urlSearchparams = new URLSearchParams(urlWithId);
// Extraire l'id
const id = urlSearchparams.get("id");

// Récuperer les caractéristiques d'un article selon son ID avec une requête GET qui a en paramètre l'ID du produit
fetch("http://localhost:3000/api/products/" + id)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  // Affichage du produit de façon dynamique
  .then(function (value) {
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

    const pageProduit = document.getElementById("limitedWidthBlock");
    pageProduit.innerHTML = produit;

    // AFFICHER TOUTES LES COULEURS DISPONIBLES POUR UN ARTICLE
    let colors = document.getElementById("colors");
    // On boucle sur toutes les couleurs disponibles ...
    // ... et on va créer un nouvel element "option" qui se rajoute à la suite des autres
    for (let i = 0; i < value.colors.length; i += 1) {
      let colorOption = document.createElement("option");
      colorOption.innerText = value.colors[i];
      colorOption.value = value.colors[i];
      colors.appendChild(colorOption);
    }

    //*************************AJOUT DANS LE PANIER****************
    // Gestion "couleur" et "quantitée" requise pour ajouter au panier
    // Sinon, on affiche un message d'erreur et on met fin à l'exécution de la fonction
    const addToCart = document.querySelector("#addToCart");
    addToCart.addEventListener("click", () => {
      let setColor = document.getElementById("colors");
      let setQuantity = document.getElementById("quantity");
      if (!document.getElementById("colors").value) {
        setColor.classList.add("red_alert");
        return;
      } else if (setQuantity.value <= 0) {
        setQuantity.classList.add("red_alert");
        return;
      } else {
        setColor.classList.remove("red_alert");
        setQuantity.classList.remove("red_alert");
      }

      //Ajout de paire clé/valeur dans le Local Storage
      value["color"] = document.getElementById("colors").value;
      value["qty"] = Number(document.getElementById("quantity").value);

      //********************LOCAL STORAGE************************
      // Si il y a quelque chose dans le local storage :
      // alors on recupère le contenu, on le converti en objet JS et l'ajoute dans "cart" du LS
      let cart = [];
      if (localStorage.getItem("cart") !== null) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // Si l'article ajouté à le même id et la même couleur qu'un article du Local Storage....
      // ....alors on incremente la quantité
      let found = false;
      cart.forEach((product, index) => {
        if (cart[index]._id == id && cart[index].color == value["color"]) {
          cart[index].qty += Number(value["qty"]);
          found = true;
          alert(
            "Vous avez augmenté la quantitée de votre article dans le panier"
          );
        }
      });
      // Si il n'y a rien dans le LS, alors on va créer le produit dans le local storage
      if (!found) {
        cart.push(value);
        alert("Votre article a bien été ajouté au panier");
      }
      // On met à jour "cart" dans le LS et on converti le contenu en format JSON
      localStorage.setItem("cart", JSON.stringify(cart));
    });
  })
  // Si la promesse n'a pas été résolue, elle ne sera pas exécutée, alors on récupère l'erreur et on affiche le message
  .catch(function (err) {
    const pageProduit = document.getElementsByClassName("limitedWidthBlock");
    pageProduit.innerHTML = `Une erreur est survenue (${err})`;
  });
