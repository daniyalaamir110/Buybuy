import Navbar from "../Navbar";
import { useState, useEffect, useRef } from "react";
import axios from "../../axios";
import { Editor } from '@tinymce/tinymce-react';
import swal from "sweetalert";

const AddProduct = props => {

  const [shopDetails, setShopDetails] = useState({});

  const [productName, setProductName] = useState("");
  const [productNameError, setProductNameError] = useState("");

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(1);

  const [inStock, setInStock] = useState(false);

  const [price, setPrice] = useState(0);

  const [image, setImage] = useState("");

  const handleProductNameChange = value => {
    setProductName(value);
    if (!value) setProductNameError("Required");
    else setProductNameError("");
  }

  const editorRef = useRef();
  const imageRef = useRef();

  const cancelImage = () => {
    imageRef.current.src = "";
  }

  const displayImage = file => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = e => {
      imageRef.current.src = e.target.result;
    }
    reader.readAsDataURL(file);
  }

  const checkError = () => {
    if (!productName || productNameError) {
      return true;
    } else return false;
  }

  useEffect(() => {
    const search = new URLSearchParams(props.location.search);
    const shopId = search.get("shopId");
    axios.get("/api/get-seller-shop-by-id?shopId=" + shopId)
      .then(res => {
        if (res.data.shop) {
          setShopDetails(res.data.shop);
          setCategories(res.data.categories);
          setCategory(res.data.categories[0].category_id);
        } else window.location.href = "/seller/dashboard";
      });
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (!checkError()) {
      axios.post("/api/add-product", {
        productName: productName,
        productDescription: editorRef.current.getContent(),
        category: category,
        price: price,
        inStock: inStock,
        shopId: shopDetails.shop_id
      }).then(res => {
        if (res.data.success) {
          swal({
            title: "Success",
            text: "Product added",
            icon: "success",
            button: "Proceed",
          })
            .then(proceed => {
              window.location.href = "/seller/shops/shop?shopId=" + shopDetails.shop_id;
            });
          if (image) {
            const formData = new FormData();
            formData.append("file", image);
            const config = {
              headers: {
                "content-type": "multipart/form-data"
              }
            };
            axios.post("/api/change-product-image?productId=" + res.data.productId, formData, config);
          }
        } else if (res.data.error) {
          swal({
            title: "Error",
            text: "Error creating your shop",
            icon: "error",
            button: "OK",
          })
        }
      });
    }
  }

  return (
    <>
      <Navbar />
      <div className="bg-light">
        <div className="bg-light">
          <div className="container py-5">
            <h1 className="display-4 text-center m-3">Add New Product</h1>
            <div className="heading-divider mx-auto"></div>
            <form method="POST" onSubmit={e => handleSubmit(e)}>
              <div className="row bg-white p-3 my-3 border">
                <div className="col-lg-6">
                  <div className="form-group">
                    <div className="d-flex flex-row justify-content-between align-items-center">
                      <label htmlFor="productName">Product Name</label>
                      {productNameError ? <span className="text-danger font-weight-light small lead"><i className="fas fa-times"></i> {productNameError}</span>: productName && <i className="text-success fas fa-check"></i>}
                    </div>
                    <input type="text" id="productName" className="form-control" value={productName} onChange={e => handleProductNameChange(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Product Category</label>
                    <select id="category" className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                      {categories.map(item => (
                        <option key={item.category_id} value={item.category_id}>{item.category_name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Product Description</label>
                    <Editor
                      tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce.min.js"}
                      apiKey='tx662vh2z5flm1o5v1l7filqyh264junhi27uafaols2m1kg'
                      onInit={(evt, editor) => {
                        editorRef.current = editor;
                      }}
                      initialValue="<p>No description.</p>"
                      init={{
                        height: 400,
                        menubar: false,
                        plugins: [
                          'advlist autolink lists link image charmap print preview anchor',
                          'searchreplace visualblocks code fullscreen',
                          'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                      }}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price (PKR)</label>
                    <input type="number" min="0" className="form-control" id="price" value={price} onChange={e => setPrice(e.target.value)} />
                  </div>
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} id="inStock" />
                    <label className="form-check-label" htmlFor="inStock">In Stock</label>
                  </div>
                  <div className="form-group">
                    <button type="submit" className={`btn ${checkError() ? "btn-outline-dark" : "btn-outline-success"} btn-block mt-2`} disabled={checkError()}>Proceed</button>
                  </div>
                </div>
                <div className="col-lg-3 mx-auto">
                  <h5>Featured Image</h5>
                  <input type="file" name="file" id="product-image" onChange={e => displayImage(e.target.files[0])} />
                  <div className="uploaded-image">
                    <img ref={imageRef} alt="No image" />
                  </div>
                  <button type="button" className="btn btn-sm btn-outline-danger mt-2" onClick={cancelImage}>Cancel image</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProduct;
