import { useState, useEffect } from "react";

// Redux
import { connect } from "react-redux";
import { logout } from "../redux/actions";

const getNavItems = props => {
  if (!props.state.isAuthenticated) {
    return (
      <ul className="navbar-nav mt-2 mt-lg-0 ml-auto">
        <li className="nav-item">
          <a className="nav-link" href="#home">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#about">About</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#services">Services</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#contact">Contact</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/login">Login</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/signup">Signup</a>
        </li>
      </ul>
    );
  } else if (!props.state.user.verified) {
    return (
      <ul className="navbar-nav mt-2 mt-lg-0 ml-auto">
        <li className="nav-item">
          <a className="nav-link" href="/account">Account</a>
        </li>
      </ul>
    );
  } else if (props.state.user.account_type === "selling") {
    return (
      <ul className="navbar-nav mt-2 mt-lg-0 ml-auto">
        <li className="nav-item">
          <a className="nav-link" href="/seller/dashboard">Dashboard</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/seller/shops">Your Shops</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/seller/shops/manage-orders">Order Details</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/account">Account</a>
        </li>
      </ul>
    );
  } else if (props.state.user.account_type === "buying") {
    return (
      <ul className="navbar-nav mt-2 mt-lg-0 ml-auto">
        <li className="nav-item">
          <a className="nav-link" href="/buyer/dashboard">Dashboard</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/buyer/products">Products</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/buyer/shops">Shops</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/buyer/cart">Cart</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/buyer/orders">Order Details</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/account">Account</a>
        </li>
      </ul>
    );
  }
}


const Navbar = props => {

  const [atTop, setAtTop] = useState(props.transparent);

  useEffect(() => {
    window.addEventListener("scroll", () => {

      // Transparency controls
      if (props.transparent && document.body.getBoundingClientRect().y === 0) setAtTop(true);
      else setAtTop(false);

      // Scroller controls
      try {
        document.querySelector(".nav-ribbon").style.width = `${100 * (document.body.clientHeight - document.body.getBoundingClientRect().bottom) / (document.body.clientHeight - window.innerHeight)}% `;
      } catch {}
    })
  }, []);

  return (
    <div className={`fixed-top ${!atTop ? "navbar-transparent" : ""}`}>
      <nav className={`navbar navbar-expand-lg navbar-${atTop ? "dark": "light"} bg-${atTop ? "": "light"}`}>
        <div className="container">
          <a className="navbar-brand" href="#">Buybuy</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarContent">
            {getNavItems(props)}
          </div>
        </div>
      </nav>
      <div className="nav-ribbon"></div>
    </div>
  );
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
    }
  }
}

// Connect the component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(Navbar);
