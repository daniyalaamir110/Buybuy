import { useState, useEffect, useRef } from "react";
import { Editor } from '@tinymce/tinymce-react';
import Sidebar from "../Sidebar";
import swal from "sweetalert";

import axios from "../../axios";

const EditShop = props => {

  // Form input
  const [shopTitle, setShopTitle] = useState("");
  const [shopTitleError, setShopTitleError] = useState("");

  const [shopLocation, setShopLocation] = useState("");
  const [shopLocationError, setShopLocationError] = useState("");

  const [shopDescription, setShopDescription] = useState("");

  const [shopLogo, setShopLogo] = useState("");

  const editorRef = useRef();
  const imageRef = useRef();

  useEffect(() => {
    const search = new URLSearchParams(props.location.search);
    const shopId = search.get("shopId");
    axios.get("/api/get-seller-shop-by-id?shopId=" + shopId)
      .then(res => {
        setShopTitle(res.data.shop.shop_title);
        setShopLocation(res.data.shop.shop_location);
        setShopDescription(res.data.shop.shop_description);
        setShopLocation(res.data.shop.shop_location);
        setShopLogo(res.data.shop.shop_logo);
      });
  }, []);

  const handleShopTitleChange = value => {
    setShopTitle(value);
    if (!value) setShopTitleError("Required");
    else setShopTitleError("");
  }

  const handleShopLocationChange = value => {
    setShopLocation(value);
    if (!value) setShopLocationError("Required");
    else setShopLocationError("");
  }

  const displayImage = file => {
    setShopLogo(file);
    const reader = new FileReader();
    reader.onload = e => {
      imageRef.current.src = e.target.result;
    }
    reader.readAsDataURL(file);
  }

  const cancelImage = () => {
    imageRef.current.src = "";
    setShopLogo("");
  }

  const checkError = () => {
    if (!shopTitle || shopTitleError || !shopLocation || shopLocationError) {
      return true;
    } else return false;
  }

  const handleSubmit = e => {
    e.preventDefault();
    const search = new URLSearchParams(props.location.search);
    const shopId = search.get("shopId");
    if (!checkError()) {
      axios.post("/api/edit-shop", {
        shopId: shopId,
        shopTitle: shopTitle,
        shopDescription: editorRef.current.getContent(),
        shopLocation: shopLocation,
      }).then(res => {
        if (res.data.success) {
          swal({
            title: "Success",
            text: "Your shop has been updated",
            icon: "success",
            button: "Proceed",
          })
            .then(proceed => {
              window.location.href = "/seller/shops";
            });
          if (shopLogo && imageRef.current.src) {
            const formData = new FormData();
            formData.append("file", shopLogo);
            const config = {
              headers: {
                "content-type": "multipart/form-data"
              }
            };
            axios.post("/api/change-shop-logo?shopId=" + shopId, formData, config);
          }
        } else if (res.data.error) {
          swal({
            title: "Oops!",
            text: "Your shop could not be updated",
            icon: "error",
            button: "OK",
          });
        }
      });
    }
  }

  return (
    <div className="content bg-light">
      <Sidebar />
      <h1 className="display-4 my-2 text-center">Edit Shop</h1>
      <div className="heading-divider mx-auto"></div>
      <div className="container">
        <form method="POST" onSubmit={e => handleSubmit(e)}>
          <div className="row bg-white p-3 m-3 border">
            <div className="col-lg-6 col-md-8">
              <div className="form-group">
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <label htmlFor="#shopTitle">Shop Title</label>
                  {shopTitleError ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {shopTitleError}</span>: shopTitle && <i className="text-success fas fa-check"></i>}
                </div>
                <input type="text" className="form-control" value={shopTitle} onChange={e => handleShopTitleChange(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="#shopTitle">Shop Description</label>
                <Editor
                  tinymceScriptSrc={process.env.PUBLIC_URL + "/tinymce.min.js"}
                  apiKey='tx662vh2z5flm1o5v1l7filqyh264junhi27uafaols2m1kg'
                  onInit={(evt, editor) => {
                    editorRef.current = editor;
                  }}
                  value={shopDescription}
                  onEditorChange={e => setShopDescription(e.target.value)}
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
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <label htmlFor="#shopAddress">Shop Address</label>
                  {shopLocationError ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {shopLocationError}</span>: shopLocation && <i className="text-success fas fa-check"></i>}
                </div>
                <input type="text" id="shopAddress" className="form-control" value={shopLocation} onChange={e => handleShopLocationChange(e.target.value)} />
              </div>
              <button type="submit" className={`btn ${checkError() ? "btn-outline-dark" : "btn-outline-success"}`} disabled={checkError()}>Proceed</button>
            </div>
            <div className="col-lg-4 mx-auto">
              <h5>Shop Logo</h5>
              <input type="file" name="file" onChange={e => displayImage(e.target.files[0])} />
              <div className="uploaded-image">
                <img src={`/${shopLogo}`} ref={imageRef} alt="No shop logo" />
              </div>
              <button type="button" className="btn btn-sm btn-outline-danger mt-2" onClick={cancelImage}>Cancel image</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditShop;
