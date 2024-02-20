document.addEventListener('DOMContentLoaded', () => {
    const startOrderButton = document.getElementById('startOrder');
    startOrderButton.addEventListener('click', () => {
        location.href = 'selectBeverage.html';
    });
});

function selectBeverage(beverage) {
    sessionStorage.setItem('beverage', beverage);
    location.href = 'addCondiments.html';
}

function addCondiment(condiment) {
    let condiments = sessionStorage.getItem('condiments') ? JSON.parse(sessionStorage.getItem('condiments')) : [];
    condiments.push(condiment);
    sessionStorage.setItem('condiments', JSON.stringify(condiments));
    displayOrder();
}

function displayOrder() {
    const orderSummary = document.getElementById('orderSummary');
    const beverage = sessionStorage.getItem('beverage');
    const condiments = JSON.parse(sessionStorage.getItem('condiments') || '[]');
    orderSummary.innerHTML = `<strong>Order Summary:</strong><br>Beverage: ${beverage}<br>Condiments: ${condiments.join(', ')}`;
}

function confirmOrder() {
    const beverage = sessionStorage.getItem('beverage');
    const condiments = JSON.parse(sessionStorage.getItem('condiments') || '[]');

    fetch('http://localhost:8080/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            beverage: beverage,
            condiments: condiments,
        }),
    })
    .then(response => response.json())
    .then(data => {
        sessionStorage.setItem('orderConfirmation', JSON.stringify(data));
        location.href = 'orderConfirmation.html';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

