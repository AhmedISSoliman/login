var signupBtn = document.getElementById('signupBtn');
var signupFullName = document.getElementById('signupFullName');
var signupEmail = document.getElementById('signupEmail');
var signupPassword = document.getElementById('signupPassword');
var validationMsg = document.getElementById('validationMsg');
var successMsg = document.getElementById('successMsg');


var signInBtn = document.getElementById('signInBtn');
var signInEmail = document.getElementById('signInEmail');
var signInPassword = document.getElementById('signInPassword');
var signInMsg = document.getElementById('signInMsg');

var signUpArray = JSON.parse(localStorage.getItem('users')) || [];

var logoutBtn = document.getElementById('logoutBtn');

// Regex patterns
var namePattern = /^[a-zA-Z ]{2,30}$/; // Example pattern for full name
var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email pattern
var passwordPattern = /^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d](?=.*[#_^@$!%*?&])[A-Za-z\d#_^@$!%*?&]{7,}$/; // Example pattern for password

// Event listeners to clear error messages on input
["signupFullName", "signupEmail", "signupPassword"].forEach(function (id) {
    document.getElementById(id)?.addEventListener("input", function () {
        clearErrorMessage(this);
    });
});

signupBtn?.addEventListener('click', function () {
    // Validate each field
    var isNameValid = validateField(signupFullName, namePattern, "Name is required", "Invalid name");
    var isEmailValid = validateField(signupEmail, emailPattern, "Email is required", "Invalid email");
    var isPasswordValid = validateField(signupPassword, passwordPattern, "Password is required", "Invalid password");

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
        return; // Stop if any validation fails
    }

    if (isEmailExist(signupEmail.value)) {
        validationMsg.innerHTML = "Email is already exist";
        return;
    }

    // Add user to array and save to local storage
    signUpArray.push({
        name: signupFullName.value,
        email: signupEmail.value,
        password: signupPassword.value
    });
    localStorage.setItem('users', JSON.stringify(signUpArray));
    validationMsg.innerHTML = '';
    successMsg.innerHTML = 'Registration Successful!';
    console.log('Registered:', { name: signupFullName.value, email: signupEmail.value });
    resetSignUpInputs();
    setTimeout(() => {
        window.location.href = 'signin.html';
    }, 500);
});

signInBtn?.addEventListener('click', function () {
    // Validate each field
    var isEmailValid = validateField(signInEmail, emailPattern, "Email is required", "Invalid email");
    var isPasswordValid = validateField(signInPassword, passwordPattern, "Password is required", "Invalid password");

    if (!isEmailValid || !isPasswordValid) {
        return; // Stop if any validation fails
    }

    if (isUserValid(signInEmail.value, signInPassword.value)) {
        // Redirect to home page on successful login
        resetSignInInputs()
        window.location.href = 'home.html';
    } else {
        signInMsg.innerHTML = "Invalid email or password";
    }
});

function validateField(inputElement, regex, emptyMessage, invalidMessage) {
    if (!inputElement.value.trim()) {
        document.querySelector("#" + inputElement.id + " + .error-message").textContent = emptyMessage;
        return false;
    } else if (!regex.test(inputElement.value)) {
        document.querySelector("#" + inputElement.id + " + .error-message").textContent = invalidMessage;
        return false;
    } else {
        document.querySelector("#" + inputElement.id + " + .error-message").textContent = "";
        return true;
    }
}
function isUserValid(email, password) {
    var user = signUpArray.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
    if (user) {
        // Save user's name in localStorage or session
        localStorage.setItem('loggedInUser', JSON.stringify({ name: user.name }));
        return true;
    } else {
        return false;
    }
}

// Clear error message on input
["signInEmail", "signInPassword"].forEach(function (id) {
    document.getElementById(id)?.addEventListener("input", function () {
        clearErrorMessage(this);
    });
});

function isEmailExist(email) {
    return signUpArray.some(user => user.email.toLowerCase() === email.toLowerCase());
}

function resetSignUpInputs() {
    signupFullName.value = '';
    signupEmail.value = '';
    signupPassword.value = '';
}
function resetSignInInputs() {
    signInEmail.value = '';
    signInPassword.value = '';
}

function clearErrorMessage(inputElement) {
    inputElement.nextElementSibling.textContent = "";
}

document.getElementById('logoutBtn')?.addEventListener('click', function () {
    // Clear the loggedInUser from localStorage
    localStorage.removeItem('loggedInUser');

    // Redirect to the sign-in page
    window.location.href = 'signin.html';
});