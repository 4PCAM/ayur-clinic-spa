// Accordion Component for 4-PCAM

class AccordionSPA {
  constructor(containerSelector = '.accordion-wrapper') {
    this.container = document.querySelector(containerSelector);
    this.activeItem = null;
    this.init();
  }

  init() {
    if (!this.container) {
      console.error('Accordion container not found');
      return;
    }

    this.attachEventListeners();
    this.initializeDefaultOpen();
  }

  attachEventListeners() {
    // Use event delegation for better performance
    this.container.addEventListener('click', (e) => {
      const header = e.target.closest('.accordion-header');
      if (header) {
        e.preventDefault();
        const item = header.closest('.accordion-item');
        if (item) {
          this.toggleItem(item);
        }
      }
    });

    // Keyboard navigation
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const header = e.target.closest('.accordion-header');
        if (header) {
          e.preventDefault();
          const item = header.closest('.accordion-item');
          if (item) {
            this.toggleItem(item);
          }
        }
      }
    });

    // Make headers focusable for keyboard navigation
    const headers = this.container.querySelectorAll('.accordion-header');
    headers.forEach(header => {
      header.setAttribute('tabindex', '0');
      header.setAttribute('role', 'button');
      header.setAttribute('aria-expanded', 'false');
    });
  }

  initializeDefaultOpen() {
    // Open first item by default
    const firstItem = this.container.querySelector('.accordion-item');
    if (firstItem) {
      this.openItem(firstItem, false); // false = no animation for initial state
    }
  }

  toggleItem(item) {
    const isActive = item.classList.contains('active');
    
    if (isActive) {
      this.closeItem(item);
    } else {
      // Close currently active item
      if (this.activeItem && this.activeItem !== item) {
        this.closeItem(this.activeItem);
      }
      this.openItem(item);
    }
  }

  openItem(item, animate = true) {
    const content = item.querySelector('.accordion-content');
    const header = item.querySelector('.accordion-header');
    
    if (!content) return;

    // Set active state
    item.classList.add('active');
    this.activeItem = item;

    // Update aria attributes
    if (header) {
      header.setAttribute('aria-expanded', 'true');
    }

    // Animate opening
    if (animate) {
      // Get the content height
      content.style.maxHeight = 'none';
      const height = content.scrollHeight;
      content.style.maxHeight = '0';
      
      // Force reflow
      content.offsetHeight;
      
      // Animate to full height
      content.style.maxHeight = height + 'px';
      
      // Clean up after animation
      setTimeout(() => {
        if (item.classList.contains('active')) {
          content.style.maxHeight = 'none';
        }
      }, 500);
    } else {
      content.style.maxHeight = 'none';
    }

    // Scroll to item if needed
    this.scrollToItem(item);

    // Trigger custom event
    item.dispatchEvent(new CustomEvent('accordion:opened', {
      bubbles: true,
      detail: { item }
    }));
  }

  closeItem(item) {
    const content = item.querySelector('.accordion-content');
    const header = item.querySelector('.accordion-header');
    
    if (!content) return;

    // Get current height for animation
    const height = content.scrollHeight;
    content.style.maxHeight = height + 'px';
    
    // Force reflow
    content.offsetHeight;
    
    // Animate to closed
    content.style.maxHeight = '0';

    // Remove active state
    item.classList.remove('active');
    if (this.activeItem === item) {
      this.activeItem = null;
    }

    // Update aria attributes
    if (header) {
      header.setAttribute('aria-expanded', 'false');
    }

    // Trigger custom event
    item.dispatchEvent(new CustomEvent('accordion:closed', {
      bubbles: true,
      detail: { item }
    }));
  }

  scrollToItem(item) {
    // Smooth scroll to the item with some offset
    const rect = item.getBoundingClientRect();
    const offset = 100; // Offset from top
    
    if (rect.top < offset) {
      window.scrollTo({
        top: window.pageYOffset + rect.top - offset,
        behavior: 'smooth'
      });
    }
  }

  // Public API methods
  openItemById(itemId) {
    const item = this.container.querySelector(`[data-item="${itemId}"]`);
    if (item) {
      this.openItem(item);
    }
  }

  closeItemById(itemId) {
    const item = this.container.querySelector(`[data-item="${itemId}"]`);
    if (item) {
      this.closeItem(item);
    }
  }

  closeAll() {
    const activeItems = this.container.querySelectorAll('.accordion-item.active');
    activeItems.forEach(item => this.closeItem(item));
  }

  getActiveItem() {
    return this.activeItem;
  }

  // Add new accordion item dynamically
  addItem(itemData) {
    const { id, title, subtitle, icon, content, className = '' } = itemData;
    
    const itemHTML = `
      <div class="accordion-item ${className}" data-item="${id}">
        <button class="accordion-header" tabindex="0" role="button" aria-expanded="false">
          <div class="accordion-header-content">
            ${icon ? `<div class="accordion-icon">${icon}</div>` : ''}
            <div class="accordion-title-wrapper">
              <h3 class="accordion-title">${title}</h3>
              ${subtitle ? `<p class="accordion-subtitle">${subtitle}</p>` : ''}
            </div>
          </div>
          <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </button>
        <div class="accordion-content">
          ${content}
        </div>
      </div>
    `;
    
    this.container.insertAdjacentHTML('beforeend', itemHTML);
  }

  // Remove accordion item
  removeItem(itemId) {
    const item = this.container.querySelector(`[data-item="${itemId}"]`);
    if (item) {
      if (this.activeItem === item) {
        this.activeItem = null;
      }
      item.remove();
    }
  }

  // Destroy accordion
  destroy() {
    if (this.container) {
      this.container.removeEventListener('click', this.handleClick);
      this.container.removeEventListener('keydown', this.handleKeydown);
    }
  }
}