import * as bs from "./bootstrap.js";
import breakpoint from "./breakpoint.js";
import pathprefix from "./pathprefix.js";

const API_SHOPS = resolvePath("api/all-shops-info.json");

let shops;

const main = () => {
  loadShopsCard();
  handleFilter();
  handleClickShopCard();
};

const loadShopsCard = () => {
  let $shopsTarget = document.getElementById("shops-card-target"),
    $loader = createLoaderElement();

  $shopsTarget.insertAdjacentElement("afterbegin", $loader);
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
    let $loader = createLoaderElement();

    $modalBody.appendChild($loader);
    fetch(resolevePath(_shop.apiPath))
      .then((res) => res.json())
      .then((fullInfoShop) => {
				$loader.remove();
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
    <img 
    	class="menu-logo d-lg-none" 
    	src="${resolvePath(shop.logo)}" 
    	alt="${shop.name}" 
    />
    <h4 class="fs-2 px-3 d-lg-none text-primary">${shop.name}</h4>
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
      <div class="col p-3 d-none d-lg-block col-lg-4">
        <div class="sticky-top">
          <img 
          	class="large-logo d-block mx-auto mb-3" 
          	src="${resolvePath(shop.logo)}" 
          	alt="${shop.name}" 
          />
          <p class="fs-6 opacity-75 text-center">
          	<b>Local</b> ${shop.locals.join("|")}
          </p>
          ${createModalContactHTML(shop)}
          ${createModalSocialMediaHTML(shop)}
        </div>
      </div>
      <div class="col col-lg-8">
        ${createModalCarouselElement(shop)}
        <div class="p-3">
          <h4 class="d-none d-lg-block fs-2 text-primary">${shop.name}</h4>
          <div class="d-flex justify-content-between d-lg-none">
            <p class="fs-6 opacity-75">
            	<b>Local</b> ${shop.locals.join("|") ?? "Por ahi anda."}
            </p>
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
      <a 
	class="gp-link-primary fs-4 d-inline-block mx-1 text-decoration-none" 
	href="${link}" 
	rel="nofollow" 
	target="_blank"
      >
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
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#${$modalCarousel.id}"
        data-bs-slide="prev"
      >
        <i
          class="bi bi-arrow-left-circle-fill fs-3 opacity-50"
          aria-hidden="true"
        ></i>
        <span class="visually-hidden">Anterior</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#${$modalCarousel.id}"
        data-bs-slide="next"
      >
        <i
          class="bi bi-arrow-right-circle-fill fs-3 opacity-50"
          aria-hidden="true"
        ></i>
        <span class="visually-hidden">Siguiente</span>
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
        <img 
        	class="carousel-shop-item__img" 
        	src="${resolvePath(img.src)}" 
        	alt="${img.alt}" 
        />
      </div>
    `;
  });
  return items;
};

const createModalContactHTML = (shop, customClass = "") => {
  let contact = "";

  if (!shop.contact) return "";

  if (shop.contact.phone)
    contact += `<p class="my-1"><i class="bi bi-telephone"></i> ${shop.contact.phone}</p>`;
  if (shop.contact.mail)
    contact += `<p class="my-1"><i class="bi bi-envelope-at"></i> ${shop.contact.mail}</p>`;

  if (contact === "") return "";

  return `
    <div class="${customClass} mb-3">
      <h5 class="h5 text-primary mb-2">Contacto</h5>
      ${contact}
    </div>
  `;
};

const renderShops = (shops) => {
  let $cardsContainer,
    currentCategory,
    $target = document.getElementById("shops-card-target"),
    $frag = document.createDocumentFragment();

  const D = 0.2;

  $target.innerHTML = "";
  shops.forEach((shop, index) => {
    if (currentCategory !== shop.category) {
      currentCategory = shop.category;
      if ($cardsContainer) $frag.appendChild($cardsContainer);
      $frag.appendChild(createCategoryTitle(currentCategory));
      $cardsContainer = createCardsContainer();
    }

    $cardsContainer.appendChild(
    	createShopCard(shop, D * index)
    );
  });
  $frag.appendChild($cardsContainer);
  $target.appendChild($frag);
};

const createCardsContainer = () => {
  let $container = document.createElement("div");

  $container.classList.add("row", "row-cols-2", "row-cols-lg-3", "row-cols-xl-4", "mb-4");
  return $container;
};

const createCategoryTitle = (title) => {
  let $title = document.createElement("h3"),
    $hr = document.createElement("hr"),
    $frag = document.createDocumentFragment();

  $title.classList.add("fs-5", "text-body", "opacity-75", "my-0");
  $title.textContent = title.toUpperCase();

  $hr.classList.add("mt-1");

  $frag.appendChild($title);
  $frag.appendChild($hr);
  return $frag;
};

const createShopCard = (shop, delay = 0) => {
  let $card = document.createElement("div");

  $card.classList.add("col", "js-shop-card");
  $card.setAttribute("style", `--delay: ${delay}s`);
  $card.dataset.shopName = shop.name;
  $card.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="card-shop card my-3 p-2">
      <img 
      	src="${resolvePath(shop.logo)}" 
      	class="card-img-top logo mx-auto" 
      	alt="${shop.name}"
      >
      <div class="card-body p-1">
        <h5 
        	class="ff-lato text-center m-0 fs-6 text-body-secondary mt-2"
        >
        ${shop.name.toUpperCase()}
        </h5>
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
    $btnShowAll = document.getElementById("btn-show-all"),
    $collapse = document.getElementById("form-collapse"),
    $btnFilter = document.getElementById("btn-filter"),
    collapse = new bs.Collapse($collapse, {
      toggle: false
    }),
    isExpanded = false,
    media = matchMedia(breakpoint.md);

  const handleCheckChange = () => {
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
    hideCollapseIfSmall();
  };

  checksFilter.forEach(($check) => {
		$check.addEventListener("change", handleCheckChange);
  });

  $btnShowAll.addEventListener("click", () => {
    checksFilter.forEach((cf) => {
      cf.checked = false;
    });
    renderShops(shops);
    hideCollapseIfSmall();
  });

  $btnFilter.addEventListener("click", () => {
    collapse.toggle();
    isExpanded = !isExpanded;
    $btnFilter.setAttribute("aria-expanded", isExpanded);
  });

  const expandCollapseIfLarge = () => {
    if (media.matches) {
      $collapse.classList.add("show");
      isExpanded = true;
    } else {
      $collapse.classList.remove("show");
      isExpanded = false;
    }
    $btnFilter.setAttribute("aria-expanded", isExpanded);
  };

  const hideCollapseIfSmall = () => {
    if (!media.matches) {
      collapse.hide();
      isExpanded = false;
      $btnFilter.setAttribute("aria-expanded", isExpanded);
    }
  };

  media.addEventListener("change", expandCollapseIfLarge);
  expandCollapseIfLarge();
};

const createLoaderElement = () => {
  let $loader = document.createElement("div");

  $loader.classList.add("loader", "my-5");
  return $loader;
};

const resolvePath = (path) => {
	let url = `${pathprefix}${path}`;

	return url.replace(/\/\//g, "/");
};

document.addEventListener("DOMContentLoaded", main);
