import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import axios from "../../axios";
import swal from "sweetalert";

const groupBy = key => array => array.reduce((acc, obj) => {
  const property = obj[key];
  acc[property] = acc[property] || [];
  acc[property].push(obj);
  return acc;
}, {});

const groupByShopId = groupBy("shop_id");

const Cart = () => {

  const [carts, setCarts] = useState([]);

  const getCarts = () => {
    axios.get("/api/get-cart")
      .then(res => {
        if (res.data.success) {
          setCarts(groupByShopId(res.data.carts || []));
        }
      });
  }

  useEffect(() => {
    getCarts();
  }, []);

  const removeFromCart = productId => {
    swal({
      title: "Are you sure?",
      text: "Do you want to remove the item from your cart?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willRemove) => {
        if (willRemove) {
          axios.post("/api/remove-from-cart", {
            productId: productId
          }).then(res => {
            if (res.data.success) {
              swal("Item removed", {
                icon: "success",
              });
              getCarts();
            }
          });
        }
      });
  }

  const displayCarts = () => Object.keys(carts).map(shopId => (
    <div key={shopId} className="row p-3 m-3 bg-white border">
      <div className="col-12">
        <div className="d-flex flex-row justify-content-between">
          <h3 className="text-center">{carts[shopId][0]["shop_title"]}</h3>
          <div>
            <a href={"/buyer/shops/shop?shopId=" + shopId} className="btn btn-warning"><i className="fas fa-store"></i> Visit Shop</a>
          </div>
        </div>
        <hr />
        <table className="table table-dark table-bordered text-center">
          <thead>
            <tr>
              <th scope="col">Product ID</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Subtotal</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {carts[shopId].map(item => (
              <tr key={item.product_id}>
                <th scope="row">{item.product_id}</th>
                <td>{item.product_name}</td>
                <td>PKR {Number(item.product_price).toLocaleString("en-US")}</td>
                <td>{item.quantity}</td>
                <td>PKR {Number(item.quantity * item.product_price).toLocaleString("en-US")}</td>
                <td>
                  <button className="btn btn-danger btn-sm btn-block" onClick={() => removeFromCart(item.product_id)}><i className="fa fa-times"></i> Remove</button>
                </td>
              </tr>
            ))}
            <tr>
              <th colSpan={4}>Your Total</th>
              <td>
                PKR {carts[shopId].reduce((totalValue, current) => {
                  return totalValue + current.quantity * current.product_price;
                }, 0).toLocaleString("en-US")}
              </td>
              <td>
                <button className="btn btn-success btn-sm btn-block"><i className="fas fa-check"></i> Order</button>
              </td>
            </tr>
          </tbody>
        </table>
        <hr />
        <div>
          <h4>Place Order</h4>
          <form name={"form" + shopId} method="POST" onSubmit={e => handlePlaceOrder(e, carts[shopId])}>
            <div className="d-flex flex-row flex-wrap align-items-center">
              Order Location:
              <input type="text" className="form-control w-50" name="location" />&nbsp;&nbsp;
              <button className="btn btn-success">Place Order</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  ));

  const handlePlaceOrder = (e, cart) => {
    e.preventDefault()
    console.log(cart);
    const location = document.forms["form" + cart[0]["shop_id"]].location.value;
    if (location) {
      axios.post("/api/place-order", {
        shopId: cart[0]["shop_id"],
        location: location,
        cart: cart
      })
      .then(res => {
        swal({
          title: "Success",
          text: "Your Order has been placed",
          icon: "success",
          button: "OK",
        });
        getCarts();
      });
    } else swal({
      title: "Oops",
      text: "Please specify the delivery address",
      icon: "warning",
      button: "OK",
    })
  }

  return (
    <div className="content bg-light">
      <Sidebar />
      <h1 className="display-4 my-2 text-center">Cart</h1>
      <div className="heading-divider mx-auto"></div>
      <div className="container-fluid">
        {displayCarts()}
      </div>
    </div>
  );
}

export default Cart;
