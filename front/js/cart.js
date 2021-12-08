//****************************AFFICHAGE DES PROUITS DANS LE PANIER******************
const cartContainer = document.querySelector(".cart-all-items");
const cartPrice = document.querySelector(".cart__price");
const cartOrder = document.querySelector(".cart__order");
const errorMsg = document.querySelector("#cart__items");

// Recuperation des données contenues dans le LS et conversion en format JSON
let cart = JSON.parse(localStorage.getItem("cart"));
// Si le panier est vide, afficher un message, cacher le reste de la page
if (cart === null || cart == 0) {
  errorMsg.innerHTML = `
    <div class="cart__empty">
      <p>Votre panier est vide ! </p>
    </div>`;
  errorMsg.style.textAlign = "center";
  cartPrice.style.display = "none";
  cartOrder.style.display = "none";
} else {
  let html = "";
  //Si le panier n'est pas vide, il faut afficher les produits qui sont dans le local storage
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
                        <input type="number" class="item__quantity" name="itemQuantity" min="1" max="100" value="${
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

  //*************************Gestion du bouton supprimer l'article****************************
  let deleteBtn = document.querySelectorAll(".deleteItem");
  deleteBtn.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      removeOnCart(btn.dataset.index);
    });
    function removeOnCart(index) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.href = "cart.html";
    }
  });

  //*******************Gestions Mise à jour quantité totale et prix total*******************
  // Récupération de la quantitée totales
  let totalItemQty = 0;
  cart.forEach((e) => {
    totalItemQty += e.qty;
  });
  let totalQty = document.getElementById("totalQuantity");
  totalQty.innerHTML = totalItemQty;

  // Récupération du prix total
  let totalItemPrice = 0;
  cart.forEach((e) => {
    totalItemPrice += e.qty * e.price;
  });
  let productTotalPrice = document.getElementById("totalPrice");
  productTotalPrice.innerHTML = totalItemPrice;
}

//***********************************FORMULAIRE****************************
//Verifications des données
let form = document.querySelector(".cart__order__form");
// Ecouter la modification du prenom
form.firstName.addEventListener("change", function () {
  validFisrtName(this);
});
// Ecouter la modification du nom
form.lastName.addEventListener("change", function () {
  validLastName(this);
});
// Ecouter la modification de l'adresse
form.address.addEventListener("change", function () {
  validAddress(this);
});
// Ecouter la modification de la ville
form.city.addEventListener("change", function () {
  validCity(this);
});
// Ecouter la modification de l'email
form.email.addEventListener("change", function () {
  validEmail(this);
});

// Contrôle validité du Prenom //
const validFisrtName = function (inputFisrtName) {
  // Creation regexp pour la validation du prenom
  let fisrtNameRegexp = new RegExp("^[a-zA-Z-]{2,20}$", "g");
  // Test de l'expression régulière
  let testFirstName = fisrtNameRegexp.test(inputFisrtName.value);
  // Recuperation de la balise <p>
  let validMessageFirstName = inputFisrtName.nextElementSibling;
  // Message erreur ou ok
  if (testFirstName) {
    validMessageFirstName.innerHTML = "Prenom valide";
    validMessageFirstName.classList.remove("text-danger");
    validMessageFirstName.classList.add("text-success");
    return true;
  } else {
    validMessageFirstName.innerHTML = "Prenom non valide";
    validMessageFirstName.classList.remove("text-success");
    validMessageFirstName.classList.add("text-danger");
    return false;
  }
};
// Contrôle validité du Nom //
const validLastName = function (inputLastName) {
  // Creation regexp pour la validation du nom
  let lastNameRegexp = new RegExp("^[a-zA-Z-']{2,20}$", "g");
  // Test de l'expression régulière
  let testLastName = lastNameRegexp.test(inputLastName.value);
  // Recuperation de la balise <p>
  let validMessageLastName = inputLastName.nextElementSibling;
  // Message erreur ou ok
  if (testLastName) {
    validMessageLastName.innerHTML = "Nom valide";
    validMessageLastName.classList.remove("text-danger");
    validMessageLastName.classList.add("text-success");
    return true;
  } else {
    validMessageLastName.innerHTML = "Nom invalide";
    validMessageLastName.classList.remove("text-success");
    validMessageLastName.classList.add("text-danger");
    return false;
  }
};
// Contrôle validité de l'adresse //
const validAddress = function (inputAddress) {
  // Creation regexp pour la validation du nom
  let addressRegexp = new RegExp(
    "^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+"
  );
  // Test de l'expression régulière
  let testAddress = addressRegexp.test(inputAddress.value);
  // Recuperation de la balise <p>
  let validMessageAddress = inputAddress.nextElementSibling;
  // Message erreur ou ok
  if (testAddress) {
    validMessageAddress.innerHTML = "Adresse valide";
    validMessageAddress.classList.remove("text-danger");
    validMessageAddress.classList.add("text-success");
    return true;
  } else {
    validMessageAddress.innerHTML = "Adresse invalide";
    validMessageAddress.classList.remove("text-success");
    validMessageAddress.classList.add("text-danger");
    return false;
  }
};
// Contrôle validité de la ville //
const validCity = function (inputCity) {
  // Creation regexp pour la validation du nom
  let cityRegexp = new RegExp("^[a-zA-Z-']{2,20}$", "g");
  // Test de l'expression régulière
  let testCity = cityRegexp.test(inputCity.value);
  // Recuperation de la balise <p>
  let validMessageCity = inputCity.nextElementSibling;
  // Message erreur ou ok
  if (testCity) {
    validMessageCity.innerHTML = "ville valide";
    validMessageCity.classList.remove("text-danger");
    validMessageCity.classList.add("text-success");
    return true;
  } else {
    validMessageCity.innerHTML = "ville non valide";
    validMessageCity.classList.remove("text-success");
    validMessageCity.classList.add("text-danger");
    return false;
  }
};
//Contrôle validité de l'email
const validEmail = function (inputEmail) {
  // Creation regexp pour la validation de l'email
  let emailRegexp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
    "g"
  );
  // Test de l'expression régulière
  let testEmail = emailRegexp.test(inputEmail.value);
  // Recuperation de la balise <p> du message d'erreur
  let validMessage = inputEmail.nextElementSibling;
  // Message erreur ou ok
  if (testEmail) {
    validMessage.innerHTML = "Adresse mail valide";
    validMessage.classList.remove("text-danger");
    validMessage.classList.add("text-success");
    return true;
  } else {
    validMessage.innerHTML = "Adresse mail non valide";
    validMessage.classList.remove("text-success");
    validMessage.classList.add("text-danger");
    return false;
  }
};

// Recuperer les données quand on clique sur le bouton commander
const btnSendForm = document.querySelector("#order");
btnSendForm.addEventListener("click", (e) => {
  e.preventDefault();
  // Récuperation des valeurs du formulaire
  const formValues = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };
  // Mettre l'objet "formValues" dans le LS si les values sont présentes dans les champs
  if (
    validFisrtName(form.firstName) &&
    validLastName(form.lastName) &&
    validAddress(form.address) &&
    validCity(form.city) &&
    validEmail(form.email)
  ) {
    localStorage.setItem("formValues", JSON.stringify(formValues));
    form.submit();
  } else {
    alert("Veuillez remplir tous les champs du formulaire");
  }
  // Mettre les values du formulaire et mettre les produits sélectionnés dans un objet à envoyer vers le serveur
  const toSend = {
    cart,
    formValues,
  };
  // Evoi de l'objet "toSend" vers le serveur
  const promiseCart = {
    method: "POST",
    body: JSON.stringify(toSend),
    headers: { "Content-Type": "application/json" },
  };

  fetch("http://localhost:3000/api/products/order", promiseCart)
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("orderId", data.orderId);
      if (formValues()) {
        document.location.href = "confirmation.html?id=" + data.orderId;
      }
    });
});
