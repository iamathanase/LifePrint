// SweetAlert2 Notification Manager
const Notify = {
    // Success notification
    success(title, message = '', options = {}) {
        return Swal.fire({
            icon: 'success',
            title: title,
            text: message,
            showConfirmButton: true,
            confirmButtonColor: '#667eea',
            timer: options.timer || 3000,
            timerProgressBar: true,
            ...options
        });
    },

    // Error notification
    error(title, message = '', options = {}) {
        return Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            showConfirmButton: true,
            confirmButtonColor: '#667eea',
            ...options
        });
    },

    // Warning notification
    warning(title, message = '', options = {}) {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: message,
            showConfirmButton: true,
            confirmButtonColor: '#667eea',
            ...options
        });
    },

    // Info notification
    info(title, message = '', options = {}) {
        return Swal.fire({
            icon: 'info',
            title: title,
            text: message,
            showConfirmButton: true,
            confirmButtonColor: '#667eea',
            ...options
        });
    },

    // Question/Confirm dialog
    confirm(title, message = '', options = {}) {
        return Swal.fire({
            icon: 'question',
            title: title,
            text: message,
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            cancelButtonColor: '#d33',
            confirmButtonText: options.confirmText || 'Yes',
            cancelButtonText: options.cancelText || 'Cancel',
            ...options
        });
    },

    // Toast notification (bottom-right corner)
    toast(message, type = 'success', options = {}) {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: options.timer || 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });

        return Toast.fire({
            icon: type,
            title: message,
            ...options
        });
    },

    // Loading notification
    loading(title = 'Loading...', message = '') {
        return Swal.fire({
            title: title,
            text: message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
    },

    // Close any open notification
    close() {
        Swal.close();
    },

    // Custom styled notification with image
    custom(options) {
        return Swal.fire({
            confirmButtonColor: '#667eea',
            ...options
        });
    }
};

// Helper function for API error handling
Notify.apiError = function(error) {
    const message = error?.message || error?.error || 'An unexpected error occurred';
    return this.error('Oops!', message);
};

// Helper function for form validation errors
Notify.validationError = function(message = 'Please fill in all required fields') {
    return this.warning('Validation Error', message);
};

// Helper function for authentication errors
Notify.authError = function(message = 'Authentication failed') {
    return this.error('Authentication Error', message);
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Notify;
}
