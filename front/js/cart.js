//**********************************AFFICHAGE DES PROUITS DANS LE PANIER**********************************

// Recuperation des emplacements de texte à afficher
const cartContainer = document.querySelector(".cart-all-items");
const cartPrice = document.querySelector(".cart__price");
const cartOrder = document.querySelector(".cart__order");
const errorMsg = document.querySelector("#cart__items");

// Recuperation des données du LS, et conversion en format JSON
let cart = JSON.parse(localStorage.getItem("cart"));
// Si le panier est vide : afficher un message, et cacher le reste de la page
if (cart === null) {
  errorMsg.innerHTML = `
    <div class="cart__empty">
      <p>Votre panier est vide ! </p>
    </div>`;
  errorMsg.style.textAlign = "center";
  cartPrice.style.display = "none";
  cartOrder.style.display = "none";
  //Si le panier n'est pas vide : Afficher les articles qui sont dans le LS...
} else {
  //...en faisant appel à la fonction qui permet d'afficher chaque article de façon dynamique
  renderHTML();

  // SUPPRIMER UN ARTICLE
  let deleteBtn = document.querySelectorAll(".deleteItem");
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      removeOnCart(btn.dataset.index);
    });
  });
  function removeOnCart(index) {
    cart.splice(index, 1);
    if (cart.length == 0) {
      localStorage.removeItem("cart");
    } else {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    window.location.reload();
  }
  // CHANGER LA QUANTITÉ D'UN ARTICLE
  let updateQuantityInput = document.querySelectorAll(".item__quantity");
  updateQuantityInput.forEach((input) => {
    input.addEventListener("change", function (e) {
      updateQuantityOnCart(e.target.dataset.index, e.target.value);
    });
  });
  function updateQuantityOnCart(index, value) {
    if (value > 0) {
      cart[index].qty = Number(value);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateTotal();
      window.location.reload();
    }
  }

  // AFFICHER LA "QUANTITÉ TOTALE" ET "PRIX TOTAL" À JOUR
  function updateTotal() {
    // Récupération et affichage de la quantité totale
    let totalItemQty = 0;
    cart.forEach((e) => {
      totalItemQty += e.qty;
    });
    let totalQty = document.getElementById("totalQuantity");
    totalQty.innerHTML = totalItemQty;

    // Récupération et affichage du prix total
    let totalItemPrice = 0;
    cart.forEach((e) => {
      totalItemPrice += e.qty * e.price;
    });
    let productTotalPrice = document.getElementById("totalPrice");
    productTotalPrice.innerHTML = totalItemPrice;
  }
  updateTotal();
}

//**********************************FORMULAIRE**********************************
// (on envoie "contact" et "products" (du LS) au serveur si les données sont ok)

// SOUMETTRE LE FORMULAIRE (lorsqu'on clique sur le bouton "commander")
const sendForm = function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    // Stopper le comportement par défaut du bouton pour eviter le rechargement de la page (et perdre les infos)
    e.preventDefault();
    // SI LES INFORMATIONS DU FORMULAIRE SONT CONFORMES ...
    if (validForm()) {
      //... alors on récupère ces informations dans un objet "contact" (requested by controllers)
      const contact = {
        firstName: document.querySelector("#firstName").value,
        lastName: document.querySelector("#lastName").value,
        address: document.querySelector("#address").value,
        city: document.querySelector("#city").value,
        email: document.querySelector("#email").value,
      };
      //... construction d'un tableau depuis le local storage et y ajouter les ID des articles (requested by controllers)
      let idProducts = [];
      for (let i = 0; i < cart.length; i++) {
        idProducts.push(cart[i]._id);
      }
      //... on met les valeurs du formulaire et les articles sélectionnés dans un objet à envoyer vers le serveur
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
        // on renvoi les données traitées par JSON
        .then((data) => {
          // On vide le LS pour pas que les articles s'affichent encore dans le panier après avoir passer commande
          localStorage.clear();
          // On va créer un élément dans le LS avec comme valeur le numéro de commande retourné par l'API
          localStorage.setItem("orderId", data.orderId);
          // On renvoi le client à la page de confirmation
          document.location.href = "confirmation.html?id=" + data.orderId;
        })
        .catch((err) => console.log("erreur :" + err));
    }
  });
};
sendForm();

// VÉRIFIER LA CONFORMITÉ DE LA TOTALITÉE DES VALEURS ENTRÉES DANS LE FORMULAIRE
function validForm() {
  const input = {
    firstName: document.querySelector("#firstName"),
    lastName: document.querySelector("#lastName"),
    address: document.querySelector("#address"),
    city: document.querySelector("#city"),
    email: document.querySelector("#email"),
  };
  if (
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
      "L'adresse comporte un caractère non autorisé"
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
    return true;
  } else {
    return false;
  }
}
// FONCTION POUR VÉRIFIER QUE LA VALEUR D'UN INPUT EST CONFORME A CE QUI EST DEMANDÉ GRACE AUX TEST REGEX
function checkRegex(element, regex, message) {
  // Opérateur "new" pour créer un nouvel objet qui teste la valeur de l'input avec la méthode "RegExp.test()"
  // Si ok elle retourne true
  if (new RegExp(regex).test(element.value)) {
    return true;
  } else {
    // Si valeur de l'input non conforme : on affiche le message d'erreur, on retoune false
    element.nextElementSibling.innerText = message;
    return false;
  }
}

// FONCTION QUI PERMET D'AFFICHER CHAQUE ARTICLE DANS LE PANIER
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
                          product.price * product.qty
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
  cartContainer.innerHTML = html;
}
