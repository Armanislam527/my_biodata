document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-link");

  const observerOptions = {
    root: null, // defaults to the browser viewport
    rootMargin: "-20% 0px -60% 0px", // Adjusts the "trigger zone" down from the top
    threshold: 0,
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      // Check if the section has entered the trigger zone area
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        // Remove the active class from all links
        navLinks.forEach((link) => link.classList.remove("active"));

        // Add the active class to the link matching the current section's ID
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) {
          activeLink.classList.add("active");
        }
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Track each section
  sections.forEach((section) => observer.observe(section));
});
