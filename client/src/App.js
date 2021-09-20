// React hooks
import { useEffect } from "react"

// Redux
import { connect } from "react-redux";
import { checkSession, logout } from "./redux/actions";

// React Router
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

// Global Styles
import "./App.css";

//Import the components

// Generic Components
import Loading from "./components/Loading";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Verify from "./components/Verify";
import AccountSettings from "./components/AccountSettings";

// Seller Specific
import SellerDashboard from "./components/seller/SellerDashboard";
import SellerShops from "./components/seller/SellerShops";
import CreateShop from "./components/seller/CreateShop";
import EditShop from "./components/seller/EditShop";
import SellerShop from "./components/seller/SellerShop";
import AddProduct from "./components/seller/AddProduct";
import ManageOrders from "./components/seller/ManageOrders";

// Buyer Specific
import BuyerDashboard from "./components/buyer/BuyerDashboard";
import Shops from "./components/buyer/Shops";
import Shop from "./components/buyer/Shop";
import Products from "./components/buyer/Products";
import Product from "./components/buyer/Product";
import Cart from "./components/buyer/Cart";
import OrderTracking from "./components/buyer/OrderTracking";

const getRouter = state => {
  if (!state.isAuthenticated) {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Redirect to="/" />
        </Switch>
      </Router>
    );
  } else if (!state.user.verified) {
    return (
      <Router>
        <Switch>
          <Route exact path="/verify-email" component={Verify} />
          <Route exact path="/account" component={AccountSettings} />
          <Redirect to="/verify-email" />
        </Switch>
      </Router>
    );
  } else if (state.user.account_type === "selling") {
    return (
      <Router>
        <Switch>
          <Route exact path="/seller/dashboard" component={SellerDashboard} />
          <Route exact path="/seller/shops" component={SellerShops} />
          <Route exact path="/seller/shops/create" component={CreateShop} />
          <Route exact path="/seller/shops/edit" component={EditShop} />
          <Route exact path="/seller/shops/shop" component={SellerShop} />
          <Route exact path="/seller/shops/shop/add-product" component={AddProduct} />
          <Route exact path="/seller/shops/manage-orders" component={ManageOrders} />
          <Route exact path="/account" component={AccountSettings} />
          <Redirect to="/seller/dashboard" />
        </Switch>
      </Router>
    );
  } else if (state.user.account_type === "buying") {
    return (
      <Router>
        <Switch>
          <Route exact path="/buyer/dashboard" component={BuyerDashboard} />
          <Route exact path="/buyer/products" component={Products} />
          <Route exact path="/buyer/product" component={Product} />
          <Route exact path="/buyer/shops" component={Shops} />
          <Route exact path="/buyer/shops/shop" component={Shop} />
          <Route exact path="/buyer/cart" component={Cart} />
          <Route exact path="/buyer/orders" component={OrderTracking} />
          <Route exact path="/account" component={AccountSettings} />
          <Redirect to="/buyer/dashboard" />
        </Switch>
      </Router>
    );
  }
}

const App = props => {

  useEffect(() => {
    props.checkSession();
  }, []);

  return props.state.loading ? <Loading /> : getRouter(props.state);
}

// Redux state to component Props
const mapStateToProps = state => {
  return { state: state };
}

// Redux async actions to component props
const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch(logout());
    },
    checkSession: () => {
      dispatch(checkSession());
    }
  }
}

// Connect the component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(App);
