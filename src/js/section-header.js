const parallaxHeader = () => {
  let $header = document.getElementById("section-header");

  window.addEventListener("scroll", () => {
    let y = Math.round(window.scrollY * 0.3);

    $header.setAttribute("style", `--position-y: ${y}px`);
  });
};

document.addEventListener("DOMContentLoaded", parallaxHeader);
