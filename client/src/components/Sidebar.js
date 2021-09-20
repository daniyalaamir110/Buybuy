import styles from "./Sidebar.module.css";
import user from "../images/user.svg";
import swal from "sweetalert";

// Redux
import { connect } from "react-redux";
import { logout } from "../redux/actions";

const getControls = props => {

  const handleLogout = () => {
    swal({
      title: "Are you sure?",
      text: "Do you want to logout?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willLogout) => {
        if (willLogout) {
          props.logout();
          swal("You are now out of session", {
            icon: "success",
          });
        }
      });
  }

  if (!props.state.user.verified) {
    return (
      <>
        <a className="btn btn-block rounded-0 p-2 m-0 mx-auto" href="/account">Account</a>
        <button className="btn btn-block rounded-0 p-2 m-0 mx-auto" onClick={handleLogout}>Logout</button>
      </>
    );
  } else if (props.state.user.account_type === "selling") {
    return (
      <>
        <hr />
        <a className="btn btn-block rounded-0 p-2 m-0 mx-auto" href="/seller/dashboard">Dashboard</a>
        <a className="btn btn-block rounded-0 p-2 m-0 mx-auto" href="/seller/shops">Your Shops</a>
        <a className="btn btn-block rounded-0 p-2 m-0 mx-auto" href="/seller/shops/manage-orders">Order Details</a>
        <hr />
        <a className="btn btn-block rounded-0 p-2 m-0 mx-auto" href="/account">Account</a>
        <button className="btn btn-block rounded-0 p-2 m-0 mx-auto" onClick={handleLogout}>Logout</button>
      </>
    );
  } else if (props.state.user.account_type === "buying") {
    return (
      <>
        <hr />
        <a className="btn btn-block rounded-0 p-2 m-0 mx-auto" href="/buyer/dashboard">Dashboard</a>
        <a className="btn btn-block rounded-0 p-2 m-0 mx-auto" href="/buyer/products">Products</a>
        <a className="btn btn-block rounded-0 p-2 m-0 mx-auto" href="/buyer/shops">Shops</a>
        <a className="btn btn-block rounded-0 p-2 m-0 mx-auto" href="/buyer/cart">Cart</a>
        <a className="btn btn-block rounded-0 p-2 m-0 mx-auto" href="/buyer/orders">Order Details</a>
        <hr />
        <a className="btn btn-block rounded-0 p-2 m-0 mx-auto" href="/account">Account</a>
        <button className="btn btn-block rounded-0 p-2 m-0 mx-auto" onClick={handleLogout}>Logout</button>
      </>
    );
  }
}


const Sidebar = props => {
  return (
    <div className="sidebar text-light pt-4">
      <div className="mx-auto circular-image">
        <img src={props.state.user.profile_image ? `/${props.state.user.profile_image}` : user} />
      </div>
      <h6 className="text-center text-light m-1">{props.state.user.first_name}</h6>
      <p className="text-center text-light">Type: {props.state.user.account_type}</p>
      {getControls(props)}
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
export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
