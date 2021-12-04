//-------------------AFFICHAGE DES PROUITS DANS LE PANIER---------------------
const cartContainer = document.getElementById("cart__items");
const cartPrice = document.querySelector(".cart__price");
const cartOrder = document.querySelector(".cart__order");
// Recuperation des données contenues dans le LS et conversion en format JSON
let localStorageProducts = JSON.parse(localStorage.getItem("products"));


    // Si le panier est vide, afficher un message, cacher le reste de la page
if ( localStorageProducts === null){
    const emptyCart = `
    <div class="container-panier-vide">
    <div> Votre panier est vide </div>
    </div>
    `;
    cartContainer.innerHTML = emptyCart;
    cartContainer.style.textAlign = "center";
    cartPrice.style.display = "none";
    cartOrder.style.display = "none";

    } else {
        let structureProduitPanier = [];
        //Si le panier n'est pas vide, il faut afficher les produits qui sont dans le local storage
        for(j = 0; j < localStorageProducts.length; j++ ){
            structureProduitPanier = structureProduitPanier + `
            <article class="cart__item" data-id="{product-ID}">
                    <div class="cart__item__img">
                    <img src="${localStorageProducts[j].imageUrl}" alt="${localStorageProducts[j].altTxt}">
                    </div>
                    <div class="cart__item__content">
                    <div class="cart__item__content__titlePrice">
                        <h2>${localStorageProducts[j].name}</h2>
                        <p> Couleur : ${localStorageProducts[j].color}</p>
                        <p class:"item_price">Prix : ${localStorageProducts[j].price} </p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                        <p>Qté : </p>
                        <input type="number" class="item__quantity" name="itemQuantity" min="1" max="100" value="${localStorageProducts[j].qty}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                    </div>
                </article>
            `;
            }
        if(j === localStorageProducts.length) {
            cartContainer.innerHTML = structureProduitPanier;
        }
        }



    // Gestion du bouton supprimer l'article
    // NE SUPPRIME PAS LS //
    let deleteArticle = document.getElementsByClassName("cart__item__content__settings__delete");
    // Selection de l'article qui va être supprimé en cliquant sur "supprimer"
    for (let k = 0; k < deleteArticle.length; k++) {
        let supButton = deleteArticle[k]
        supButton.addEventListener('click', function(event){
        event.preventDefault();
        let buttonClicked = event.target
        buttonClicked.parentElement.parentElement.parentElement.parentElement.remove()
        updateCartTotal();
        //Alerte et refresh de la page
        // alert("Ce produit a bien été supprimé du panier");
        // location.reload();
        })
    }

    // Gestions du nombre d'articles avec mise à jour du prix total
    // NON FONCTIONNEL //
    function updateCartTotal() {
        let cartItemContainer = document.getElementsByClassName('cart-all-items')[0]
        let cartRows = cartItemContainer.getElementsByClassName('cart__item')
        const total = 0
        for (let m = 0; m < cartRows.length; m++) {
            let cartRow = cartRows[m]
            let priceElement = cartRow.getElementsByClassName('item_price')[0];
            let quantityElement = cartRow.getElementsByClassName('item__quantity')[0];
            let price = parseFloat(priceElement.innerText.replace('€', ''))
            let quantity = quantityElement.value
            total = total + (price * quantity)
        }

        document.getElementById('totalPrice').innerText = total

    }


//******************Montant total panier**************
// Déclaration variable pour pouvoir y mettre les prix présents dans le panier
let totalPriceCalculate = [];
for (let n = 0; n < localStorageProducts.length; n++){
    let cartProductsPrice = localStorageProducts[n].price;
    //Mettre les prix du panier dans la variable totalPriceCalculate
    totalPriceCalculate.push(cartProductsPrice)   
}
// Additionner les prix qu'il y a dans le tableau de la variable totalPriceCalculate avec la méthode reduce
const reducer = (accumulator, currentValue) => accumulator + currentValue;
const totalCartPrice = totalPriceCalculate.reduce(reducer,0);

// Integration du prix total à afficher
 let totalPriceContainer = document.getElementById('totalPrice');
 totalPriceContainer.innerText = totalCartPrice

//******************Affichage quantitée totale d'articles dans le panier**************
// A FAIRE AVEC TOTAL PANIER ?? //







//------------------------------FORMULAIRE---------------------------------------------------
//****************Verifications des données***************//
let form = document.querySelector('.cart__order__form');
// Ecouter la modification du prenom
form.firstName.addEventListener('change', function () {
    validFisrtName(this)
});
// Ecouter la modification du nom
form.lastName.addEventListener('change', function () {
    validLastName(this)
});
// Ecouter la modification de l'adresse 
form.address.addEventListener('change', function () {
    validAddress(this)
});
// Ecouter la modification de la ville
form.city.addEventListener('change', function () {
    validCity(this)
});
// Ecouter la modification de l'email
form.email.addEventListener('change', function () {
    validEmail(this)
});


// Contrôle validité du Prenom //
const validFisrtName=function(inputFisrtName) {
    // Creation regexp pour la validation du prenom
        let fisrtNameRegexp = new RegExp(
            "^[a-zA-Z-]{2,20}$", "g"
            );
// Test de l'expression régulière        
    let testFirstName = fisrtNameRegexp.test(inputFisrtName.value);
// Recuperation de la balise <p>
let validMessageFirstName = inputFisrtName.nextElementSibling;
// Message erreur ou ok
    if (testFirstName) {
        validMessageFirstName.innerHTML = "Prenom valide";
        validMessageFirstName.classList.remove('text-danger');
        validMessageFirstName.classList.add('text-success'); 
        return true;
    }else {
        validMessageFirstName.innerHTML = "Prenom non valide";
        validMessageFirstName.classList.remove('text-success');
        validMessageFirstName.classList.add('text-danger');
        return false;
    }
};
// Contrôle validité du Nom //
const validLastName=function(inputLastName) {
    // Creation regexp pour la validation du nom
        let lastNameRegexp = new RegExp(
            "^[a-zA-Z-']{2,20}$", "g"
            );
// Test de l'expression régulière        
    let testLastName = lastNameRegexp.test(inputLastName.value);
// Recuperation de la balise <p>
let validMessageLastName = inputLastName.nextElementSibling;
// Message erreur ou ok
    if (testLastName) {
        validMessageLastName.innerHTML = "Nom valide";
        validMessageLastName.classList.remove('text-danger');
        validMessageLastName.classList.add('text-success'); 
        return true;
    }else {
        validMessageLastName.innerHTML = "Nom invalide";
        validMessageLastName.classList.remove('text-success');
        validMessageLastName.classList.add('text-danger');
        return false;
    }
};
// Contrôle validité de l'adresse //
const validAddress=function(inputAddress) {
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
        validMessageAddress.classList.remove('text-danger');
        validMessageAddress.classList.add('text-success'); 
        return true;
    }else {
        validMessageAddress.innerHTML = "Adresse invalide";
        validMessageAddress.classList.remove('text-success');
        validMessageAddress.classList.add('text-danger');
        return false;
    }
};
// Contrôle validité de la ville //
const validCity=function(inputCity) {
    // Creation regexp pour la validation du nom
        let cityRegexp = new RegExp(
            "^[a-zA-Z-']{2,20}$", "g"
            );
// Test de l'expression régulière        
    let testCity = cityRegexp.test(inputCity.value);
// Recuperation de la balise <p>
let validMessageCity = inputCity.nextElementSibling;
// Message erreur ou ok
    if (testCity) {
        validMessageCity.innerHTML = "ville valide";
        validMessageCity.classList.remove('text-danger');
        validMessageCity.classList.add('text-success'); 
        return true;
    }else {
        validMessageCity.innerHTML = "ville non valide";
        validMessageCity.classList.remove('text-success');
        validMessageCity.classList.add('text-danger');
        return false;
    }
};
//Contrôle validité de l'email
const validEmail=function(inputEmail) {
// Creation regexp pour la validation de l'email
    let emailRegexp = new RegExp(
        '^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g'
        );
// Test de l'expression régulière        
    let testEmail = emailRegexp.test(inputEmail.value);
// Recuperation de la balise <p> du message d'erreur
    let validMessage = inputEmail.nextElementSibling;
// Message erreur ou ok
    if (testEmail) {
        validMessage.innerHTML = "Adresse mail valide";
        validMessage.classList.remove('text-danger');
        validMessage.classList.add('text-success');
        return true;
    }else {
        validMessage.innerHTML = "Adresse mail non valide";
        validMessage.classList.remove('text-success');
        validMessage.classList.add('text-danger');
        return false;
    }
};


//***************Recuperer les données quand on clique sur le bouton commander**********//
const btnSendForm = document.querySelector("#order");
btnSendForm.addEventListener("click",(e)=>{
    e.preventDefault();
// Récuperation des valeurs du formulaire 
const formValues = {
    prenom : document.querySelector("#firstName").value,
    nom : document.querySelector("#lastName").value,
    adresse : document.querySelector("#address").value,
    ville : document.querySelector("#city").value,
    mail : document.querySelector("#email").value
}
// Mettre l'objet "formValues" dans le LS si les values sont présentes dans les champs
if(validFisrtName(form.firstName) && validLastName(form.lastName) && validAddress(form.address) && validCity(form.city) && validEmail(form.email) ){
    localStorage.setItem("formValues",JSON.stringify(formValues));
    form.submit();
}else{
    alert('Veuillez remplir tous les champs du formulaire');
}
// Mettre les values du formulaire et mettre les produits sélectionnés dans un objet à envoyer vers le serveur
const toSend = {
    localStorageProducts,
    formValues
}
// Evoi de l'objet "toSend" vers le serveur
const promiseCart = fetch("http://localhost:3000/api/products/order",{
method: "POST",
body: JSON.stringify(toSend),
});



});   
