import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  cartItems: [],
  totalItems: 0,
  amount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, { payload }) => {
      // add item to cart
      state.cartItems = state.cartItems.concat(payload);
      state.totalItems += 1;
      // console.log(payload);
      payload.addons.forEach((element) => {
        state.amount += element.quantity * element.addon.price;
      });
      payload.softDrinks.forEach((element) => {
        state.amount += element.quantity * element.softDrink.price;
      });

      state.amount = payload.product.price * payload.quantity + state.amount;
      toast.success("Product Added To Cart!");
    },
    delCartItem: (state, { payload }) => {
      // del item from cart
      const find = state.cartItems.find(
        (item) => item.product.id === payload.id
      );

      const filter = state.cartItems.filter((item) => {
        return item.product.id !== payload.id;
      });
      find.addons.forEach((element) => {
        state.amount -= element.quantity * element.addon.price;
      });
      find.softDrinks.forEach((element) => {
        console.log(element.quantity * element.softDrink.price);
        state.amount -= element.quantity * element.softDrink.price;
      });

      state.amount -= find.quantity * payload.price;
      state.cartItems = filter;
      state.totalItems -= 1;
    },
    increaseItemQuantity: (state, { payload }) => {
      // increase cart item quantity
      const findItem = state.cartItems.find((item) => item.prod_id === payload);
      // check if product not found in cart than return it
      if (findItem === undefined) {
        return;
      }
      findItem.quantity += 1;
      state.amount += findItem.product.price;
    },
    decreaseItemQuantity: (state, { payload }) => {
      // decrease cart item quantity
      const findItem = state.cartItems.find((item) => item.prod_id === payload);
      // check if product not found in cart than return it
      if (findItem === undefined) {
        return;
      }
      findItem.quantity -= 1;
      state.amount -= findItem.product.price;
    },
    updateCartItem: (state, { payload }) => {
      // del item from cart
      const find = state.cartItems.find(
        (item) => item.product.id === payload.prod_id
      );
      find.addons.forEach((element) => {
        state.amount -= element.quantity * element.addon.price;
      });
      find.softDrinks.forEach((element) => {
        state.amount -= element.quantity * element.softDrink.price;
      });
      const filter = state.cartItems.filter((item) => {
        return item.product.id !== payload.prod_id;
      });

      state.amount -= find.quantity * payload.product.price;
      state.cartItems = filter;
      state.totalItems -= 1;
      // del item from cart
      // add item to cart
      state.cartItems = state.cartItems.concat(payload);
      state.totalItems += 1;
      // console.log(payload);
      payload.addons.forEach((element) => {
        state.amount += element.quantity * element.addon.price;
      });
      payload.softDrinks.forEach((element) => {
        state.amount += element.quantity * element.softDrink.price;
      });

      state.amount = payload.product.price * payload.quantity + state.amount;
      toast.success("Product Updated!");
    },
    clearCart: (state, action) => {
      state.cartItems = [];
      state.totalItems = 0;
      state.amount = 0;
    },
  },
});
export const {
  addToCart,
  delCartItem,
  increaseItemQuantity,
  decreaseItemQuantity,
  updateCartItem,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
