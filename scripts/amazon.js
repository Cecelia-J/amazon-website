import {cart, addToCart, addedVisable, updateCartQuantity} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';

loadProducts(renderProductsGrid);

function renderProductsGrid(){
  let productsHTML = '';

  updateCartQuantity()

  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filteredProducts = products;
  if(search){
    filteredProducts = products.filter((product) => {
      let matchingKeyword = false;
      product.keywords.forEach((keyword) => {
        if(keyword.toLowerCase().includes(search.toLocaleLowerCase())){
          matchingKeyword = true;
        }
      });
      return matchingKeyword || product.name.toLocaleLowerCase().includes(search.toLocaleLowerCase());
    });
  }

  filteredProducts.forEach((products) => {
    productsHTML += `
          <div class="product-container">
            <div class="product-image-container">
              <img class="product-image"
                src="${products.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
              ${products.name}
            </div>

            <div class="product-rating-container">
              <img class="product-rating-stars"
                src="${products.getStarsUrl()}">
              <div class="product-rating-count link-primary">
                ${products.rating.count}
              </div>
            </div>

            <div class="product-price">
              ${products.getPrice()}
            </div>

            <div class="product-quantity-container">
              <select class="js-quantity-selector-${products.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            ${products.extraInfoHTML()}

            <div class="product-spacer"></div>

            <div class="added-to-cart js-added-to-cart-${products.id}">
              <img src="images/icons/checkmark.png">
              Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart-button" data-product-id="${products.id}">
              Add to Cart
            </button>
          </div>`
  })

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  // document.querySelector('.js-cart-quantity').innerHTML = cartSumQuantity;

  document.querySelectorAll('.js-add-to-cart-button').forEach((button) => {
    button.addEventListener('click', () => {
      const {productId} = button.dataset;
      addedVisable(productId);
      addToCart(productId);
      // console.log(cart);
      updateCartQuantity();
    })
  });

  document.querySelector('.js-search-button')
    .addEventListener('click', () => {
      const search = document.querySelector('.js-search-bar').value;
      window.location.href = `amazon.html?search=${search}`;
    });
  document.querySelector('.js-search-bar')
  .addEventListener('keydown', (event) => {
    if(event.key === 'Enter'){
      const search = document.querySelector('.js-search-bar').value;
      window.location.href = `amazon.html?search=${search}`;
    }
  });
}
