document.addEventListener('DOMContentLoaded', () => {
    const startOrderButton = document.getElementById('startOrder');
    if (startOrderButton) {
        startOrderButton.addEventListener('click', () => {
            location.href = 'selectBeverage.html';
        });
    }

    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    const signinForm = document.getElementById('signinForm');
    if (signinForm) {
        signinForm.addEventListener('submit', handleSignin);
    }
});

function selectBeverage(beverage) {
    sessionStorage.setItem('beverage', beverage);
    location.href = 'addCondiments.html';
    displayOrder();
}

function addCondiment(condiment) {
    let condiments = sessionStorage.getItem('condiments') ? JSON.parse(sessionStorage.getItem('condiments')) : [];
    const index = condiments.indexOf(condiment);
    if (index > -1) {
        condiments.splice(index, 1);
    } else {
        condiments.push(condiment);
    }
    sessionStorage.setItem('condiments', JSON.stringify(condiments));
    displayOrder();
}

function removeCondiment(index) {
    let condiments = JSON.parse(sessionStorage.getItem('condiments') || '[]');
    condiments.splice(index, 1);
    sessionStorage.setItem('condiments', JSON.stringify(condiments));
    displayOrder();
}

function removeBeverage() {
    sessionStorage.removeItem('beverage');
    sessionStorage.removeItem('condiments');
    location.href = 'selectBeverage.html';
}

function displayOrder() {
    const orderSummary = document.getElementById('orderSummary');
    const beverage = sessionStorage.getItem('beverage');
    const condiments = JSON.parse(sessionStorage.getItem('condiments') || '[]');

    let displayHtml = `<strong>Order Summary:</strong><br>`;
    if (beverage) {
        displayHtml += `<span class="clickable" onclick="removeBeverage()">${beverage}</span><br>`;
    } else {
        displayHtml += "No beverage selected.<br>";
    }
    if (condiments.length > 0) {
        displayHtml += `Condiments:<br>`;
        condiments.forEach((condiment, index) => {
            displayHtml += `<span class="clickable" onclick="removeCondiment(${index})">${condiment}</span><br>`;
        });
    }
    orderSummary.innerHTML = displayHtml;
}

function confirmOrder() {
    const beverage = sessionStorage.getItem('beverage');
    const condiments = JSON.parse(sessionStorage.getItem('condiments') || '[]');

    const orderData = {
        beverage: beverage,
        condiments: condiments,
    };

    console.log("Submitting order with JSON body:", JSON.stringify(orderData));

    fetch('https://coffee-order-latest-1-ouyu.onrender.com/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderData),
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

function handleSignup(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    const signupData = {
        username: username,
        password: password,
        email: email
    };

    fetch('https://coffee-order-latest-1-ouyu.onrender.com/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
    })
    .then(response => {
        if (response.ok) {
            alert('Signup successful. Please sign in.');
            window.location.href = 'signin.html';
        } else {
            alert('Signup failed. Please try again.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('There was an error during signup. Please try again.');
    });
}

function handleSignin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const signinData = {
        username: username,
        password: password
    };

    fetch('https://coffee-order-latest-1-ouyu.onrender.com/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(signinData),
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error('Signin failed');
        }
    })
    .then(token => {
        sessionStorage.setItem('token', token);
        window.location.href = 'selectBeverage.html';
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Signin failed. Please check your credentials and try again.');
    });
}