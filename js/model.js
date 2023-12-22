"use strict";
export let state = { data: "", added: [] };
export let storedItems = [];
export const fetching = async function () {
  try {
    const req = await fetch("https://fakestoreapi.com/products");
    const res = await req.json();
    res.forEach((item) => (item.clickNum = 0));
    state.data = res;
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const priceCalculator = function (items) {
  const prices = items.map((object) => object.price * object.clickNum);
  prices.reduce((acc, price) => acc + price).toFixed(2);
};

const itemFinder = function (id) {
  const item = state.data.find((object) => object.id === +id);
  return item;
};

export const cartItemsChecker = function () {
  const totalPrice = state.added
    .map((item) => item.price * item.clickNum)
    .reduce((acc, price) => acc + price)
    .toFixed(2);
  const totalAmount = state.added
    .map((item) => item.clickNum)
    .reduce((acc, price) => acc + price);
  return [totalPrice, totalAmount];
};

export const dataFinder = function (data) {
  const item = itemFinder(parseInt(data));
  if (item.clickNum === 0) return;
  if (data.includes("in")) item.clickNum++;
  if (data.includes("de")) item.clickNum--;
  let price = item.clickNum * item.price;
  return [item.id, item.clickNum, price];
};

export const itemAdder = function (id, state) {
  const item = itemFinder(id);
  item.clickNum += 1;
  state.added.push(item);
  if (item.clickNum > 1) {
    const index = state.added.findIndex((el) => el.id === item.id);
    state.added.splice(index, 1);
  }
  priceCalculator(state.added);
  return state.added;
};
