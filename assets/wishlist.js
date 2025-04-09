/**
 * Wishlist functionality for CozyWhimsy Shopify theme
 * Provides add/remove from wishlist, synchronization between local storage and customer metafields
 */

class Wishlist {
  constructor() {
    this.storageKey = 'cozywhimsy_wishlist';
    this.wishlistItems = [];
    this.isLoggedIn = document.querySelector('body').classList.contains('customer-logged-in');
    this.events = {};
    
    this.init();
  }

  /**
   * Initialize the wishlist functionality
   */
  init() {
    // Load wishlist items from storage
    this.loadWishlist();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Update all wishlist buttons on the page
    this.updateWishlistButtons();
    
    // Update wishlist count in header
    this.updateWishlistCount();
  }

  /**
   * Set up event listeners for wishlist actions
   */
  setupEventListeners() {
    // Listen for clicks on wishlist buttons
    document.addEventListener('click', (event) => {
      const wishlistButton = event.target.closest('[data-wishlist-button]');
      if (wishlistButton) {
        event.preventDefault();
        const productId = wishlistButton.dataset.productId;
        this.toggleWishlistItem(productId);
      }
      
      // Listen for remove from wishlist button clicks
      const removeButton = event.target.closest('[data-wishlist-remove]');
      if (removeButton) {
        event.preventDefault();
        const productId = removeButton.dataset.productId;
        this.removeFromWishlist(productId);
      }
      
      // Listen for add all to cart button clicks
      const addAllButton = event.target.closest('[data-wishlist-add-all]');
      if (addAllButton) {
        event.preventDefault();
        this.addAllToCart();
      }
      
      // Listen for clear wishlist button clicks
      const clearButton = event.target.closest('[data-wishlist-clear]');
      if (clearButton) {
        event.preventDefault();
        this.clearWishlist();
      }
    });
  }

  /**
   * Load wishlist items from local storage or customer metafields
   */
  loadWishlist() {
    // For now, we'll just use local storage
    // In a full implementation, we would check if the user is logged in
    // and load from customer metafields if available
    const storedWishlist = localStorage.getItem(this.storageKey);
    
    if (storedWishlist) {
      try {
        this.wishlistItems = JSON.parse(storedWishlist);
      } catch (e) {
        console.error('Error parsing wishlist data:', e);
        this.wishlistItems = [];
      }
    }
  }

  /**
   * Save wishlist items to local storage or customer metafields
   */
  saveWishlist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.wishlistItems));
    
    // In a full implementation, we would also save to customer metafields
    // if the user is logged in
    if (this.isLoggedIn) {
      // This would be an AJAX call to a custom endpoint
      // that updates the customer metafields
    }
    
    // Trigger custom event for other components to listen to
    this.trigger('wishlist:updated', { wishlist: this.wishlistItems });
  }

  /**
   * Toggle a product in the wishlist (add if not present, remove if present)
   * @param {string} productId - The product ID to toggle
   */
  toggleWishlistItem(productId) {
    if (this.isInWishlist(productId)) {
      this.removeFromWishlist(productId);
    } else {
      this.addToWishlist(productId);
    }
  }

  /**
   * Add a product to the wishlist
   * @param {string} productId - The product ID to add
   */
  addToWishlist(productId) {
    if (!this.isInWishlist(productId)) {
      this.wishlistItems.push(productId);
      this.saveWishlist();
      this.updateWishlistButtons();
      this.updateWishlistCount();
      this.showNotification('Product added to wishlist');
    }
  }

  /**
   * Remove a product from the wishlist
   * @param {string} productId - The product ID to remove
   */
  removeFromWishlist(productId) {
    const index = this.wishlistItems.indexOf(productId);
    if (index !== -1) {
      this.wishlistItems.splice(index, 1);
      this.saveWishlist();
      this.updateWishlistButtons();
      this.updateWishlistCount();
      this.showNotification('Product removed from wishlist');
      
      // If on wishlist page, remove the product element
      const productElement = document.querySelector(`.wishlist-item[data-product-id="${productId}"]`);
      if (productElement) {
        productElement.classList.add('removing');
        setTimeout(() => {
          productElement.remove();
          
          // Check if wishlist is empty after removal
          if (this.wishlistItems.length === 0) {
            const wishlistGrid = document.querySelector('[data-wishlist-grid]');
            const emptyMessage = document.querySelector('[data-wishlist-empty]');
            
            if (wishlistGrid) {
              wishlistGrid.style.display = 'none';
            }
            
            if (emptyMessage) {
              emptyMessage.style.display = 'block';
            }
          }
        }, 300);
      }
    }
  }

  /**
   * Check if a product is in the wishlist
   * @param {string} productId - The product ID to check
   * @returns {boolean} - True if the product is in the wishlist, false otherwise
   */
  isInWishlist(productId) {
    return this.wishlistItems.includes(productId);
  }

  /**
   * Update all wishlist buttons on the page to reflect current wishlist state
   */
  updateWishlistButtons() {
    const buttons = document.querySelectorAll('[data-wishlist-button]');
    
    buttons.forEach(button => {
      const productId = button.dataset.productId;
      const isInWishlist = this.isInWishlist(productId);
      
      button.classList.toggle('in-wishlist', isInWishlist);
      
      // Update aria-label and title
      const ariaLabel = isInWishlist ? 'Remove from wishlist' : 'Add to wishlist';
      button.setAttribute('aria-label', ariaLabel);
      button.setAttribute('title', ariaLabel);
      
      // Update Font Awesome icon if it exists
      const icon = button.querySelector('i');
      if (icon) {
        if (isInWishlist) {
          icon.classList.remove('far');
          icon.classList.add('fas');
        } else {
          icon.classList.remove('fas');
          icon.classList.add('far');
        }
      }
    });
  }

  /**
   * Update the wishlist count in the header
   */
  updateWishlistCount() {
    const countElements = document.querySelectorAll('[data-wishlist-count]');
    const count = this.wishlistItems.length;
    
    countElements.forEach(element => {
      element.textContent = count;
      element.classList.toggle('hidden', count === 0);
    });
  }

  /**
   * Clear all items from the wishlist
   */
  clearWishlist() {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      this.wishlistItems = [];
      this.saveWishlist();
      this.updateWishlistButtons();
      this.updateWishlistCount();
      this.showNotification('Wishlist cleared');
      
      // If on wishlist page, update the UI
      const wishlistGrid = document.querySelector('[data-wishlist-grid]');
      const emptyMessage = document.querySelector('[data-wishlist-empty]');
      
      if (wishlistGrid) {
        wishlistGrid.style.display = 'none';
      }
      
      if (emptyMessage) {
        emptyMessage.style.display = 'block';
      }
    }
  }

  /**
   * Add all wishlist items to cart
   */
  async addAllToCart() {
    if (this.wishlistItems.length === 0) {
      this.showNotification('Your wishlist is empty');
      return;
    }
    
    const addAllButton = document.querySelector('[data-wishlist-add-all]');
    if (addAllButton) {
      addAllButton.classList.add('loading');
      addAllButton.disabled = true;
    }
    
    try {
      for (const productId of this.wishlistItems) {
        await this.addToCart(productId, 1);
      }
      
      this.showNotification('All items added to cart');
      
      // Optional: Clear wishlist after adding all to cart
      // this.clearWishlist();
      
      // Open cart drawer if it exists
      if (typeof window.openCartDrawer === 'function') {
        window.openCartDrawer();
      }
    } catch (error) {
      console.error('Error adding items to cart:', error);
      this.showNotification('Error adding items to cart. Please try again.');
    } finally {
      if (addAllButton) {
        addAllButton.classList.remove('loading');
        addAllButton.disabled = false;
      }
    }
  }

  /**
   * Add a single product to cart
   * @param {string} productId - The product ID to add
   * @param {number} quantity - The quantity to add
   * @returns {Promise} - A promise that resolves when the item is added
   */
  addToCart(productId, quantity = 1) {
    return new Promise((resolve, reject) => {
      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: productId,
          quantity: quantity
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.status && data.status !== 200) {
          reject(new Error(data.description || 'Error adding item to cart'));
        } else {
          resolve(data);
        }
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  /**
   * Show a notification message
   * @param {string} message - The message to show
   */
  showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.wishlist-notification');
    
    if (!notification) {
      notification = document.createElement('div');
      notification.className = 'wishlist-notification';
      document.body.appendChild(notification);
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.classList.add('active');
    
    // Hide notification after a delay
    setTimeout(() => {
      notification.classList.remove('active');
    }, 3000);
  }

  /**
   * Register an event handler
   * @param {string} event - The event name
   * @param {function} callback - The callback function
   */
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    this.events[event].push(callback);
  }

  /**
   * Trigger an event
   * @param {string} event - The event name
   * @param {object} data - The event data
   */
  trigger(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        callback(data);
      });
    }
  }
}

// Initialize wishlist when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.wishlist = new Wishlist();
});
