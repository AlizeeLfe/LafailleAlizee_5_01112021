//-------------------AFFICHAGE DES PROUITS DANS LE PANIER---------------------
const cartContainer = document.getElementById("cart__items");
const cartPrice = document.querySelector(".cart__price");
const cartOrder = document.querySelector(".cart__order");
// Recuperation des données contenues dans le LS et conversion en format JSON
let localStorageProducts = JSON.parse(localStorage.getItem("products"));

// Necerssaire ??
fetch("http://localhost:3000/api/products")
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })

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
                    <p>${localStorageProducts[j].color}</p>
                    <p>${localStorageProducts[j].price}</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${localStorageProducts[j].qty}">
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
    let deleteArticle = document.querySelectorAll(".cart__item__content__settings__delete");

    // Selection de l'id et couleur de l'article qui va être supprimé en cliquant sur "supprimer"
    for (let k = 0; k < deleteArticle.length; k++){
        deleteArticle[k].addEventListener("click" ,(event) =>{
            event.preventDefault();
            let deleteIdSelection = localStorageProducts[k]._id;
            console.log(deleteIdSelection);
        })
    }





//******************Montant total panier**************
// Déclaration variable pour pouvoir y mettre les prix présents dans le panier
let totalPrice = [];
for (let l = 0; l< localStorageProducts.length; l++){
    
}


    
