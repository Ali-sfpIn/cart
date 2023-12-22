"use strict";
class View {
  // selections
  cardContainer = document.querySelector(".card-container");
  modal = document.querySelector(".modal-text");
  modalBtn = document.querySelector(".modal-btn");
  emptyCart = document.querySelector(".no-item-text");
  prices = [];
  quantityContainer = [];
  render = function (APIRes) {
    const products = APIRes.map((arr) => {
      return `
        <div class="card">
          <img
            id=${arr.id}
            class="card-img"
            src=${arr.image}
            alt=""
          />
          <h2 class="card-title">${arr.title}</h2>
          <button data-id="${arr.id}" class="addToCart-btn">add to card</button>
          <span data-price="card-${arr.id}-price" class="price">${arr.price}$</span>
        </div>
    `;
    }).join("");
    this.cardContainer.insertAdjacentHTML("afterbegin", products);
  };

  // Event Handlers...

  modalHandler(handler) {
    this.modalBtn.addEventListener("click", function () {
      handler();
    });
  }

  overlayHandler(handler) {
    document.body.addEventListener("click", function (e) {
      if (e.target.closest(".modal-container")) return;
      handler();
    });
  }

  cartItemRender(items) {
    items.forEach((item) => {
      const product = `
        <div data-id="${item.id}-item" class="cart-item">
          <h2 class="item-title">${item.title}</h2>
          <div class="item-control">
            <button data-btn="${item.id}-de" class="btn decrease"></button>
            quantity :
            <span data-quantity="${item.id}" class="item-quantity"> ${
        item.clickNum
      }</span>
            <span class="and">& price :</span>
            <span data-price="${item.id}" class="item-price"> ${
        item.price * item.clickNum
      }$</span>
            <button data-btn="${item.id}-in" class="btn increase"></button>
          </div>
        </div>
    `;
      const pastItem = this.modal.querySelector(`[data-id="${item.id}-item"]`);
      if (pastItem) pastItem.remove();
      this.modal.insertAdjacentHTML("afterbegin", product);
    });
  }

  addToCartHandler(handler) {
    this.cardContainer.addEventListener("click", function (e) {
      if (!e.target.classList.contains("addToCart-btn")) return;
      handler(e.target.dataset.id);
    });
  }

  cartMainTextUpdater([price, amount], update = false, id) {
    if (!update) {
      this.quantityContainer.push(amount);
      const cartTitle = `<p class="item-counter">you have ${amount} items in your cart</p>`;
      const cartPrice = `<div class="total-price">${price}$</div>`;
      const pastTitle = this.modal.querySelector(".item-counter");
      const pastPrice = this.modal.querySelector(".total-price");
      if (pastTitle) pastTitle.remove();
      if (pastPrice) pastPrice.remove();
      this.emptyCart.style.display = "none";
      this.modal.insertAdjacentHTML("afterbegin", cartTitle);
      this.modal.insertAdjacentHTML("beforeend", cartPrice);
    }
    if (update) {
      const itemCounter = document.querySelector(".item-counter");
      const totalPrice = document.querySelector(".total-price");
      const allQuantities = Array.from(
        this.modal.getElementsByClassName("item-quantity")
      )
        .map((quantity) => +quantity.textContent)
        .reduce((acc, quantity) => acc + quantity);

      const allPrice = Array.from(
        this.modal.getElementsByClassName("item-price")
      )
        .map((price) => +price.textContent.slice(0, -2))
        .reduce((acc, price) => acc + price)
        .toFixed(2);
      itemCounter.textContent = `you have ${allQuantities} items in your cart`;
      totalPrice.textContent = `${allPrice}$`;
    }
    this.modal.querySelectorAll(".cart-item").forEach((cart) => {
      if (+cart.querySelector(".item-quantity").textContent === 0)
        cart.style.display = "none";
    });
  }

  itemTextUpdater(updatedItemData) {
    if (!updatedItemData) return;
    const priceEl = document.querySelector(
      `[data-price="${updatedItemData[0]}"]`
    );
    const quantityEl = document.querySelector(
      `[data-quantity="${updatedItemData[0]}"]`
    );
    quantityEl.textContent = updatedItemData[1];
    priceEl.textContent = `${updatedItemData[2].toFixed(2)}$`;
    this.cartMainTextUpdater(
      ["", updatedItemData[1]],
      true,
      updatedItemData[0]
    );
  }

  quantityBtnHandler(handler) {
    this.modal.addEventListener("click", function (e) {
      if (!e.target.classList.contains("btn")) return;
      const btn = e.target;
      handler(btn.dataset.btn);
    });
  }
}

export default new View();
