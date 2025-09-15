// Toast Notification Component for 4-PCAM

class Toast {
  constructor(containerSelector = '#toast-container') {
    this.container = document.querySelector(containerSelector);
    this.toasts = new Map();
    this.defaultDuration = 5000;
    this.maxToasts = 5;
    
    if (!this.container) {
      console.error('Toast container not found');
    }
  }

  show(title, message, type = 'info', options = {}) {
    if (!this.container) return null;

    const toastId = this.generateId();
    const duration = options.duration || this.defaultDuration;
    const persistent = options.persistent || false;

    // Create toast element
    const toast = this.createToastElement(toastId, title, message, type, persistent);
    
    // Add to container
    this.container.appendChild(toast);
    
    // Store toast reference
    this.toasts.set(toastId, {
      element: toast,
      timer: null,
      type: type
    });

    // Trigger enter animation
    setTimeout(() => {
      toast.classList.add('entered');
    }, 10);

    // Auto-remove after duration (unless persistent)
    if (!persistent) {
      const timer = setTimeout(() => {
        this.remove(toastId);
      }, duration);
      
      this.toasts.get(toastId).timer = timer;
    }

    // Limit number of toasts
    this.limitToasts();

    return toastId;
  }

  createToastElement(id, title, message, type, persistent) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.dataset.toastId = id;
    
    const iconSVG = this.getIconSVG(type);
    
    toast.innerHTML = `
      <div class="toast-icon">
        ${iconSVG}
      </div>
      <div class="toast-content">
        <div class="toast-title">${this.escapeHTML(title)}</div>
        ${message ? `<div class="toast-message">${this.escapeHTML(message)}</div>` : ''}
      </div>
      <button class="toast-close" aria-label="Close notification">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;

    // Add click handlers
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
      this.remove(id);
    });

    // Close on click (unless persistent)
    if (!persistent) {
      toast.addEventListener('click', (e) => {
        if (e.target !== closeButton && !closeButton.contains(e.target)) {
          this.remove(id);
        }
      });
    }

    // Pause auto-remove on hover
    toast.addEventListener('mouseenter', () => {
      this.pauseTimer(id);
    });

    toast.addEventListener('mouseleave', () => {
      this.resumeTimer(id);
    });

    return toast;
  }

  getIconSVG(type) {
    const icons = {
      success: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
      `,
      error: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      `,
      warning: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      `,
      info: `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
      `
    };

    return icons[type] || icons.info;
  }

  remove(toastId) {
    const toastData = this.toasts.get(toastId);
    if (!toastData) return;

    const { element, timer } = toastData;

    // Clear timer
    if (timer) {
      clearTimeout(timer);
    }

    // Add exit animation
    element.classList.add('exiting');

    // Remove after animation
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.toasts.delete(toastId);
    }, 300);
  }

  pauseTimer(toastId) {
    const toastData = this.toasts.get(toastId);
    if (toastData && toastData.timer) {
      clearTimeout(toastData.timer);
      toastData.timer = null;
    }
  }

  resumeTimer(toastId) {
    const toastData = this.toasts.get(toastId);
    if (toastData && !toastData.timer) {
      const timer = setTimeout(() => {
        this.remove(toastId);
      }, 2000); // Resume with shorter duration
      
      toastData.timer = timer;
    }
  }

  limitToasts() {
    if (this.toasts.size > this.maxToasts) {
      // Remove oldest toast
      const oldestId = this.toasts.keys().next().value;
      this.remove(oldestId);
    }
  }

  // Convenience methods
  success(title, message, options = {}) {
    return this.show(title, message, 'success', options);
  }

  error(title, message, options = {}) {
    return this.show(title, message, 'error', { ...options, duration: 8000 });
  }

  warning(title, message, options = {}) {
    return this.show(title, message, 'warning', options);
  }

  info(title, message, options = {}) {
    return this.show(title, message, 'info', options);
  }

  // Clear all toasts
  clear() {
    this.toasts.forEach((_, toastId) => {
      this.remove(toastId);
    });
  }

  // Update existing toast
  update(toastId, title, message) {
    const toastData = this.toasts.get(toastId);
    if (!toastData) return false;

    const titleElement = toastData.element.querySelector('.toast-title');
    const messageElement = toastData.element.querySelector('.toast-message');

    if (titleElement) {
      titleElement.textContent = title;
    }

    if (messageElement && message) {
      messageElement.textContent = message;
    }

    return true;
  }

  // Utility methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Get count of active toasts by type
  getCount(type = null) {
    if (type) {
      return Array.from(this.toasts.values()).filter(toast => toast.type === type).length;
    }
    return this.toasts.size;
  }

  // Check if toast exists
  exists(toastId) {
    return this.toasts.has(toastId);
  }
}