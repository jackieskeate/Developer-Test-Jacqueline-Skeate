﻿document.addEventListener("DOMContentLoaded", function () {
    fetch('/api/products')
        .then(function (response) {
            return response.json();
        })
        .then(function (products) {
            let productsList = document.getElementById('productList');

            return products.map(function (product) {
                let li = document.createElement('li');
                li.className = "list-group-item d-flex justify-content-between lh-condensed";
                li.onclick = function () {
                    addToBasket(product);
                };
                li.id = product.id;
                let div = document.createElement('div');
                let h6 = document.createElement('h6');
                h6.className = "my-0";
                h6.innerText = product.name;
                let small = document.createElement('small');
                small.className = "text-muted";
                small.innerText = "click to add to basket";
                let span = document.createElement('span');
                span.className = "text-muted";
                span.innerText = product.grossPrice;

                li.appendChild(div);
                div.appendChild(h6);
                div.appendChild(small);
                li.appendChild(span);

                productsList.appendChild(li);
            });
        });

    fetch('/api/baskets')
        .then(function (response) {
            return response.json();
        })
        .then(function (basket) {
            updateBasketView(basket);
            resetBasketCount(basket.items.length);
        });
});

function emptyBasketView() {
    var basketView = document.getElementById('currentBasket');
    while (basketView.lastElementChild) {
        basketView.removeChild(basketView.lastElementChild);
    }
}

function resetBasketCount(basketSize) {
    let basketCount = document.getElementById('basketCount');
    basketCount.innerText = basketSize;
}

function updateBasketView(basket)
{
    let basketList = document.getElementById('currentBasket');
    
    let totalLi = document.createElement('li');
    totalLi.className = "list-group-item d-flex justify-content-between";
    let totalSpan = document.createElement('span');
    totalSpan.innerText = "Total (GBP)";
    totalLi.appendChild(totalSpan);
    let totalStrong = document.createElement('strong');
    totalStrong.innerText = basket.total.toFixed(2); 
    totalLi.appendChild(totalStrong);
    let totalPromo = document.createElement('strong');
    if (basket.promoCode == "discount10") {
        totalPromo.innerText = "Discount: 10%";
    } else if (basket.promoCode == "discount50") {
        totalPromo.innerText = "Discount: 50%";
    } else {
        totalPromo.innerText = "Discount: 0%";
    }
    totalLi.appendChild(totalPromo);
    basketList.appendChild(totalLi);

    return basket.items.map(function (item) {
        let li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between lh-condensed";;
        let div = document.createElement('div');
        let h6 = document.createElement('h6');
        h6.className = "my-0";
        h6.innerText = item.name;
        let small = document.createElement('small');
        small.className = "text-muted";
        small.innerText = item.quantity;
        let span = document.createElement('span');
        span.className = "text-muted";
        span.innerText = item.grossPrice;

        li.appendChild(div);
        div.appendChild(h6);
        div.appendChild(small);
        li.appendChild(span);

        basketList.appendChild(li);
    });
}

function addToBasket(product) {
    fetch('api/baskets', {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    }).then(function (response) {
        return response.json();
    }).then(function (basket) {
        emptyBasketView();
        resetBasketCount(basket.items.length);
        updateBasketView(basket);
    });
}

function placeOrder() {
    fetch('/api/baskets')
        .then(function (response) {
            return response.json();
        })
        .then(function (basket) {
            fetch('api/orders', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(basket)
            }).then(function (response) {
                return response.json();
            }).then(function (basket) {
                if (basket.message) {
                    // Order was not placed
                    alert(basket.message);
                } else {
                    alert('your order has been placed');
                    resetBasketCount(0);
                    emptyBasketView();
                }
            });
        });
}

function applyPromoCode(promoCode) {
    fetch('api/baskets', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(promoCode)
    }).then(function (response) {
        return response.json();
    }).then(function (basket) {
        if (basket.message) {
            // Promo code was not accepted
            alert(basket.message);
        } else {
            // Update basket and totals in view
            emptyBasketView();
            resetBasketCount(basket.items.length);
            updateBasketView(basket);
        }
    });
}
