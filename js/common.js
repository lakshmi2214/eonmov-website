window.addEventListener("scroll", function () {
  const nav = document.getElementById("mainNavbar");
  if (!nav) return;

  if (window.scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});

window.addEventListener("DOMContentLoaded", function () {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  // Mobile Navigation Functionality
  initMobileNavigation();
});

function initMobileNavigation() {
  // Set active navigation item based on current page
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop().replace('.html', '') || 'home';
  
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
  
  mobileNavItems.forEach(item => {
    const page = item.getAttribute('data-page');
    
    // Remove active class from all items
    item.classList.remove('active');
    
    // Add active class to current page
    if (page === currentPage || 
        (currentPage === '' && page === 'home') ||
        (currentPage === 'index' && page === 'home')) {
      item.classList.add('active');
    }
    
    // Add click event for smooth transitions
    item.addEventListener('click', function(e) {
      // Add ripple effect
      createRipple(e, item);
    });
  });

  // Add touch feedback for mobile navigation
  if ('ontouchstart' in window) {
    mobileNavItems.forEach(item => {
      item.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
      });
      
      item.addEventListener('touchend', function() {
        this.style.transform = '';
      });
    });
  }
}

// Create ripple effect for mobile navigation
function createRipple(event, element) {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  
  element.appendChild(ripple);
  
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Add CSS for ripple effect
const rippleCSS = `
  .mobile-nav-item {
    position: relative;
    overflow: hidden;
  }
  
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(0, 135, 78, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

// Inject ripple CSS
if (!document.querySelector('#ripple-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'ripple-styles';
  styleSheet.textContent = rippleCSS;
  document.head.appendChild(styleSheet);
}

// Handle safe area for mobile devices
function updateMobileNavPadding() {
  const mobileNav = document.getElementById('mobileBottomNav');
  if (mobileNav) {
    const safeAreaBottom = getComputedStyle(document.documentElement)
      .getPropertyValue('env(safe-area-inset-bottom)') || '0px';
    
    // Update padding to account for safe area
    mobileNav.style.paddingBottom = `calc(8px + ${safeAreaBottom})`;
  }
}

// Update on orientation change
window.addEventListener('orientationchange', updateMobileNavPadding);
window.addEventListener('resize', updateMobileNavPadding);

// Initialize safe area padding
updateMobileNavPadding();
