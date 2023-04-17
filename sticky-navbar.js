window.addEventListener('scroll', function() {
    console.log('scrollY:', window.scrollY);
    var navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });