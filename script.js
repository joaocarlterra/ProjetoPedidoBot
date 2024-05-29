document.addEventListener('DOMContentLoaded', () => {
  const cart = [];
  const cartCountElement = document.getElementById('cart-count');
  const cartItemsElement = document.getElementById('cart-items');
  const cartElement = document.getElementById('cart');
  const closeCartButton = document.getElementById('close-cart');
  const cartIcon = document.getElementById('cart-icon');

  document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', () => {
          const name = item.getAttribute('data-name');
          const price = item.getAttribute('data-price');
          addItemToCart(name, price);
      });
  });

  cartIcon.addEventListener('click', () => {
      toggleCartVisibility();
  });

  closeCartButton.addEventListener('click', () => {
      toggleCartVisibility();
  });

  function addItemToCart(name, price) {
      const item = { name, price };
      cart.push(item);
      updateCart();
  }

  function updateCart() {
      cartCountElement.textContent = cart.length;
      cartItemsElement.innerHTML = '';

      cart.forEach(item => {
          const cartItem = document.createElement('div');
          cartItem.classList.add('cart-item');
          cartItem.innerHTML = `<h3>${item.name}</h3><p>$${item.price}</p>`;
          cartItemsElement.appendChild(cartItem);
      });
  }

  function toggleCartVisibility() {
      if (cartElement.classList.contains('cart-hidden')) {
          cartElement.classList.remove('cart-hidden');
          cartElement.classList.add('cart-visible');
      } else {
          cartElement.classList.remove('cart-visible');
          cartElement.classList.add('cart-hidden');
      }
  }
});
