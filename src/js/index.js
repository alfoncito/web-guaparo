import * as bs from "./bootstrap.js";

const main = () => {
  handleCarousel();
  enableTooltips();
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
  let tapes = document.querySelectorAll(".shops-tape__anim");

  tapes.forEach(($tape) => {
    // let translateX = $tape.scrollWidth / 2 + getScrollBarWidth();
    let translateX = $tape.scrollWidth / 2 + 12;
    
    $tape.setAttribute("style", `--translate-x: ${translateX}px`);
  });
};

const enableTooltips = () => {
  let tooltipTargets = document.querySelectorAll(".shop-logo-card");

  tooltipTargets.forEach((tg) => {
    new bs.Tooltip(tg, {
      title: "Nombre tienda",
      placement: "bottom",
      customClass: "shop-tooltip",
      offset: [0, 20],
      delay: 200,
    });
  });
};

const getScrollBarWidth = () => {
  return window.innerWidth - document.documentElement.getBoundingClientRect().width
};

document.addEventListener("DOMContentLoaded", main);
window.addEventListener("load", () => handleShopsTape());
