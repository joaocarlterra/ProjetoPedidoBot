document.addEventListener('DOMContentLoaded', () => {
    const socket = new WebSocket('wss://localhost:5000')

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
            cartItem.innerHTML = `<h3>${item.name}</h3><p>R$${item.price}</p>`;
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

    function handlePayloadData(data) {
        const DOMElements = document.querySelectorAll('.menu-item')
        const menuItems = [];

        DOMElements.forEach(item => {
            const name = item.getAttribute('data-name');
            const price = item.getAttribute('data-price');

            menuItems.push({ name, price })
        });

        function processData(data, menuItems) {
            const menuMap = new Map(menuItems.map(item => [item.name, parseFloat(item.price)]));
            const items = [];
            let totalItems = 0;
            let orderTotal = 0;
        
            function addItem(name, amount) {
                if (amount > 0) {
                    const price = menuMap.get(name);
                    items.push({ name: `${amount} ${name}`, price: (amount * price).toFixed(2) });
                    totalItems +=Number(amount);
                    orderTotal += amount * price;
                }
            }
        
            Object.values(data).forEach(order => {
                addItem(order["burger-type"], order["burger-amount"]);
                addItem(order["side-dishes"], order["side-dishes-amount"]);
                addItem(order["drinks"], order["drinks-amount"]);
            });
        
            return {
                items,
                totalItems,
                orderTotal: orderTotal.toFixed(2)
            };
        }
        

        const processedData = processData(data, menuItems)
        processedData.items.forEach(item => {
            cart.push(item);
            updateCart();
        })
    }

    socket.onopen = function() {
        console.log('Connected to websocket server')
    }

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data)

        handlePayloadData(data)
    }

    socket.onclose = function() {
        console.log('Disconnected from websocket server')
    }
});
