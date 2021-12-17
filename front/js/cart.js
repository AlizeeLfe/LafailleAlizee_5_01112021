//****************************AFFICHAGE DES PROUITS DANS LE PANIER******************
const cartContainer = document.querySelector(".cart-all-items");
const cartPrice = document.querySelector(".cart__price");
const cartOrder = document.querySelector(".cart__order");
const errorMsg = document.querySelector("#cart__items");

// Recuperation des données contenues dans le LS et conversion en format JSON
let cart = JSON.parse(localStorage.getItem("cart"));
// Si le panier est vide, afficher un message, cacher le reste de la page
if (cart === null) {
  errorMsg.innerHTML = `
    <div class="cart__empty">
      <p>Votre panier est vide ! </p>
    </div>`;
  errorMsg.style.textAlign = "center";
  cartPrice.style.display = "none";
  cartOrder.style.display = "none";
} else {
  renderHTML();

  //*************************Gestion du bouton supprimer l'article****************************
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
  //*************************Gestion du bouton changement quantité panier****************************
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
    }
  }
  //*******************Gestions Mise à jour quantité totale et prix total*******************
  function updateTotal() {
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
  updateTotal();
}

//***********************************FORMULAIRE****************************
// Envoi des données au serveur quand on clique sur le bouton commander
const sendForm = function () {
  const btnSendForm = document.querySelector("#order");
  btnSendForm.addEventListener("click", (e) => {
    e.preventDefault();
    // Récuperation des valeurs du formulaire
    const contact = {
      firstName: document.querySelector("#firstName").value,
      lastName: document.querySelector("#lastName").value,
      address: document.querySelector("#address").value,
      city: document.querySelector("#city").value,
      email: document.querySelector("#email").value,
    };
    //Verifications des données
    let form = document.querySelector(".cart__order__form");

    // Controle du Prenom
    function validFirstName() {
      const controlFirstName = contact.firstName;
      if (/^[a-zA-Z-]{2,20}$/.test(controlFirstName)) {
        return true;
      } else {
        let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
        firstNameErrorMsg.innerText =
          "Le prénom ne doit pas contenir de chiffre ou de caractère spécial";
      }
    }

    // Controle du nom
    function validLastName() {
      const controlName = contact.lastName;
      if (/^[a-zA-Z-]{2,20}$/.test(controlName)) {
        return true;
      } else {
        let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
        lastNameErrorMsg.innerText =
          "Le nom ne doit pas contenir de chiffre ou de caractère spécial";
      }
    }
    // Controle de l'adresse
    function validAddress() {
      const controlAddress = contact.address;
      if (
        /^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+/.test(controlAddress)) {
        return true;
      } else {
        let addressErrorMsg = document.getElementById("addressErrorMsg");
        addressErrorMsg.innerText =
          "L'adresse indiquée ne correspond pas au format français";
      }
    }
    // Controle de la ville
    function validCity() {
      const controlCity = contact.city;
      if (/^[a-zA-Z-']{2,20}$/.test(controlCity)) {
        return true;
      } else {
        let cityErrorMsg = document.getElementById("cityErrorMsg");
        cityErrorMsg.innerText =
          "La ville ne doit pas contenir de chiffre ou de caractère spécial";
      }
    }
    // Controle de l'email
    function validEmail() {
      const controlEmail = contact.email;
      if (/^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$/.test(controlEmail)) {
        return true;
      } else {
        let emailErrorMsg = document.getElementById("emailErrorMsg");
        emailErrorMsg.innerText = "Le format de l'adresse mail est incorrect";
      }
    }

    //*******************************************Recuperation données formulaire****************************************
    //Construction d'un array depuis le local storage
    let idProducts = [];
    for (let i = 0; i < cart.length; i++) {
      idProducts.push(cart[i]._id);
    }
    // Mettre l'objet "contact" dans le LS si les values sont présentes dans les champs
    function validForm() {
      if (
        validFirstName(form.firstName) &&
        validLastName(form.lastName) &&
        validAddress(form.address) &&
        validCity(form.city) &&
        validEmail(form.email)
      ) {
        localStorage.setItem("contact", JSON.stringify(contact));
        return true;
        //   form.submit();
      } else {
        alert("Un ou plusieurs champs du formulaire est mal renseigné");
      }
    }
    validForm();
    // Mettre les values du formulaire et mettre les produits sélectionnés dans un objet à envoyer vers le serveur
    const toSend = {
      products: idProducts,
      contact,
    };
    // Evoi de l'objet "toSend" vers le serveur
    const promiseCart = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toSend),
    };

    console.log(promiseCart);

    fetch("http://localhost:3000/api/products/order", promiseCart)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("orderId", data.orderId);
        if (validForm()) {
          document.location.href = "confirmation.html?id=" + data.orderId;
        }
      })
      .catch((err) => console.log("erreur :" + err));
  });
};
sendForm();


function renderHTML() {
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
