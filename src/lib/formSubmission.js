/**
 * Form Submission - A lightweight form handling library
 * Author: Your Name
 * License: MIT
 */

class FormSubmission {
    constructor(formId, options) {
        this.form = document.getElementById(formId);
        this.options = {
            url: '', // URL to submit the form data
            method: 'POST', // HTTP method
            successMessage: 'Form submitted successfully!',
            errorMessage: 'There was an error submitting the form.',
            validation: true, // Enable or disable validation
            ...options
        };

        this.init();
    }

    init() {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            if (this.options.validation && !this.validateForm()) {
                return;
            }
            this.submitForm();
        });
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                isValid = false;
                this.showError(input, input.validationMessage);
            } else {
                this.clearError(input);
            }
        });

        return isValid;
    }

    showError(input, message) {
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        input.classList.add('input-error');
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }

    clearError(input) {
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        input.classList.remove('input-error');
    }

    async submitForm() {
        const formData = new FormData(this.form);
        try {
            const response = await fetch(this.options.url, {
                method: this.options.method,
                body: formData,
            });

            if (!response.ok) {
                throw new Error(this.options.errorMessage);
            }

            const result = await response.json();
            this.handleSuccess(result);
        } catch (error) {
            this.handleError(error);
        }
    }

    handleSuccess(result) {
        alert(this.options.successMessage);
        this.form.reset(); // Reset the form after successful submission
        console.log('Success:', result);
    }

    handleError(error) {
        alert(error.message || this.options.errorMessage);
        console.error('Error:', error);
    }
}

// Usage
document.addEventListener('DOMContentLoaded', () => {
    const formSubmission = new FormSubmission('myForm', {
        url: '/submit', // Set your form submission URL
        method: 'POST', // Set the HTTP method
        successMessage: 'Thank you for your submission!',
        errorMessage: 'Oops! Something went wrong. Please try again.',
        validation: true // Enable validation
    });
});
