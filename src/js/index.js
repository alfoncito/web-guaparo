import * as bs from "./bootstrap.js";

const breakPoints = {
  sm: "(min-width: 576px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 992px)",
  xl: "(min-width: 1200px)",
  xxl: "(min-width: 1400px)",
};

const main = () => {
  handleMenu();
  handleCarousel();
  handleShopsTape();
  enableTooltips();
};

const handleMenu = () => {
  let $btnMenu = document.getElementById("btn-menu"),
    $navMenu = document.getElementById("nav-menu"),
    collapseMenu = new bs.Collapse($navMenu, {
      toggle: false,
    }),
    media = matchMedia(breakPoints.md);

  media.onchange = () => {
    if (media.matches) $navMenu.classList.remove("show");
  };

  $btnMenu.addEventListener("click", () => {
    collapseMenu.toggle();
  });
};

const handleCarousel = () => {
  let $carousel = document.getElementById("gp-carousel"),
    carousel = new bs.Carousel($carousel, {
      interval: 4000,
      pause: "hover",
      touch: true,
    });

  carousel.cycle();
  $carousel.addEventListener("mouseleave", () => carousel.cycle());
};

const handleShopsTape = () => {
  let tapes = document.querySelectorAll(".shops-tape");

  tapes.forEach((tape) => {
    tape.addEventListener("mousemove", (e) => {
      // console.log("Moviendo");
    });
  });
};

const enableTooltips = () => {
  let tooltipTargets = document.querySelectorAll(".shop-logo-card");

  tooltipTargets.forEach((tg) => {
    new bs.Tooltip(tg, {
      title: "Nombre tienda",
      placement: "bottom",
      customClass: "shoop-tooltip",
      offset: [0, 20],
      delay: 200,
    });
  });
};

document.addEventListener("DOMContentLoaded", main);
