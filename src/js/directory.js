const API_SHOPS = "/api/all-shops-info.json";

let shops;

const main = () => {
  loadShopsCard();
  handleFilter();
};

const loadShopsCard = () => {
  fetch(API_SHOPS)
    .then((res) => res.json())
    .then((shopsResult) => {
      shops = sortShops(shopsResult);
      renderShops(shops);
    });
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

  $card.classList.add("col");
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

    shops.forEach((s) => {
      if (filters.includes(s.category)) shopsFiltered.push(s);
    });
    renderShops(shopsFiltered);
  });

  $btnShowAll.addEventListener("click", () => {
    checksFilter.forEach((cf) => {
      cf.checked = false;
    });
    renderShops(shops);
  });
};

document.addEventListener("DOMContentLoaded", main);
