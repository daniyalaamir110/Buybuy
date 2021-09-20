import { useState, useEffect } from "react";
import Navbar from "../Navbar";
import axios from "../../axios";

const Shop = props => {

  const [shopDetails, setShopDetails] = useState({});
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  // filters
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [priceOrder, setPriceOrder] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const getProductsToDisplay = () => {

    let productsToDisplay = products;

    // Category filter
    productsToDisplay = productsToDisplay.filter(item => {
      if (selectedCategory == 0) return true;
      else if (selectedCategory == item.category_id) return true;
      else return false;
    });

    // Search Filter
    productsToDisplay = productsToDisplay.filter(item => {
      if (item.product_name.toLowerCase().indexOf(search) !== -1) return true;
      else return false;
    })

    // Price Filter
    if (priceOrder) {
      productsToDisplay.sort((a, b) => {
        return priceOrder * (a.product_price - b.product_price);
      })
    }

    const numOfGroups = Math.ceil(productsToDisplay.length / 15);
    const groups = new Array(numOfGroups).fill("").map((_, i) => productsToDisplay.slice(i * 15, (i + 1) * 15));

    let result;
    if (groups.length > 0) {
      result = (
        <div className="row p-0 my-4">
          <div className="col-12 p-4 bg-white border">
            <div className="d-flex flex-row flex-wrap justify-content-center align-items-center">
              <p className="p-0 m-0">Page: </p>
              {groups.map((group, id) => (
                <button className={`btn ${page == id ? "btn-primary": "bg-white border"} border m-1`} onClick={e => setPage(id)}>{id + 1}</button>
              ))}
            </div>
          </div>
          {(groups[page]).map(item => (
            <div className="col-lg-3 col-md-6 border p-3 bg-white">
              <div className="uploaded-image border-0 mx-auto">
                <img src={`/${item.product_image}`} />
              </div>
              <h4>{item.product_name}</h4>
              <hr />
              <p class="text-secondary"><i className="fa fa-store-alt"></i> By: {item.shop_title}</p>
              <p class="text-secondary"><i className="fa fa-list"></i> Category: {item.category_name}</p>
              <h5 className="text-secondary"><i class="fas fa-tags text-success"></i> PKR {Number(item.product_price).toLocaleString("en-US")}</h5>
              <a href={"/buyer/product?productId=" + item.product_id} className="btn btn-warning btn-block"><i className="fa fa-search"></i> View</a>
          </div>
          ))}
        </div>
      );
    }
    return result;
  }

  useEffect(() => {
    const search = new URLSearchParams(props.location.search);
    const shopId = search.get("shopId");
    if (shopId) {
      axios.get("/api/get-shop-details-by-id?shopId=" + shopId)
      .then(res => {
        if (res.data.shop) {
          setShopDetails(res.data.shop);
          setCategories([{category_id: 0, category_name: "None selected"}, ...res.data.categories]);
          axios.get("/api/get-products-by-shopid?shopId=" + shopId)
            .then(res => setProducts(res.data.products));
        } else window.location.href = "/buyer/dashboard";
      });
    } else window.location.href = "/buyer/dashboard";
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
            </div>
            <div className="col-lg-9">
              <div dangerouslySetInnerHTML={{__html: shopDetails.shop_description}} />
            </div>
            <div className="col-12 p-0 mt-3">
              <iframe src={`https://www.google.com/maps?q=${shopDetails.shop_location}&z=15&output=embed`} width="100%" height="350" style={{border: "solid 1px #0005"}} allowfullscreen="" loading="lazy"></iframe>
            </div>
          </div>
          <h1 className="display-4 text-center m-3">Products</h1>
          <div className="row bg-white p-2 my-3 border justify-content-around">
            <div className="col-lg-6">
              <div className="form-group">
                <label>Search:</label>
                <input type="text" className="form-control" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>Category:</label>
                <select id="category" className="form-control" onChange={e => setSelectedCategory(e.target.value)}>
                {categories.map(item => (
                  <option key={item.category_id} value={item.category_id}>{item.category_name}</option>
                ))}
                </select>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label>Order of Price:</label>
                <select id="category" className="form-control" onChange={e => setPriceOrder(e.target.value)}>
                  <option key={0} value={0}>No trend selected</option>
                  <option key={1} value={1}>Low to high</option>
                  <option key={-1} value={-1}>High to low</option>
                </select>
              </div>
            </div>
          </div>
          {getProductsToDisplay()}
        </div>
      </div>
    </>
  );
}

export default Shop;
