// Select all nav links
const navLinks = document.querySelectorAll('.nav-link');

// Add click event listener to each nav link
navLinks.forEach(link => {
link.addEventListener('click', () => {
    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    // Add active class to the clicked link
    link.classList.add('active');
});
});