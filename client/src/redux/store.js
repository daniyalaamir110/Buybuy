// Import the dependencies
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducer";

// To persist the previous state
export const loadState = () => {
  try {
    const serializedState = localStorage.getItem("state");
    if (!serializedState) return undefined;
    else return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// To save the previous state in current state
export const saveState = (user) => {
  try {
    const serializedState = JSON.stringify(user);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    console.log(err);
  }
};

// Create the application's central store
const persistedStore = loadState();
const store = createStore(reducer, persistedStore, applyMiddleware(thunk));

// Callback
store.subscribe(() => {
  saveState(store.getState())
  console.log(store.getState());
});

export default store;
