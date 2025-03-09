import {calculateCartQuantity, cart, removeFromCart, updateQuantity, updateDeliveryOption} from '../../data/cart.js';
import { getProduct, products } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { deliveryOptions, getDeliveryOption } from '../../data/deliveryOption.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

 export function renderOrderSummary() {
  let cartHTML = '';

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption = getDeliveryOption(deliveryOptionId);

    // const dateString = calculateDeliveryDate(deliveryOption);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays,'days');
    const dateString = deliveryDate.format('dddd, MMMM D');


    cartHTML += `<div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id="${matchingProduct.id}" >
              Update
            </span>
            
            <input class="quantity-input js-quantity-input-${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-quantity-link"  data-product-id="${matchingProduct.id}">
              Save
            </span>

            <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>`
  })


  function deliveryOptionHTML(matchingProduct, cartItem) {
    let deliveryHTML = '';
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays,'days');
      const dateString = deliveryDate.format('dddd, MMMM D');

      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      deliveryHTML +=
      ` 
        <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
          <input type="radio" ${isChecked ? 'checked' : ''}
            class="delivery-option-input"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>
      `
    });
    return deliveryHTML;
  };

  document.querySelector('.js-order-summary').innerHTML = cartHTML;

  document.querySelectorAll('.js-delete-quantity-link').forEach((deleteLink) => {
    deleteLink.addEventListener('click', () => {
      const productId = deleteLink.dataset.productId;
      removeFromCart(productId);
      renderCheckoutHeader();
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-update-quantity-link').forEach((updateLink) => {
    updateLink.addEventListener('click', () => {
      const productId = updateLink.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');
    })
  });

  document.querySelectorAll('.js-save-quantity-link').forEach((saveLink) => {
    const productId = saveLink.dataset.productId;
    document.querySelector(`.js-quantity-input-${productId}`).addEventListener('keydown', (event) => {
      if(event.key === 'Enter'){
        const productId = saveLink.dataset.productId;
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.classList.remove('is-editing-quantity');
    
        const saveValue = Number(document.querySelector(`.js-quantity-input-${productId}`).value);
    
        if(saveValue >=0 && saveValue < 1000){
          updateQuantity(productId, saveValue);
          renderCheckoutHeader();
          renderOrderSummary();
          renderPaymentSummary();
        } else{
          alert('wrong quantity');
        }
      }
    });
    saveLink.addEventListener('click', () => {
      const productId = saveLink.dataset.productId;
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.remove('is-editing-quantity');

      const saveValue = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

      if(saveValue >=0 && saveValue < 1000){
        updateQuantity(productId, saveValue);
        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();
      } else{
        alert('wrong quantity');
      }
    })
  });

  document.querySelectorAll('.js-delivery-option').forEach((element) => { 
    element.addEventListener('click', () => {
      const {productId, deliveryOptionId} = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);

      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
