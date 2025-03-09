import { getOrder } from "../data/orders.js";
import { loadProductsFetch, getProduct } from "../data/products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { updateCartQuantity } from "../data/cart.js";


updateCartQuantity()

async function loadPage() {
  await loadProductsFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  const order = getOrder(orderId);
  const product = getProduct(productId);

  let productDetails;
  order.products.forEach((details) => {
    if (details.productId === product.id) {
      productDetails = details;
    }
  });

  const currentTime = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);
  let percentTime = ((currentTime - orderTime) / (deliveryTime - orderTime))*100000;
  console.log(percentTime);

  const trackingHTML = `
    <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        Arriving on ${dayjs(productDetails.estimatedDeliveryTime).format('MMMM D')}
      </div>

      <div class="product-info">
        ${product.name}
      </div>

      <div class="product-info">
        Quantity: ${productDetails.quantity}
      </div>

      <img class="product-image" src="${product.image}">

      <div class="progress-labels-container">
        <div class="progress-label ${
          percentTime<50 ? 'current-status' : ''
        }">
          Preparing
        </div>
        <div class="progress-label ${
          (percentTime>=50 && percentTime<100 ? 'current-status' : '')
        }">
          Shipped
        </div>
        <div class="progress-label ${percentTime>=100 ? 'current-status' : ''}">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${percentTime}%;"></div>
      </div>
    </div>
  `;

  document.querySelector('.js-main').innerHTML = trackingHTML;

  document.querySelector('.js-search-button').addEventListener('click', () => {
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
};

loadPage();
