document.documentElement.classList.add('js');
const glow = document.querySelector('.cursor-glow');
window.addEventListener('pointermove', (event) => { if (glow) { glow.style.left = `${event.clientX}px`; glow.style.top = `${event.clientY}px`; } });
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }), { threshold: .13 });
document.querySelectorAll('.about,.skills,.work,.contact').forEach((section) => observer.observe(section));
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
