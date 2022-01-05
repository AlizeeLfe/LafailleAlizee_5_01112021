//**********************************AFFICHAGE DES PROUITS DANS LE PANIER**********************************

// Recuperation des éléments HTML
const cartContainer = document.querySelector(".cart-all-items");
const cartPrice = document.querySelector(".cart__price");
const cartOrder = document.querySelector(".cart__order");
const errorMsg = document.querySelector("#cart__items");

// Recuperation des données du LS, et conversion en format JSON
let cart = JSON.parse(localStorage.getItem("cart"));
// SI LE PANIER EST VIDE: 
if (cart === null) {
  // Afficher un message...
  errorMsg.innerHTML = `
    <div class="cart__empty">
      <p>Votre panier est vide ! </p>
    </div>`;
  // ... et cacher le reste de la page en changeant le style des éléments HTML
  errorMsg.style.textAlign = "center";
  cartPrice.style.display = "none";
  cartOrder.style.display = "none";
} else {
  // DÉBUT DE LA CONDITION: "SI LE PANIER N'EST PAS VIDE" 
  // Afficher les produits qui sont dans le LS (appel de la fonction qui permet d'afficher chaque produit de façon dynamique)
  renderHTML();

  // SUPPRIMER UN PRODUIT DU PANIER
  // Recuperation de tous les éléments HTML de la même classe
  let deleteBtn = document.querySelectorAll(".deleteItem");
  // Pour chaque bouton, on écoute le clic...
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      //...et on retire l'objet qui possède le bouton qui se trouve l'index du produit lié au bouton
      // grace à l'appel de la fonction permettant de "supprimer un produit"
      removeOnCart(btn.dataset.index);
    });
  });
   // FONCTION "supprimer un produit"
  function removeOnCart(index) {
    // On retire 1 élément à partir de l'index (possible grace au data-index du "p" du DOM)
    cart.splice(index, 1);
    // Si le panier est vide, alors on retire la structure panier du LS pour vider le LS
    if (cart.length == 0) {
      localStorage.removeItem("cart");
    } else {
      // Sinon, on met à jour le panier
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    // On rafraichi la page pour supprimer le produit du DOM
    window.location.reload();
  }

  // CHANGER LA QUANTITÉ D'UN PRODUIT
  // Récuperation de tous les éléments HTML de la même classe
  let updateQuantityInput = document.querySelectorAll(".item__quantity");
  // Pour chaque input, on écoute le changement de valeur...
  updateQuantityInput.forEach((input) => {
    input.addEventListener("change", function (e) {
      //...et on appelle la fonction permettant de "changer la quantité d'un produit" au niveau de l'input ciblé 
      updateQuantityOnCart(e.target.dataset.index, e.target.value);
    });
  });


  // FONCTION "changer la quantité d'un produit"
function updateQuantityOnCart(index, value) {
  // Si la quantité renseignée dans l'input est supérieure à 0...
  if (value > 0) {
    //...alors on attribue une nouvelle valeur à la quantité initiale du tableau
    cart[index].qty = Number(value);
    //...on met à jour le LS
    localStorage.setItem("cart", JSON.stringify(cart));
    //...on appelle la fonction permettant de mettre à jour les totaux
    updateTotal();
  }
}

  // FONCTION POUR AFFICHER LA "QUANTITÉ TOTALE" ET "PRIX TOTAL"
  function updateTotal() {
    // Récupération et affichage de la QUANTITÉ totale
    // On boucle sur chaque quantité... 
    let totalItemQty = 0;
    cart.forEach((e) => {
      //...qui sera égale à la somme de toutes las quantités (tant qu'il y en aura dans le cart)
      totalItemQty += e.qty;
    });
    // Recuperation de l'élément HTML
    let totalQty = document.getElementById("totalQuantity");
    // Injection du code HTML dans le DOM
    totalQty.innerHTML = totalItemQty;

    // Récupération et affichage du PRIX total
    // On boucle sur chaque prix, que l'on va multiplier par chaque quantité associée.
    let totalItemPrice = 0;
    cart.forEach((e) => {
      totalItemPrice += e.qty * e.price;
    });
    // Recuperation de l'élément HTML
    let productTotalPrice = document.getElementById("totalPrice");
    // Injection du code HTML dans le DOM
    productTotalPrice.innerHTML = totalItemPrice;
  }
  // APPEL DE LA FONCTION QUANTITÉ PRIX TOTAL
  updateTotal();
}// FIN DE LA CONDITION: "SI LE PANIER N'EST PAS VIDE"


// FONCTION PERMETTANT DE SOUMETTRE LE FORMULAIRE
const sendForm = function () {
  // Recuperation de l'élément HTML
  const form = document.querySelector("form");
  // Ecoute de l'évènement "soumettre un formulaire" ("commander")
  form.addEventListener("submit", (e) => {
    // Stopper le comportement par défaut du bouton pour eviter le rechargement de la page (et perdre les infos)
    e.preventDefault();
    // Si les toutes informations du formulaire sont conformes aux RegEx...
    // (si la fonction "validform" à renvoyé "true")
    if (validForm()) {
      //... alors on récupère ces informations dans un objet "contact" (requested by controllers)
      const contact = {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,
        email: document.querySelector("#email").value,
      };
      //... construction d'un tableau depuis le local storage 
      let idProducts = [];
      for (let i = 0; i < cart.length; i++) {
        // et ajout de l'id de chaque produit (requested by controllers)
        idProducts.push(cart[i]._id);
      }
      //... on met les valeurs du formulaire + les produits sélectionnés dans un objet à envoyer vers le serveur
      // Il doit contenir un tableau qui contient les product + un objet qui contient les contact
      const toSend = {
        products: idProducts,
        contact,
      };
      //... on envoi l'objet "toSend" avec une requête de type "POST" pour envoyer des données VERS le serveur
      const promiseCart = {
        method: "POST",
        // Prevenir le service web qu'il va recevoir du JSON
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        // Transformer l'objet JavaScript en JSON
        body: JSON.stringify(toSend),
      };

      //... on récupère les données de L'API avec en paramètre de requête : un objet init
      fetch("http://localhost:3000/api/products/order", promiseCart)
        .then((response) => response.json())
        // on renvoi les données traitées en JSON
        .then((data) => {
          // On vide le LS pour pas que les produits s'affichent encore dans le panier après avoir passer commande
          localStorage.clear();
          // On renvoi le client à la page de confirmation
          document.location.href = "confirmation.html?orderId=" + data.orderId;
        })
        // Si la promesse n'a pas été résolue, elle ne sera pas exécutée
        // On affiche l'erreur dans la console
        .catch((err) => console.log("erreur :" + err));
    }
  });
};// FIN DE LA FONCTION PERMETTANT DE SOUMETTRE LE FORMULAIRE
// APPEL DE LA FONCTION SOUMETTRE LE FORMULAIRE
sendForm();

// FONCTION POUR VALIDER LE FORMULAIRE
function validForm() {
  // Recuperation des l'éléments HTML dans une constante
  const input = {
    firstName: document.querySelector("#firstName"),
    lastName: document.querySelector("#lastName"),
    address: document.querySelector("#address"),
    city: document.querySelector("#city"),
    email: document.querySelector("#email"),
  };
  if (
    // Si TOUTES les valeurs de chaque input sont confromes aux RegEx...
    checkRegex(
      input.firstName,
      "^[a-zA-Z-]{2,20}$",
      "Le prénom ne doit pas contenir de chiffre ou de caractère spécial"
    ) &&
    checkRegex(
      input.lastName,
      "^[a-zA-Z-]{2,20}$",
      "Le nom ne doit pas contenir de chiffre ou de caractère spécial"
    ) &&
    checkRegex(
      input.address,
      "^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+",
      "Le format de l'adresse est incorrect"
    ) &&
    checkRegex(
      input.city,
      "^[a-zA-Z-']{2,20}$",
      "La ville ne doit pas contenir de chiffre ou de caractère spécial"
    ) &&
    checkRegex(
      input.email,
      "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
      "Le format de l'adresse mail est incorrect"
    )
  ) {
    //...alors on renvoie "true"
    return true;
  } else {
    //...sinon on renvoie "false"
    return false;
  }
}// FIN DE LA FONCTION PERMETTANT DE VÉRIFIER LA CONFORMITÉ DES VALEURS DU FORMULAIRE


// FONCTION POUR TESTER LES REGEX
function checkRegex(element, regex, message) {
  // Opérateur "new" pour créer un nouvel objet qui teste la valeur de l'input avec la méthode "RegExp.test()"
  // Si la valeur testée coresspond à la RegExp, elle retourne "true"
  if (new RegExp(regex).test(element.value)) {
    return true;
  } else {
    // Si valeur de l'input est non conforme à la RegExp : 
    // on récupère l'input suivant, et on affiche le message d'erreur. On retoune false
    element.nextElementSibling.innerText = message;
    return false;
  }
}

// FONCTION QUI PERMET D'AFFICHER CHAQUE PRODUIT DANS LE PANIER
function renderHTML() {
  let html = "";
  cart.forEach((product, index) => {
    html += `     <article class="cart__item" data-id="${product._id}">
                    <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    </div>
                    <div class="cart__item__content">
                    <div class="cart__item__content__titlePrice">
                        <h2>${product.name}</h2>
                        <p> Couleur : ${product.color}</p>
                        <p class:"item_price">Prix : ${
                          product.price
                        } € </p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" data-index=${index} class="item__quantity" name="itemQuantity" min="1" max="100" value="${
      product.qty
    }">
                        </div>
                        <div class="cart__item__content__settings__delete">
                        <p class="deleteItem" data-index=${index}>Supprimer</p>
                        </div>
                    </div>
                    </div>
                </article>
            `;
  });
  // Injection du code HTML dans le DOM
  cartContainer.innerHTML = html;
}// FIN DE LA FONCTION QUI PERMET D'AFFICHER CHAQUE PRODUIT DANS LE PANIER
