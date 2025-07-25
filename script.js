// Performance optimization utilities
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Mobile Navigation Toggle - O(1) time complexity
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link - O(n) where n is number of links
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links - O(n) where n is number of anchor links
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            console.log('Clicked link:', href);
            console.log('Target element:', target);
            
            if (target) {
                // Account for fixed navbar height
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            } else {
                console.log('Target not found for:', href);
            }
        });
    });
});

// Optimized navbar background change on scroll - O(1) with debouncing
const navbar = document.querySelector('.navbar');
const updateNavbar = () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
};

window.addEventListener('scroll', throttle(updateNavbar, 16)); // ~60fps

// Form submission handling - O(1) time complexity
const contactForm = document.querySelector('.contact-form form');
if (contactForm && contactForm.id !== 'calendarBookingForm') {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Remove or comment out the simulated API call and thank you alert to prevent duplicate popups
        // setTimeout(() => {
        //     alert('Thank you for your inquiry! We will contact you soon to confirm your appointment.');
        //     this.reset();
        //     submitBtn.textContent = originalText;
        //     submitBtn.disabled = false;
        // }, 2000);
    });
}

// --- Real-time validation for booking form with 'touched' state ---
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('calendarBookingForm');
  if (!form) return;
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const submitBtn = form.querySelector('button[type="submit"]');
  const errorBox = document.getElementById('form-error');
  const successBox = document.getElementById('form-success');

  // Track if a field has been touched (focused and blurred)
  const touched = { name: false, email: false, phone: false };

  function validateName(name) {
    return name.trim().length > 0;
  }
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function validatePhone(phone) {
    return /^[\+]?[0-9\s\-\(\)]{10,}$/.test(phone);
  }

  function updateValidation() {
    let valid = true;
    let msg = '';
    if (touched.name && !validateName(nameInput.value)) {
      valid = false;
      msg = 'Please enter your name.';
    } else if (touched.email && !validateEmail(emailInput.value)) {
      valid = false;
      msg = 'Please enter a valid email address.';
    } else if (touched.phone && !validatePhone(phoneInput.value)) {
      valid = false;
      msg = 'Please enter a valid phone number.';
    }
    if (!valid) {
      errorBox.textContent = msg;
      errorBox.style.display = 'block';
      submitBtn.disabled = true;
    } else {
      errorBox.textContent = '';
      errorBox.style.display = 'none';
      // Only enable if all fields are valid
      if (validateName(nameInput.value) && validateEmail(emailInput.value) && validatePhone(phoneInput.value)) {
        submitBtn.disabled = false;
      } else {
        submitBtn.disabled = true;
      }
    }
  }

  // Mark field as touched on blur
  nameInput.addEventListener('blur', function() { touched.name = true; updateValidation(); });
  emailInput.addEventListener('blur', function() { touched.email = true; updateValidation(); });
  phoneInput.addEventListener('blur', function() { touched.phone = true; updateValidation(); });

  // Validate on input, but only show error if touched
  nameInput.addEventListener('input', updateValidation);
  emailInput.addEventListener('input', updateValidation);
  phoneInput.addEventListener('input', updateValidation);

  // Initial state: no errors, button disabled until all valid
  errorBox.textContent = '';
  errorBox.style.display = 'none';
  submitBtn.disabled = true;

  // --- Booking form submit ---
  form.addEventListener('submit', async function(ev) {
    ev.preventDefault();
    errorBox.style.display = 'none';
    errorBox.textContent = '';
    successBox.style.display = 'none';
    successBox.textContent = '';
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const packageVal = document.getElementById('package').value;
    const date = document.getElementById('calendarDate') ? document.getElementById('calendarDate').value : '';
    const slot = document.getElementById('slot') ? document.getElementById('slot').value : '';
    const message = document.getElementById('message').value.trim();

    // Final check for required fields (in case user bypassed real-time validation)
    if (!name || !phone || !email || !packageVal || !date || !slot) {
      errorBox.textContent = 'Please fill in all required fields and select a time slot.';
      errorBox.style.display = 'block';
      return;
    }

    // Save to Supabase
    const { error } = await supabase.from('appointments').insert({
      name, phone, email, package: packageVal, date, slot, message
    });
    if (!error) {
      errorBox.style.display = 'none';
      successBox.textContent = 'Your appointment has been booked! We will call you for confirmation.';
      successBox.style.display = 'block';
      form.reset();
      // Reset touched state
      touched.name = false; touched.email = false; touched.phone = false;
      updateValidation();
    } else {
      // Log the full error object for debugging
      console.error('Supabase booking error:', error, typeof error, JSON.stringify(error));
      console.log('Error handler running', error);
      function findDuplicateError(obj) {
        if (!obj) return false;
        if (typeof obj === 'object') {
          if (obj.code === '23505') return true;
          for (const key in obj) {
            if (findDuplicateError(obj[key])) return true;
          }
        }
        if (Array.isArray(obj)) {
          for (const item of obj) {
            if (findDuplicateError(item)) return true;
          }
        }
        return false;
      }
      let msg = '';
      if (findDuplicateError(error)) {
        msg = 'You have already booked a slot for this day. Only one session is allowed per user per day.';
      } else {
        msg = 'There was an error booking your appointment.<br><br>';
        msg += '<b>Full error object:</b><br><pre style="white-space:pre-wrap;word-break:break-all;">' + JSON.stringify(error, null, 2) + '</pre>';
      }
      errorBox.innerHTML = msg;
      errorBox.style.display = 'block';
      successBox.style.display = 'none';
    }
  });
});

// Make date input open calendar on any click
document.addEventListener('DOMContentLoaded', function() {
  const dateInput = document.getElementById('calendarDate');
  if (dateInput) {
    dateInput.addEventListener('click', function() {
      if (typeof dateInput.showPicker === 'function') {
        dateInput.showPicker();
      } else {
        dateInput.focus();
      }
    });
    
    // Add placeholder functionality for date input
    dateInput.addEventListener('focus', function() {
      if (!this.value) {
        this.style.color = '#333';
      }
    });
    
    dateInput.addEventListener('blur', function() {
      if (!this.value) {
        this.style.color = '#999';
      }
    });
    
    // Set initial placeholder state
    if (!dateInput.value) {
      dateInput.style.color = '#999';
    }
  }
});

// Optimized intersection observer for animations - O(n) where n is number of elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, observerOptions);

// Observe elements for animation - O(n) initialization
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .service-card, .testimonial-card, .pricing-card');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Optimized counter animation - O(1) time complexity per counter
function animateCounter(element, target, duration = 2000) {
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentValue = Math.floor(startValue + (target - startValue) * progress);
        element.textContent = currentValue + '+';
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Initialize counters when they come into view - O(n) where n is number of counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const value = target.textContent;
            if (value.includes('25+')) {
                animateCounter(target, 25);
            } else if (value.includes('30,000+')) {
                animateCounter(target, 30000);
            }
            counterObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

// Observe credential counters
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.credential span');
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});

// Simple image loading - O(n) where n is number of images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Set initial opacity
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        // Show image when loaded
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });
        
        // Show image immediately if already loaded
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
});

// Optimized pricing card hover effects - O(n) where n is number of pricing cards
document.addEventListener('DOMContentLoaded', () => {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            pricingCards.forEach(c => c.style.transform = 'scale(0.95)');
            card.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            pricingCards.forEach(c => {
                if (c.classList.contains('featured')) {
                    c.style.transform = 'scale(1.05)';
                } else {
                    c.style.transform = 'scale(1)';
                }
            });
        });
    });
});

// WhatsApp integration - O(1) time complexity
function openWhatsApp() {
    const phone = '919876543210';
    const message = 'Hi, I would like to book a Quantum Health Analysis appointment.';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// Add WhatsApp button functionality
document.addEventListener('DOMContentLoaded', () => {
    const whatsappBtn = document.querySelector('.social-links a[href="#"]');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openWhatsApp();
        });
    }
});

// Optimized back to top button - O(1) time complexity
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 1.2rem;
    `;
    
    document.body.appendChild(backToTop);
    
    // Show/hide button based on scroll with throttling
    const updateBackToTop = () => {
        if (window.scrollY > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    };
    
    window.addEventListener('scroll', throttle(updateBackToTop, 16));
    
    // Scroll to top when clicked
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', createBackToTopButton);

// Service Worker Registration for caching
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
} 

// --- Pricing package button: select package and scroll to booking ---
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.select-package-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // 1. Set the package dropdown value
      const pkg = btn.getAttribute('data-package');
      const packageDropdown = document.getElementById('package');
      if (packageDropdown) {
        packageDropdown.value = pkg;
        // 2. Briefly highlight the dropdown
        packageDropdown.classList.add('highlight-package');
        setTimeout(() => packageDropdown.classList.remove('highlight-package'), 1200);
      }
      // 3. Scroll to the Book Your Appointment section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = contactSection.offsetTop - navbarHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
}); 