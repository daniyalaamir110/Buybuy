import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import axios from "../../axios";
import swal from "sweetalert";

const Product = props => {

  const [product, setProduct] = useState(0);
  const [qty, setQty] = useState(0);

  useEffect(() => {
    const search = new URLSearchParams(props.location.search);
    const productId = search.get("productId");
    if (productId) {
      axios.get("/api/get-product-by-id?productId=" + productId)
      .then(res => {
        if (res.data.product) {
          setProduct(res.data.product);
        } else window.location.href = "/buyer/products";
      });
    } else window.location.href = "/buyer/products";
  }, []);

  const handleAddToCart = e => {
    e.preventDefault();
    const temp = qty;
    setQty(0);
    axios.post("/api/add-to-cart", {
      productId: product.product_id,
      qty: temp
    }).then(res => {
      if (res.data.success) {
        swal({
          title: "Success",
          text: "Item added to cart",
          icon: "success",
          button: "Proceed",
        });
      } else swal({
        title: "Oops",
        text: "Looks like the item is already in cart!",
        icon: "warning",
        button: "OK",
      });
    });
  }

  return (
    <div className="bg-light" style={{minHeight: "100vh"}}>
      <Navbar />
      <div className="container py-5">
        <h1 className="display-4 text-center m-3">Item Details</h1>
        <div className="heading-divider mx-auto"></div>
        <div className="row p-3 my-4 bg-white border">
          <div className="col-md-4">
            <div className="uploaded-image w-100 h-100">
              <img src={`/${product.product_image}`} className="w-100" alt="Product Image" />
            </div>
          </div>
          <div className="col-md-8">
            <h2>{product.product_name}</h2>
            <p className="text-secondary">By {product.shop_title}</p>
            <hr />
            <div dangerouslySetInnerHTML={{__html: product.product_description}} />
            <h4 className="text-secondary"><i className="fas fa-tags text-success"></i> PKR {Number(product.product_price).toLocaleString("en-US")}</h4>
            <hr />
            <div className="d-flex flex-row flex-warp align-items-center justify-content-left">
              Quantity:&nbsp;
              <input type="number" className="form-control text-center w-25" min={0} value={qty} onChange={e => setQty(e.target.value)} />
              &nbsp;= {(qty * Number(product.product_price)).toLocaleString("en-US")} PKR (Your Subtotal)
              <div>&nbsp;&nbsp;</div>
              <button className="btn btn-warning ml-auto" disabled={qty == 0} onClick={e => handleAddToCart(e)}><i class="fas fa-cart-arrow-down"></i> Add To Cart</button>
            </div>
          </div>
          <div className="col-12">
            <hr />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
