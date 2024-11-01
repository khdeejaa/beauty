// function untuk cari produk berdasarkan input dengan filter
async function searchProducts() {
    const query = document.getElementById("searchInput").value;
    const brand = document.getElementById("brandFilter").value.toLowerCase(); // Convert brand filter to lowercase
    const priceRange = document.getElementById("priceFilter").value;

    if (!query) {
        alert("Please enter a search term.");
        return;
    }
    //fetch produk dari API makeup
    const response = await fetch(`https://makeup-api.herokuapp.com/api/v1/products.json`);
    const products = await response.json();

    let filteredProducts = products.filter(product => 
        (!brand || product.brand?.toLowerCase() === brand) && // Ensure brand is lowercase and handle potential null values
        (!query || product.name.toLowerCase().includes(query.toLowerCase())) &&
        filterByPrice(product.price, priceRange)
    );

    displayProducts(filteredProducts);
}

// filter produk ikut range harga
function filterByPrice(price, range) {
    let productPrice = parseFloat(price);
    if (!range || isNaN(productPrice)) return true;

    let [min, max] = range.split('-').map(parseFloat);
    return productPrice >= min && (!max || productPrice <= max);
}

// function untuk display produk kat page 
function displayProducts(products) {
    const productsContainer = document.getElementById("products");
    productsContainer.innerHTML = "";

    if (products.length === 0) {
        productsContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    products.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

// function untuk dia display produk dalam card dengan dia punya details
function createProductCard(product) {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    const img = document.createElement("img");
    img.src = product.image_link;
    img.alt = product.name;
    productCard.appendChild(img);

    const name = document.createElement("h3");
    name.textContent = product.name;
    productCard.appendChild(name);

    const brand = document.createElement("p");
    brand.textContent = `Brand: ${product.brand}`;
    productCard.appendChild(brand);

    const price = document.createElement("p");
    price.textContent = `Price: ${product.price_sign || "$"}${product.price || "N/A"}`;
    productCard.appendChild(price);

    const description = document.createElement("p");
    description.textContent = product.description || "No description available.";
    productCard.appendChild(description);

    const rating = document.createElement("p");
    rating.textContent = `Rating: ${product.rating || "N/A"}`;
    productCard.appendChild(rating);

    const link = document.createElement("a");
    link.href = product.product_link;
    link.textContent = "View Product";
    link.target = "_blank";
    productCard.appendChild(link);

    // button untuk user add to wishlist
    const wishlistButton = document.createElement("button");
    wishlistButton.textContent = "Add to Wishlist";
    wishlistButton.onclick = () => addToWishlist(product);
    productCard.appendChild(wishlistButton);

    return productCard;
}

// function untuk tambah produk dlm wishlist
function addToWishlist(product) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const existingProduct = wishlist.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        wishlist.push(product);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert(`${product.name} added to Wishlist!`);
}

// function untuk load pastu display item yg dah add kat wishlist kat page wishlist
function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const wishlistContainer = document.getElementById("wishlist");

    wishlistContainer.innerHTML = ""; 

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
        return;
    }

    wishlist.forEach(product => {
        const productCard = createWishlistCard(product);
        wishlistContainer.appendChild(productCard);
    });
}

// function untuk kad wishlist dengan CRUD
function createWishlistCard(product) {
    const productCard = document.createElement("div");
    productCard.className = "product-card";

    const img = document.createElement("img");
    img.src = product.image_link;
    img.alt = product.name;
    productCard.appendChild(img);

    const name = document.createElement("h3");
    name.textContent = product.name;
    productCard.appendChild(name);

    const quantity = document.createElement("p");
    quantity.textContent = `Quantity: ${product.quantity}`;
    productCard.appendChild(quantity);

    const increaseButton = document.createElement("button");
    increaseButton.textContent = "+";
    increaseButton.onclick = () => updateQuantity(product.id, product.quantity + 1);
    productCard.appendChild(increaseButton);

    const decreaseButton = document.createElement("button");
    decreaseButton.textContent = "-";
    decreaseButton.onclick = () => updateQuantity(product.id, product.quantity - 1);
    productCard.appendChild(decreaseButton);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.onclick = () => removeFromWishlist(product.id);
    productCard.appendChild(removeButton);

    return productCard;
}

// function untuk update kuantiti kat dalam wishlist
function updateQuantity(productId, newQuantity) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const product = wishlist.find(item => item.id === productId);

    if (product) {
        product.quantity = Math.max(newQuantity, 1); // kuantiti paling sikit 1 je
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        loadWishlist(); // refresh wishlist display
    }
}

// function untuk remove product tu dari wishlist
function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist = wishlist.filter(product => product.id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    loadWishlist(); // Refresh wishlist display
}

// function loadwishlist kalau kat page wishlist
if (window.location.pathname.includes("wishlist.html")) {
    loadWishlist();
}
