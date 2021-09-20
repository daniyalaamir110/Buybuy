import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import axios from "../../axios";
import swal from "sweetalert";

const SellerShops = () => {

  const [shops, setShops] = useState([]);

  useEffect(() => {
    axios.get("/api/get-seller-shops")
      .then(res => setShops(res.data.shops));
  }, []);

  return (
    <div className="content bg-light">
      <Sidebar />
      <h1 className="display-4 my-2 text-center">Shops</h1>
      <div className="heading-divider mx-auto"></div>
      <div className="container-fluid">
        <div className="row bg-white border m-3 p-2">
          <div className="col-12">
            <div className="d-flex flex-row justify-content-between align-items-center">
              Search:&nbsp;<input type="text" className="form-control mr-2" />
              <div>
                <a href="/seller/shops/create" className="btn btn-outline-danger"><i className="fas fa-plus"></i> Create</a>
              </div>
            </div>
          </div>
        </div>
        <div className="row row-eq-height m-3">
          {shops.map(shop => (
            <div className="col-lg-4 col-md-4 p-4 bg-white border text-center">
              <div className="circular-image mx-auto">
                <img src={`/${shop.shop_logo}`} alt="No shop logo" />
              </div>
              <p className="text-secondary">Created At: {new Date(shop.created_at).toDateString()}</p>
              <p className="text-secondary">Shop Location: {shop.shop_location}</p>
              <h5 className="text-center">{shop.shop_title}</h5>
                <a href="#" className="btn btn-success btn-block" href={"/seller/shops/shop?shopId=" + shop.shop_id}>Go to shop</a>
                <a href="#" className="btn btn-warning btn-block" href={"/seller/shops/edit?shopId=" + shop.shop_id}>Edit Details</a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SellerShops;
