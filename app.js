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
    // Retrieve the current list of condiments from sessionStorage, or initialize an empty array if none exist.
    let condiments = sessionStorage.getItem('condiments') ? JSON.parse(sessionStorage.getItem('condiments')) : [];

    // Check if the selected condiment is already in the array.
    if (condiments.includes(condiment)) {
        alert(`${condiment} has already been added.`);
    } else {
        // If the condiment is not in the array, add it.
        condiments.push(condiment);
        sessionStorage.setItem('condiments', JSON.stringify(condiments));
        displayOrder(); // Update the display to show the current order.
    }
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
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        sessionStorage.setItem('orderConfirmation', JSON.stringify(data));
        window.location.href = 'orderConfirmation.html'; 
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('There was an error submitting your order. Please try again.');
    });
}


