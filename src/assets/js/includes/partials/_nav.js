export function slideInNavLink() {
  window.addEventListener("resize", () => {
    const menuItems = document.querySelectorAll("nav.primary ul li a");
    if (window.innerWidth >= 740) {
      menuItems.forEach((menuItem) =>
        menuItem.classList.remove("activeSlideIn"),
      );
    }
  });

  const burger = document.querySelector(".burger");

  burger.addEventListener("click", (e) => {
    let menuItems = document.querySelectorAll("nav.primary ul li a");
    const reverse = Array.from(menuItems).every((link) =>
      link.classList.contains("activeSlideIn"),
    );

    if (reverse) {
      menuItems = [...menuItems].reverse();
    }

    burger.classList.toggle("active");
    menuItems.forEach((menuItem, i) => {
      setTimeout(
        () => menuItem.classList.toggle("activeSlideIn"),
        (i + 1) * 150,
      );
    });
  });
}
