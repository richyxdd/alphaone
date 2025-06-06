let currentStep = 0;
const formData = {};

// Render form based on step
function renderStep() {
    const form = document.getElementById("form-step");
    form.innerHTML = getStepHTML();
}

// Generate form content based on the current step
function getStepHTML() {
    if (currentStep === 0) {
        return `
            <label>First Name</label>
            <input type="text" id="first-name" placeholder="Enter your first name" required/>
            <p id="first-name-error" class="error-message"></p>
            
            <label>Last Name</label>
            <input type="text" id="last-name" placeholder="Enter your last name" required/>
            <p id="last-name-error" class="error-message"></p>
            
            <label>Email or Phone</label>
            <input type="text" id="contact-info" placeholder="Enter email or phone" required/>
            <p id="contact-error" class="error-message"></p>
            
            <button onclick="validateNameAndContact()">Next</button>
        `;
    } else {
        const carQuestions = [
            { id: "make", label: "Car Make", placeholder: "Enter car make" },
            { id: "model", label: "Car Model", placeholder: "Enter car model" },
            { id: "year", label: "Year", placeholder: "Enter year" },
            { id: "colors", label: "Preferred Colors (up to 3)", placeholder: "Enter preferred colors" },
            { id: "mileage", label: "Preferred Mileage", placeholder: "Enter mileage" },
            { id: "budget", label: "Budget", placeholder: "Enter budget" },
            { id: "notes", label: "Additional Notes", placeholder: "Enter any additional notes" }
        ];

        const question = carQuestions[currentStep - 1];
        return `
            <label>${question.label}</label>
            <input type="text" id="${question.id}" placeholder="${question.placeholder}" required/>
            <div class="button-container">
                <button onclick="prevStep()">Back</button>
                <button onclick="nextStep()">Next</button>
            </div>
        `;
    }
}

// Validate personal information
function validateNameAndContact() {
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const contact = document.getElementById("contact-info").value.trim();

    const namePattern = /^[A-Za-z\s]+$/;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phonePattern = /^[0-9]{10,15}$/;

    let isValid = true;

    if (!namePattern.test(firstName)) {
        document.getElementById("first-name-error").textContent = "Please enter a valid first name.";
        isValid = false;
    } else {
        document.getElementById("first-name-error").textContent = "";
    }

    if (!namePattern.test(lastName)) {
        document.getElementById("last-name-error").textContent = "Please enter a valid last name.";
        isValid = false;
    } else {
        document.getElementById("last-name-error").textContent = "";
    }

    if (!emailPattern.test(contact) && !phonePattern.test(contact)) {
        document.getElementById("contact-error").textContent = "Please enter a valid email or phone number.";
        isValid = false;
    } else {
        document.getElementById("contact-error").textContent = "";
    }

    if (isValid) {
        formData['first-name'] = firstName;
        formData['last-name'] = lastName;
        formData['contact-info'] = contact;
        currentStep++;
        renderStep();
    }
}

// Go to the next step
function nextStep() {
    const input = document.querySelector("input");
    const value = input ? input.value.trim() : "";

    if (value === "") {
        input.setCustomValidity("This field is required.");
        input.reportValidity();
        return;
    }

    formData[input.id] = value;
    currentStep++;

    // If all steps are done, submit the form
    if (currentStep > 7) {
        submitForm();
    } else {
        renderStep();
    }
}

// Go to the previous step
function prevStep() {
    if (currentStep > 0) {
        currentStep--;
        renderStep();
        restorePreviousValues();
    }
}

// Restore values when going back
function restorePreviousValues() {
    const stepFields = [
        "make", "model", "year", "colors", "mileage", "budget", "notes"
    ];
    const inputId = stepFields[currentStep - 1];
    if (inputId && formData[inputId]) {
        document.getElementById(inputId).value = formData[inputId];
    }
}

// Submit form to server
async function submitForm() {
    await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
    });
    window.location.href = "/thank-you";
}

// Initialize form
renderStep();


