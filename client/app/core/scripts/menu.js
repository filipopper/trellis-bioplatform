const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("nav-links");

if (menuToggle && navLinks) {
  const menuLinks = navLinks.querySelectorAll("a");

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("show");
    });
  });
}
