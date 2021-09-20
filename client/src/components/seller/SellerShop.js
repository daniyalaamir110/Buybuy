import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import axios from "../../axios";

const SellerShop = props => {

  const [shopDetails, setShopDetails] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const search = new URLSearchParams(props.location.search);
    const shopId = search.get("shopId");
    if (shopId) {
      axios.get("/api/get-seller-shop-by-id?shopId=" + shopId)
      .then(res => {
        if (res.data.shop) {
          setShopDetails(res.data.shop);
          axios.get("/api/get-products-by-shopid?shopId=" + shopId)
            .then(res => {
              setProducts(res.data.products);
            })
        } else window.location.href = "/seller/dashboard";
      });
    } else window.location.href = "/seller/dashboard";
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-light">
        <div className="container pt-5">
          <div className="row bg-white p-4 border">
            <div className="col-lg-3">
              <div className="circular-image mx-auto">
                <img src={`/${shopDetails.shop_logo}`} />
              </div>
              <h4 className="text-center">{shopDetails.shop_title}</h4>
              <p className="text-secondary text-center">Shop Location: {shopDetails.shop_location}</p>
              <p className="text-secondary text-center">Created At: {new Date(shopDetails.created_at).toDateString()}</p>
              <a href={"/seller/shops/edit?shopId=" + shopDetails.shop_id} className="btn btn-success btn-warning btn-block">Edit Details</a>
            </div>
            <div className="col-lg-9">
              <div dangerouslySetInnerHTML={{__html: shopDetails.shop_description}} />
            </div>
            <div className="col-12 p-0 mt-3">
              <iframe src={`https://www.google.com/maps?q=${shopDetails.shop_location}&z=15&output=embed`} width="100%" height="350" style={{border: "solid 1px #0005"}} allowfullscreen="" loading="lazy"></iframe>
            </div>
          </div>
          <h1 className="display-4 text-center m-3">Products</h1>
          <div className="heading-divider mx-auto"></div>
          <div className="row bg-white p-3 my-3 border">
            <div className="col-lg-9">

            </div>
            <div className="col-lg-3">
              <a href={"/seller/shops/shop/add-product?shopId=" + shopDetails.shop_id} className="btn btn-outline-danger btn-block">Add new</a>
            </div>
          </div>
          {products.map(item => (
            <div className="row bg-white row-eq-height p-3 my-3 border align-items-center">
              <div className="col-lg-3 d-flex flex-column align-items-center justify-content-between">
                <div className="uploaded-image mx-auto border-0">
                  <img src={`/${item.product_image}`} />
                </div>
                <div className="my-4">
                  <h4 className="text-secondary text-center"><i class="fas fa-tags text-success"></i> PKR {item.product_price.toLocaleString("en-US")}</h4>
                  <a href="#" className="btn btn-success btn-warning btn-block">Edit Details</a>
                </div>
              </div>
              <div className="col-lg-9">
                <h2 className="mb-3">{item.product_name}</h2>
                <div dangerouslySetInnerHTML={{__html: item.product_description}} />
                <hr />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SellerShop;
