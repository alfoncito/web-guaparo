import * as bs from "./bootstrap.js";

const API_SHOPS = "/api/all-shops-info.json";

let shops;

const main = () => {
  loadShopsCard();
  handleFilter();
  handleClickShopCard();
};

const loadShopsCard = () => {
  fetch(API_SHOPS)
    .then((res) => res.json())
    .then((shopsResult) => {
      shops = sortShops(shopsResult);
      renderShops(shops);
    });
};

const handleClickShopCard = () => {
  const showModal = setupModal();

  document.addEventListener("click", (e) => {
    if (
      e.target.matches(".js-shop-card") ||
      e.target.matches(".js-shop-card *")
    ) {
      let $card = e.target.closest(".js-shop-card"),
        shop = shops.find((s) => s.name === $card.dataset.shopName);

      showModal(shop);
    }
  });
};

const setupModal = () => {
  let $shopModal = document.getElementById("shop-modal"),
    $modalBody = $shopModal.querySelector(".modal-body"),
    $modalHeader = $shopModal.querySelector(".modal-header"),
    modal = new bs.Modal($shopModal, { backdrop: "static" }),
    _shop;

  $shopModal.addEventListener("show.bs.modal", () => {
    fetch(_shop.apiPath)
      .then((res) => res.json())
      .then((fullInfoShop) => {
        $modalHeader.insertAdjacentHTML(
          "afterbegin",
          createModalHeaderHTMLContent(fullInfoShop),
        );
        $modalBody.insertAdjacentHTML(
          "beforeend",
          createModalBodyHTMLContent(fullInfoShop),
        );
        modal.handleUpdate();
      });
  });

  $shopModal.addEventListener("hidden.bs.modal", () => {
    $modalHeader.innerHTML = "";
    $modalBody.innerHTML = "";
  });

  return (shop) => {
    _shop = shop;
    modal.show();
  };
};

const createModalHeaderHTMLContent = (shop) => {
  return `
    <img class="menu-logo d-lg-none" src="${shop.logo}" alt="${shop.name}" />
    <h4 class="px-3 d-lg-none">${shop.name}</h4>
    <button
        class="btn-close"
        type="button"
        data-bs-dismiss="modal"
        aria-label="close"
    ></button>
  `;
};

const createModalBodyHTMLContent = (shop) => {
  return `
    <div class="row g-0">
      <div class="col p-3 d-none d-lg-block col-lg-3">
        <div class="sticky-top">
          <img class="large-logo d-block mx-auto" src="${shop.logo}" alt="${shop.name}" />
          <p>Local ${shop.local}</p>
          ${createModalContactHTML(shop)}
          ${createModalSocialMediaHTML(shop)}
          </div>
          </div>
          <div class="col col-lg-9">
          ${createModalCarouselElement(shop)}
          <div class="p-3">
          <h4 class="d-none d-lg-block">${shop.name}</h4>
          <div class="d-flex justify-content-between d-lg-none">
          <p>Local ${shop.local ?? "No se"}</p>
          ${createModalSocialMediaHTML(shop)}
          </div>
          <p>${shop.description ?? "Descripción no disponible"}</p>
          ${createModalContactHTML(shop, "d-lg-none")}
        </div>
      </div>
    </div>
  `;
};

const createModalSocialMediaHTML = (shop) => {
  let socialMediaHTML = "";

  const socialMediaClass = {
    instagram: "instagram",
    twitter: "twitter-x",
    facebook: "facebook",
    web: "globe",
    whatsapp: "whatsapp",
  };

  for (let [socialMedia, link] of Object.entries(shop.socialMedia)) {
    socialMediaHTML += `
      <a class="text-decoration-none" href="${link}" rel="nofollow" target="_blank">
        <i class="bi bi-${socialMediaClass[socialMedia]}"></i>
      </a>
    `;
  }

  return `<div>${socialMediaHTML}</div>`;
};

const createModalCarouselElement = (shop) => {
  let $modalCarousel = document.createElement("div");

  $modalCarousel.classList.add("carousel", "slide", "p-lg-3");
  $modalCarousel.setAttribute("id", "modal-carousel");
  $modalCarousel.insertAdjacentHTML(
    "afterbegin",
    `
      <div class="carousel-inner">
        ${createModalCaruselItemsHTML(shop.images)}
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#${$modalCarousel.id}" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previus</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#${$modalCarousel.id}" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    `,
  );

  new bs.Carousel($modalCarousel);
  return $modalCarousel.outerHTML;
};

const createModalCaruselItemsHTML = (images) => {
  let items = "";

  images.forEach((img, index) => {
    items += `
      <div class="carousel-item carousel-shop-item ${index === 0 ? "active" : ""}">
        <img class="carousel-shop-item__img" src="${img.src}" alt="${img.alt}" />
      </div>
    `;
  });
  return items;
};

const createModalContactHTML = (shop, customClass = "") => {
  let contact = "";

  if (!shop.contact) return "";

  if (shop.contact.phone)
    contact += `<p><i class="bi bi-telephone"></i> ${shop.contact.phone}</p>`;
  if (shop.contact.mail)
    contact += `<p><i class="bi bi-envelope-at"></i> ${shop.contact.mail}</p>`;

  if (contact === "") return "";

  return `
    <div class="${customClass}">
      <h5>Contacto</h5>
      ${contact}
    </div>
  `;
};

const renderShops = (shops) => {
  let $cardsContainer,
    currentCategory,
    $target = document.getElementById("shops-card-target"),
    $frag = document.createDocumentFragment();

  $target.innerHTML = "";
  shops.forEach((shop) => {
    if (currentCategory !== shop.category) {
      currentCategory = shop.category;
      if ($cardsContainer) $frag.appendChild($cardsContainer);
      $frag.appendChild(createCategoryTitle(currentCategory));
      $cardsContainer = createCardsContainer();
    }

    $cardsContainer.appendChild(createShopCard(shop));
  });
  $frag.appendChild($cardsContainer);
  $target.appendChild($frag);
};

const createCardsContainer = () => {
  let $container = document.createElement("div");

  $container.classList.add("row", "row-cols-3");
  return $container;
};

const createCategoryTitle = (title) => {
  let $title = document.createElement("h2");

  $title.textContent = title.toUpperCase();
  return $title;
};

const createShopCard = (shop) => {
  let $card = document.createElement("div");

  $card.classList.add("col", "js-shop-card");
  $card.dataset.shopName = shop.name;
  $card.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="card my-3">
      <img src="${shop.logo}" class="card-img-top logo mx-auto" alt="${shop.name}">
      <div class="card-body">
        <h5 class="card-title text-center">${shop.name.toUpperCase()}</h5>
      </div>
    </div>
  `,
  );
  return $card;
};

const sortShops = (shops) => {
  return shops
    .sort((sa, sb) => (sa.name < sb.name ? -1 : 1))
    .sort((sa, sb) => (sa.category < sb.category ? -1 : 1));
};

const handleFilter = () => {
  let checksFilter = document.querySelectorAll(".js-check-filter"),
    $btnAppplyFilter = document.getElementById("btn-apply-filter"),
    $btnShowAll = document.getElementById("btn-show-all");

  $btnAppplyFilter.addEventListener("click", () => {
    let filters = [],
      shopsFiltered = [];

    checksFilter.forEach((cf) => {
      if (cf.checked) filters.push(cf.value);
    });

    if (filters.length === 0) {
      renderShops(shops);
    } else {
      shops.forEach((s) => {
        if (filters.includes(s.category)) shopsFiltered.push(s);
      });

      renderShops(shopsFiltered);
    }
  });

  $btnShowAll.addEventListener("click", () => {
    checksFilter.forEach((cf) => {
      cf.checked = false;
    });
    renderShops(shops);
  });
};

document.addEventListener("DOMContentLoaded", main);
