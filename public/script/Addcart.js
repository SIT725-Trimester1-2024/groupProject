let cartCount = 0;
let cartItems = [];

// Function to add an item to the cart
function addToCart(item) {
    // Increase cart count
    cartCount++;

    // Add item to cart items
    cartItems.push(item);

    // Update cart count display
    let cartCountElement = document.querySelector('.cart-count');
    if (cartCount > 0) {
        cartCountElement.style.display = 'block';
        cartCountElement.textContent = cartCount;
    } else {
        cartCountElement.style.display = 'none';
    }

    // Update cart items display
    let cartItemsElement = document.querySelector('.cart-items');
    cartItemsElement.innerHTML = '';
    for (let item of cartItems) {
        let itemElement = document.createElement('p');
        itemElement.textContent = item;
        cartItemsElement.appendChild(itemElement);
    }
}
