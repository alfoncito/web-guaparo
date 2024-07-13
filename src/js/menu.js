import * as bs from "./bootstrap.js";
import breakpoint from "./breakpoint.js";

const handleMenu = () => {
  let $menu = document.getElementById("menu"),
    $btnMenu = document.getElementById("btn-menu"),
    $navMenu = document.getElementById("nav-menu"),
    collapseMenu = new bs.Collapse($navMenu, {
      toggle: false,
    }),
    media = matchMedia(breakpoint.md);

  const MIN_SCROLL_NAV_VISIBLE = 200;

  media.onchange = () => {
    if (media.matches) $navMenu.classList.remove("show");
  };

  $btnMenu.addEventListener("click", () => {
    collapseMenu.toggle();
  });

  window.addEventListener("scroll", () => {
    if (window.scrollY >= MIN_SCROLL_NAV_VISIBLE)
      $menu.classList.remove("opacity");
    else $menu.classList.add("opacity");
  });
};

document.addEventListener("DOMContentLoaded", handleMenu);
