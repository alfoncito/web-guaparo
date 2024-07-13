import * as bs from "./bootstrap.js";

const main = () => {
  handleCarousel();
  handleShopsTape();
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
