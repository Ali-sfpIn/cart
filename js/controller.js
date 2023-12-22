"use strict";
import * as model from "./model.js";
import view from "./view.js";

const APIRes = async function () {
  try {
    const res = await model.fetching();
    return view.render(res);
  } catch (err) {
    console.log(err);
  }
};

const modalController = function () {
  view.modal.style.display = "flex";
};

const overlayController = function () {
  view.modal.style.display = "none";
};

const itemController = function (id) {
  const items = model.itemAdder(id, model.state);
  view.cartItemRender(items);
  cartMainTextController();
};

const quantityBtnController = function (data) {
  // finding the quantity and price by the data-btn
  const updatedItemData = model.dataFinder(data);
  // sending back the price,quantity and id to view
  view.itemTextUpdater(updatedItemData);
};
const cartMainTextController = function () {
  const priceAndAmount = model.cartItemsChecker();
  view.cartMainTextUpdater(priceAndAmount);
};

const init = function () {
  APIRes();
  view.modalHandler(modalController);
  view.overlayHandler(overlayController);
  view.quantityBtnHandler(quantityBtnController);
  view.addToCartHandler(itemController);
};
init();
