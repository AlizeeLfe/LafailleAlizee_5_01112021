// Recuperation de la chaine de requête dans l'URL
const urlWithId = window.location.search;
// Extraire l'ID
const urlSearchparams = new URLSearchParams(urlWithId);
const id = urlSearchparams.get("id");

let title = "";
let imgSrc = "";
let price = "";

// Ajout de l'article selon un ID
fetch("http://localhost:3000/api/products/" + id)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (value) {
    imgSrc = value.imageUrl;
    title = value.name;
    price = value.price;
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

    // Ajout dans panier
    const addToCart = document.querySelector("#addToCart");
    addToCart.addEventListener("click", () => {
      let redContour = document.getElementById("colors");
      if (!document.getElementById("colors").value) {
        redContour.classList.add("red_alert");
        // addToCart.style.display= "none";
        return;
      } else {
        redContour.classList.remove("red_alert");
        // addToCart.style.display= "block"
        // alert("c'est ajouté !")
      }

      let addProduct = {
        color: document.getElementById("colors").value,
        _id: id,
        qty: 1,
        name: title,
        price: price,
        imageUrl: imgSrc,
        // name: document.getElementById('title').innerText,
        // price: document.getElementById("price").innerText,
        // imageUrl: document.getElementsByClassName("img")[0].src
        // OU APPEL API A VOIR
      };

      // Local storage
      // Si il y a quelque chose dans le local storage, alors on ajoute le contenu dans un tableau, et on renvoie l'info dans le LS en format Json
      let basketItems = [];
      if (localStorage.getItem("products") !== null) {
        basketItems = JSON.parse(localStorage.getItem("products"));
      }

      // Si l'article ajouté à le même id et la même couleur, alors on incremente la quantitée
      let found = false;
      for (j = 0; j < basketItems.length; j++) {
        if (
          basketItems[j]._id == id &&
          basketItems[j].color == document.getElementById("colors").value
        ) {
          basketItems[j].qty++;
          found = true;
        }
      }
      if (!found) {
        // Sinon, on va créer le produit dans le local storage
        basketItems.push(addProduct);
      }
      localStorage.setItem("products", JSON.stringify(basketItems));
    });
  })

  .catch(function (err) {
    const pageProduit = document.getElementsByClassName("limitedWidthBlock");
    pageProduit.innerHTML = `Une erreur est survenue (${err})`;
  });
