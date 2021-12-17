// Recuperation de la chaine de requête dans l'URL
const urlWithId = window.location.search;
// Extraire l'ID
const urlSearchparams = new URLSearchParams(urlWithId);
const id = urlSearchparams.get("id");

// Ajout de l'article selon un ID
fetch("http://localhost:3000/api/products/" + id)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
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

    // Proposition de couleurs selon l'article
    let colors = document.getElementById("colors");
    for (let i = 0; i < value.colors.length; i += 1) {
      let colorOption = document.createElement("option");
      colorOption.innerText = value.colors[i];
      colorOption.value = value.colors[i];
      colors.appendChild(colorOption);
    }

    //*************************AJOUT DANS LE PANIER****************
    // Condition ajout dans panier seulement si on selectionne une couleur
    // Condition ajout dans le panier si on modifie pas l'input par un negatif ou rien ****VOIR AVEC WY
    const addToCart = document.querySelector("#addToCart");
    let setQuantity = document.getElementById("quantity");
    addToCart.addEventListener("click", () => {
      let redContour = document.getElementById("colors");
      if (!document.getElementById("colors").value) {
        redContour.classList.add("red_alert");
        return;
      }else if(setQuantity.value <= 0){
        setQuantity.classList.add("red_alert");
        return;
      } else {
        redContour.classList.remove("red_alert");
        setQuantity.classList.remove("red_alert");
      }
      value["color"] = document.getElementById("colors").value; //VOIR AVEC WY
      value["qty"] = Number(document.getElementById("quantity").value); //VOIR AVEC WY

      //********************LOCAL STORAGE************************
      // Si il y a quelque chose dans le local storage, alors on ajoute le contenu dans un tableau, et on renvoie l'info dans le LS en format Json
      let cart = [];
      if (localStorage.getItem("cart") !== null) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // Si l'article ajouté à le même id et la même couleur, alors on incremente la quantitée
      let found = false;
      cart.forEach((product, index) => {
        if (
          cart[index]._id == id &&
          cart[index].color == document.getElementById("colors").value
        ) {
          cart[index].qty += Number(value["qty"]);
          found = true;
        }
      });
      // Sinon, on va créer le produit dans le local storage
      if (!found) {
        cart.push(value);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
    });
  })

  .catch(function (err) {
    const pageProduit = document.getElementsByClassName("limitedWidthBlock");
    pageProduit.innerHTML = `Une erreur est survenue (${err})`;
  });
