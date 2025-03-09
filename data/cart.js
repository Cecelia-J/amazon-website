
export let cart = JSON.parse(localStorage.getItem('cart'));
if(!cart){
  cart = [{
    productId: "02e3a47e-dd68-467e-9f71-8bf6f723fdae",
    quantity: 2,
    deliveryOptionId: '1'
  }, {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 1,
    deliveryOptionId: '2'
  }]
}

export function clearCart(){
  cart = [];
  saveStorage();
}
const addedMessageTime = [];
export function addedVisable(productId){
  const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`);
    addedMessage.classList.add('added-to-cart-visable');

    const previousTimeId = addedMessageTime[productId];
    if(previousTimeId){
      clearTimeout(previousTimeId);
    }
    const timeoutId = setTimeout(() => {
        addedMessage.classList.remove('added-to-cart-visable');
    }, 2000);
    addedMessageTime[productId] = timeoutId;
}

export function saveStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId){
  const selectId = document.querySelector(`.js-quantity-selector-${productId}`);
  let matchingProduct;
  cart.forEach((product) => {
    if(productId === product.productId){
      matchingProduct = product;
    }
  });
  if(matchingProduct){
    matchingProduct.quantity += Number(selectId.value);
  } else{
    cart.push({
      productId,
      quantity: Number(selectId.value),
      deliveryOptionId: '1'
    })
  }

  saveStorage()
}

export function addToCartFromOrder(productId, productQuantity){
  let matchingProduct;
  cart.forEach((product) => {
    if(productId === product.productId){
      matchingProduct = product;
    }
  });
  if(matchingProduct){
    matchingProduct.quantity++;
  } else{
    cart.push({
      productId,
      quantity: productQuantity,
      deliveryOptionId: '1'
    })
  }

  saveStorage()
}

export function removeFromCart(productId){
  const newCart = [];
  cart.forEach((cartItem) => {
    if(cartItem.productId !== productId){
      newCart.push(cartItem);
    }
  });
  cart = newCart;

  saveStorage()
}

export function calculateCartQuantity(){
  let cartQuantity = 0;
  cart.forEach((cart) => {
    cartQuantity += cart.quantity;
  });
  return cartQuantity;
}

export function updateCartQuantity(){
  let cartQuantity = calculateCartQuantity();
  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

export function updateQuantity(productId, newQuantity){
  let matchingProduct;
  cart.forEach((cartItem) => {
    if(cartItem.productId === productId){
      matchingProduct = cartItem;
    }
  });
  matchingProduct.quantity = newQuantity;
  saveStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId){
  let matchingProduct;
  cart.forEach((cartItem) => {
    if(productId === cartItem.productId){
      matchingProduct = cartItem;
    }
  });
  matchingProduct.deliveryOptionId = deliveryOptionId;
  saveStorage();
}

export function loadCart(fun){

  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {

      console.log('load cart');

      fun();
  });
  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}