let cart = [];

/* =========================
   ADD TO CART
========================= */

function addToCart(name, price) {

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    updateCart();

    alert(name + " telah ditambah ke cart! 🍔");
}


/* =========================
   UPDATE CART
========================= */

function updateCart() {

    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p style="text-align:center; padding:20px;">
                Cart masih kosong 🛒
            </p>
        `;

    } else {

        cart.forEach((item, index) => {

            const itemTotal = item.price * item.quantity;

            total += itemTotal;
            totalQuantity += item.quantity;

            cartItems.innerHTML += `
                <div class="cart-item">

                    <div class="cart-item-info">

                        <div class="cart-item-name">
                            ${item.name}
                        </div>

                        <div class="cart-item-price">
                            RM${item.price.toFixed(2)}
                        </div>

                    </div>

                    <div class="quantity-controls">

                        <button onclick="decreaseQuantity(${index})">
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button onclick="increaseQuantity(${index})">
                            +
                        </button>

                    </div>

                </div>
            `;
        });
    }

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = total.toFixed(2);
}


/* =========================
   INCREASE QUANTITY
========================= */

function increaseQuantity(index) {

    cart[index].quantity++;

    updateCart();
}


/* =========================
   DECREASE QUANTITY
========================= */

function decreaseQuantity(index) {

    cart[index].quantity--;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    updateCart();
}


/* =========================
   OPEN CART
========================= */

function openCart() {

    document.getElementById("cart-modal").style.display = "block";

    updateCart();
}


/* =========================
   CLOSE CART
========================= */

function closeCart() {

    document.getElementById("cart-modal").style.display = "none";
}


/* =========================
   OPEN CHECKOUT
========================= */

function openCheckout() {

    if (cart.length === 0) {

        alert("Cart masih kosong! Sila pilih menu dahulu 🍔");

        return;
    }

    closeCart();

    document.getElementById("checkout-modal").style.display = "block";
}


/* =========================
   CLOSE CHECKOUT
========================= */

function closeCheckout() {

    document.getElementById("checkout-modal").style.display = "none";
}


/* =========================
   COD / PICKUP
========================= */

function toggleAddress() {

    const orderType = document.querySelector(
        'input[name="order-type"]:checked'
    ).value;

    const addressSection =
        document.getElementById("address-section");

    const addressInput =
        document.getElementById("customer-address");

    if (orderType === "COD") {

        addressSection.style.display = "block";

        addressInput.required = true;

    } else {

        addressSection.style.display = "none";

        addressInput.required = false;

        addressInput.value = "";
    }
}


/* =========================
   SEND ORDER TO WHATSAPP
========================= */

document.getElementById("checkout-form").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        if (cart.length === 0) {

            alert("Cart masih kosong!");

            return;
        }


        const customerName =
            document.getElementById("customer-name").value.trim();

        const customerPhone =
            document.getElementById("customer-phone").value.trim();

        const orderType =
            document.querySelector(
                'input[name="order-type"]:checked'
            ).value;

        const address =
            document.getElementById("customer-address").value.trim();

        const note =
            document.getElementById("order-note").value.trim();


        /* =========================
           CHECK ADDRESS
        ========================= */

        if (orderType === "COD" && address === "") {

            alert("Sila masukkan alamat penghantaran.");

            return;
        }


        /* =========================
           CALCULATE TOTAL
        ========================= */

        let total = 0;

        let orderList = "";


        cart.forEach(item => {

            const itemTotal =
                item.price * item.quantity;

            total += itemTotal;

            orderList +=
                `🍔 ${item.name} x${item.quantity} - RM${itemTotal.toFixed(2)}%0A`;
        });


        /* =========================
           ORDER TYPE TEXT
        ========================= */

        let deliveryText = "";

        if (orderType === "COD") {

            deliveryText =
                `🛵 Delivery (COD)%0A` +
                `📍 Alamat: ${encodeURIComponent(address)}%0A`;

        } else {

            deliveryText =
                `🏪 Pickup%0A`;
        }


        /* =========================
           NOTE
        ========================= */

        let noteText = "";

        if (note !== "") {

            noteText =
                `📝 Nota: ${encodeURIComponent(note)}%0A`;
        }


        /* =========================
           WHATSAPP MESSAGE
        ========================= */

        const message =
    `🍔 *ORDER BURGER AHCiK*%0A` +
    `%0A` +
    `👤 *Nama:* ${encodeURIComponent(customerName)}%0A` +
    `📱 *No. Telefon:* ${encodeURIComponent(customerPhone)}%0A` +
    `%0A` +
    `${deliveryText}%0A` +
    `%0A` +
    `🛒 *PESANAN:*%0A` +
    `${orderList}` +
    `%0A` +
    `📝 *Nota:* ${noteText}%0A` +
    `%0A` +
    `💰 *TOTAL: RM${total.toFixed(2)}*`;

        /* =========================
           WHATSAPP NUMBER
        ========================= */

        /*
           PENTING:
           Tukar nombor di bawah kepada
           nombor WhatsApp Burger Ahcik.

           Contoh:
           601158570613

           Jangan letak + atau space.
        */

        const whatsappNumber = window.businessSettings?.WhatsApp || "601158570613";

        /* =========================
           OPEN WHATSAPP
        ========================= */

        const whatsappURL =
            `https://wa.me/${whatsappNumber}?text=${message}`;

const confirmOrder = confirm("Anda pasti mahu hantar order ini? 🍔");

if (!confirmOrder) return;
fetch("https://script.google.com/macros/s/AKfycbygY9cceZtXoJ-hB7vP20YYi8out4rnVr3sN112W6bSDyNMfSCjt0otZUDYXZANG3Jj/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
        "Content-Type": "text/plain"
    },
    body: JSON.stringify({
        order: cart.map(item => item.name).join(", "),
        quantity: cart.map(item => item.quantity).join(", "),
        total: total.toFixed(2),
        status: "Pending"
    })
});
        window.open(whatsappURL, "_blank");
    }
);


/* =========================
   CLOSE MODAL WHEN CLICK OUTSIDE
========================= */

window.addEventListener("click", function(event) {

    const cartModal =
        document.getElementById("cart-modal");

    const checkoutModal =
        document.getElementById("checkout-modal");


    if (event.target === cartModal) {

        closeCart();
    }


    if (event.target === checkoutModal) {

        closeCheckout();
    }

});


/* =========================
   INITIAL CART
========================= */

updateCart();

toggleAddress();
async function loadMenuFromSheet() {

    const url = "https://script.google.com/macros/s/AKfycbygY9cceZtXoJ-hB7vP20YYi8out4rnVr3sN112W6bSDyNMfSCjt0otZUDYXZANG3Jj/exec";

    try {

        const response = await fetch(url);
        const menu = await response.json();

        const menuContainer =
            document.getElementById("menu-container");

        menuContainer.innerHTML = "";

        menu.forEach(item => {

            if (String(item.available).trim().toUpperCase() !== "ON") {
                return;
            }

            menuContainer.innerHTML += `
                <div class="product">

                    <div class="emoji">
    <img src="${item.image}" alt="${item.name}" style="width:100%; height:180px; object-fit:cover; border-radius:10px;">
</div>
                    <h3>${item.name}</h3>

                    <p>RM${Number(item.price).toFixed(2)}</p>

                    <button class="button"
                        onclick="addToCart('${item.name}', ${item.price})">
                        Add to Cart
                    </button>

                </div>
            `;
        });

    } catch (error) {

        console.error("Gagal ambil menu:", error);

    }
}

loadMenuFromSheet();
async function loadSettings() {

    const url = "https://script.google.com/macros/s/AKfycbygY9cceZtXoJ-hB7vP20YYi8out4rnVr3sN112W6bSDyNMfSCjt0otZUDYXZANG3Jj/exec?type=settings";

    try {

        const response = await fetch(url);
        const settings = await response.json();

        window.businessSettings = settings;

        console.log("Settings berjaya dimuatkan:", settings);

    } catch (error) {

        console.error("Gagal ambil Settings:", error);

    }
}

loadSettings();