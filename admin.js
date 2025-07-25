document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('admin-login-form');
  const errorBox = document.getElementById('admin-login-error');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    errorBox.style.display = 'none';
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    if (email === 'healthcarerichlife@gmail.com' && password === 'Richlife123') {
      window.location.href = 'admin-dashboard.html';
    } else {
      errorBox.textContent = 'Invalid email or password.';
      errorBox.style.display = 'block';
    }
  });
}); 