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

const groupByOrderId = groupBy("order_id");

const ManageOrders = () => {

  const [orderDetails, setOrderDetails] = useState([]);

  const getOrders = () => {
    axios.get("/api/get-orders-by-seller-id")
      .then(res => setOrderDetails(groupByOrderId(res.data.orderDetails) || []));
  }

  useEffect(() => {
    getOrders();
  });

  const displayOrders = () => Object.keys(orderDetails).map(orderId => (
    <div key={orderId} className="row p-3 m-3 bg-white border">
      <div className="col-12">
        <div className="d-flex flex-row justify-content-between">
          <div>
            <h3>Order ID # {orderId}</h3>
            <p className="text-secondary">Shop: {orderDetails[orderId][0]["shop_title"]}</p>
            <p className="text-secondary">Order Location: {orderDetails[orderId][0]["order_location"]}</p>
            <p className="text-secondary">Order Status: {orderDetails[orderId][0]["status"]}</p>
            {orderDetails[orderId][0]["status"] == "confirmed" && (
              <>
                <p className="text-secondary">Will be delivered till: {new Date(orderDetails[orderId][0]["delivery_date"]).toDateString()}</p>
                <p className="text-secondary">Delivery Charges: PKR {orderDetails[orderId][0]["delivery_charges"].toLocaleString("en-US")}</p>
              </>
            )}
          </div>
        </div>
        <table className="table table-dark table-bordered text-center">
          <thead>
            <tr>
              <th scope="col">Product ID</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails[orderId].map(item => (
              <tr key={item.product_id}>
                <th scope="row">{item.product_id}</th>
                <td>{item.product_name}</td>
                <td>PKR {Number(item.product_price).toLocaleString("en-US")}</td>
                <td>{item.quantity}</td>
                <td>PKR {Number(item.subtotal).toLocaleString("en-US")}</td>
              </tr>
            ))}
            <tr>
              <th colSpan={4}>Your Total</th>
              <td>
                PKR {orderDetails[orderId].reduce((totalValue, current) => {
                  return totalValue + current.subtotal;
                }, 0).toLocaleString("en-US")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {orderDetails[orderId][0]["status"] == "confirmed" && (
        <h4>Total Bill: PKR {
          (orderDetails[orderId].reduce((totalValue, current) => {
            return totalValue + current.subtotal;
          }, 0) + Number(orderDetails[orderId][0]["delivery_charges"])).toLocaleString("en-US")
        }/=</h4>
      )}
      {orderDetails[orderId][0]["status"] == "unconfirmed" &&(
        <div className="col-md-12">
          <form name={"form" + orderId} method="POST" onSubmit={e => {confirmOrder(e, orderId)}}>
            <div className="d-flex flex-column flex-wrap align-items-left">
              Delivery Charges:
              <input type="number" className="form-control w-50" name="charges" />
              Delivery Time (days):
              <input type="number" min={0} className="form-control w-50" name="deliveryTime" />
              <button className="btn btn-success w-50">Confirm Order</button>
            </div>
          </form>
        </div>
      )}
    </div>
  ));

  const confirmOrder = (e, orderId) => {
    e.preventDefault()
    const charges = document.forms["form" + orderId].charges.value;
    const deliveryTime = document.forms["form" + orderId].deliveryTime.value;
    if (charges) {
      axios.post("/api/confirm-order", {
        orderId: orderId,
        charges: charges,
        deliveryTime: deliveryTime
      })
      .then(res => {
        swal({
          title: "Success",
          text: "Order has been confirmed",
          icon: "success",
          button: "OK",
        });
        getOrders();
      });
    } else swal({
      title: "Oops",
      text: "Please specify the valid delivery time and charges",
      icon: "warning",
      button: "OK",
    })
  }

  const cancelOrder = orderId => {
    swal({
      title: "Are you sure?",
      text: "Do you want to cancel your order?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willCancel) => {
        if (willCancel) {
          axios.post("/api/cancel-order", {
            orderId: orderId
          }).then(res => {
            if (res.data.success) {
              swal({
                title: "Success",
                text: "Order Cancelled",
                icon: "success",
                button: "OK",
              })
            } else swal({
              title: "Oops",
              text: "Your order could not be cancelled. Try again.",
              icon: "error",
              button: "OK",
            });
          });
        }
      });
  }

  return (
    <div className="content bg-light">
      <Sidebar />
      <h1 className="display-4 my-2 text-center">Order Details</h1>
      <div className="heading-divider mx-auto"></div>
      <div className="container-fluid">
        {displayOrders()}
        {Object.keys(orderDetails).length == 0 && (
          <div className="row m-3 p-3">
            <div className="col-12">
              <div class="alert alert-dark" role="alert">
                You dont haven't received any orders at the moment
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageOrders;
