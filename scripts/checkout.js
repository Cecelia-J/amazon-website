import { renderCheckoutHeader } from "./checkout/checkoutHeader.js";
import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";

async function loadPage(){
  try{
    await loadProductsFetch();
    await new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });
  } catch(error){
    console.log('Unexpected error. Pleasse try again later.');
  }
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
}
loadPage();

// Promise.all([
//   loadProductsFetch(),
//   new Promise((resolve) => {
//     loadCart(() => {
//       resolve();
//     });
//   })

// ]).then((values) => {
//   console.log(values);
//   renderCheckoutHeader();
//   renderOrderSummary();
//   renderPaymentSummary();
// })

// new Promise((resolve) => {
//   loadProducts(() => {
//     resolve();
//   });
// }).then(() => {
//   return new Promise((resolve) => {
//     loadCart(() => {
//       resolve();
//     });
//   }).then(() => {
//       renderCheckoutHeader();
//       renderOrderSummary();
//       renderPaymentSummary();
//   })
// });

// loadProducts(() => {
//   loadCart(() => {
//     renderCheckoutHeader();
//     renderOrderSummary();
//     renderPaymentSummary();
//   });
// });

