const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Passport = require("./passport");
const path = require("path");
const uploadImage = require("./upload-image");
const conn = require("./conn");
const mail = require("./mail");
const fs = require("fs");

// Create a router
const router = new require("express").Router();

// Generic routes
router.get("/user", (req, res) => {
  res.send({ user: req.user });
});

router.post("/signup", (req, res) => {
  const { firstName, lastName, username, email, password, password2, accountType } = req.body;
  const hashPassword = bcrypt.hashSync(password, 12);
  const secret = Math.floor(1000 + Math.random() * 9000);
  conn.query("CALL signup(?, ?, ?, ?, ?, ?, ?)", [firstName, lastName, username, email, secret, accountType, hashPassword], (err) => {
    if (err) res.send({ error: "Couldn't sign you up." });
    else {
      mail(email, "verify.html", { firstName: firstName, secret: secret });
      res.send({ success: "User signed up." })
    };
  });
});

router.get("/check-username", (req, res) => {
  conn.query("SELECT user_id FROM user WHERE username = ?", [req.query.username], (err, rows) => {
    res.send({ exists: !!rows.length });
  });
});

router.get("/check-email", (req, res) => {
  conn.query("SELECT user_id FROM user WHERE email = ?", [req.query.email], (err, rows) => {
    res.send({ exists: !!rows.length });
  });
});

router.post("/login", (req, res, next) => {
  Passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.send({ error: "Incorrect username or password" });
    req.login(user, next);
  })(req, res, next);
}, (req, res) => {
  res.send({ user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.send({ success: "Logged out of session" });
});

router.post("/verify-email", (req, res) => {
  conn.query("CALL verify_email(?, ?)", [req.user.username, req.body.secret], (err, rows) => {
    res.send(rows[0][0]);
  });
});

router.post("/change-general-info", (req, res) => {
  const userId = req.user.user_id;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const username = req.body.username;
  let email = req.body.email;
  let secret = req.user.secret;
  let verified = req.user.verified;
  if (email !== req.user.email) {
    secret = Math.floor(1000 + Math.random() * 9000);
    verified = false;
    email = req.body.email;
    req.logout();
    req.session.destroy();
  }
  conn.query("CALL`change_general_info`(?, ?, ?, ?, ?, ?, ?)", [userId, firstName, lastName, email, username, secret, verified], err => {
    if (err) {
      console.log(err);
      res.send({ error: "Something went wrong" })
    }
    else {
      mail(email, "verify.html", { firstName: req.body.firstName, secret: secret });
      res.send({ success: "Info updated. " });
    }
  })
})

router.post("/change-password", (req, res) => {
  if (req.body.password === req.body.password2) {
    if (!bcrypt.compareSync(req.body.password, req.user.password)) {
      conn.query("CALL change-password(?, ?)", [req.user.username, req.body.password], (err) => {
        res.send({ success: "Password updated" });
      });
    } else res.send({ error: "Passwords don't match" });
  } else res.send({ error: "Passwords don't match" });
});

router.post("/change-profile-image", (req, res) => {
  let filename = req.user.profile_image;
  uploadImage(filename)(req, res, (err) => {
    if (err) {
      res.send(500);
    } else {
      conn.query("CALL `change_profile_image`(?, ?)", [req.user.username, req.file.filename], err => {
        res.send({ success: "Profile image uploaded successfully" });
      });
    }
  })
});

router.post("/delete-profile-image", (req, res) => {
  let filename = req.user.profile_image
  if (filename) {
    fs.unlinkSync("public/" + filename);
    conn.query("CALL `change_profile_image`(?, ?)", [req.user.username, null], err => {
      res.send({ success: "Profile image removed successfully" });
    });
  } else {
    res.send(401);
  }
});

router.get("/get-logs", (req, res) => {
  conn.query("SELECT * FROM logs WHERE user_id = ? ORDER BY created_at DESC", [req.user.user_id], (err, rows) => {
    res.send({logs: rows});
  })
})

// Seller-specific routes

router.post("/create-shop", (req, res) => {
  uploadImage()(req, res, err => {
    conn.query("CALL `create_shop`(?, ?, ?, ?)", [req.body.shopTitle, req.body.shopDescription, req.body.shopLocation, req.user.user_id], (err, rows) => {
      if (err) {console.log(err); res.send({ error: "Error setting up your shop" })}
      else res.send({ success: "Shop Created.", shopId: rows[0][0]['LAST_INSERT_ID()'] });
    });
  });
});

router.post("/edit-shop", (req, res) => {
  uploadImage()(req, res, err => {
    conn.query("CALL `edit_shop`(?, ?, ?, ?, ?)", [req.body.shopId, req.body.shopTitle, req.body.shopDescription, req.body.shopLocation, req.user.user_id], (err, rows) => {
      if (err) {console.log(err); res.send({ error: "Error updating your shop" })}
      else res.send({ success: "Shop Info Updated." });
    });
  });
});

router.post("/change-shop-logo", (req, res) => {
  let filename;
  conn.query("SELECT shop_id, shop_logo FROM `shop` WHERE shop_id = ?", [req.query.shopId], (err, rows) => {
    if (rows.length > 0) { filename = rows[0].shop_logo }
    uploadImage(filename)(req, res, (err) => {
      if (err) {
        res.send(500);
      } else {
        if (req.file) {
          conn.query("CALL `change_shop_logo`(?, ?)", [req.query.shopId, req.file.filename], err => {
            res.send({ success: "Shop Logo uploaded successfully" });
          });
        } else res.send({ error: "File not found" });
      }
    });
  });
});

router.get("/get-seller-shops", (req, res) => {
  conn.query("CALL `get_seller_shops`(?)", [req.user.user_id], (err, rows) => {
    res.send({ shops: rows[0] });
  });
});

router.get("/get-seller-shop-by-id", (req, res) => {
  conn.query("CALL `get_seller_shop_by_id`(?, ?)", [req.query.shopId, req.user.user_id], (err, rows) => {
    res.send({ shop: rows[0][0], categories: rows[1] });
  });
});

router.post("/add-product", (req, res) => {
  console.log(req.body.inStock)
  conn.query("CALL `add_product`(?, ?, ?, ?, ?, ?)", [req.body.productName, req.body.category, req.body.productDescription, req.body.price, req.body.inStock, req.body.shopId], (err, rows) => {
    res.send({ success: "Product added",  productId: rows[0][0]['LAST_INSERT_ID()'] });
  });
});

router.post("/change-product-image", (req, res) => {
  let filename;
  conn.query("SELECT product_id, product_image FROM `product` WHERE product_id = ?", [req.query.productId], (err, rows) => {
    if (rows.length > 0) { filename = rows[0].product_image }
    uploadImage(filename)(req, res, (err) => {
      if (err) {
        res.send(500);
      } else {
        conn.query("CALL `change_product_image`(?, ?)", [rows[0].product_id, req.file.filename], err => {
          res.send({ success: "Shop Logo uploaded successfully" });
        });
      }
    });
  });
});

router.get("/get-orders-by-seller-id", (req, res) => {
  conn.query("SELECT * FROM `get_order_details` WHERE owner_id=?", [req.user.user_id], (err, rows) => {
    res.send({ orderDetails: rows });
  });
});

router.post("/confirm-order", (req, res) => {
  conn.query("UPDATE `order` SET `status` = ?, `delivery_charges` = ?, `delivery_date` = DATE_ADD(NOW(), INTERVAL ? DAY) WHERE order_id = ?", ["confirmed", req.body.charges, req.body.deliveryTime, req.body.orderId], (err) => {
    console.log(err);
    if (!err) res.send({success: "Order confirmed" });
  });
})

// Buyer-specific
router.get("/get-products-by-shopid", (req, res) => {
  conn.query("SELECT * FROM `get_all_products` WHERE shop_id = ?", [req.query.shopId], (err, rows) => {
    res.send({ products: rows });
  });
});

router.get("/get-all-shops", (req, res) => {
  conn.query("SELECT * FROM shop", (err, rows) => {
    res.send({ shops: rows });
  });
});

router.get("/get-shop-details-by-id", (req, res) => {
  conn.query("CALL `get_shop_details_by_id`(?)", [req.query.shopId], (err, rows) => {
    res.send({ shop: rows[0][0], categories: rows[1] });
  });
});

router.get("/get-all-products", (req, res) => {
  conn.query("CALL `products_view`()", (err, rows) => {
    res.send({ products: rows[1], categories: rows[0] });
  });
});

router.get("/get-product-by-id", (req, res) => {
  conn.query("SELECT * FROM `get_all_products` WHERE product_id = ?", [req.query.productId], (err, rows) => {
    res.send({ product: rows[0] });
  });
});

router.post("/add-to-cart", (req, res) => {
  conn.query("CALL add_to_cart(?, ?, ?)", [req.user.user_id, req.body.productId, req.body.qty], (err) => {
    if (err) {console.log(err); res.send({error: "An error occurred"});}
    else res.send({success: "Added item to cart"});
  });
});

router.get("/get-cart", (req, res) => {
  conn.query("SELECT * FROM cart_info WHERE user_id = ?", [req.user.user_id], (err, rows) => {
    res.send({ success: "Carts found", carts: rows });
  });
});

router.post("/remove-from-cart", (req, res) => {
  conn.query("DELETE FROM `cart` WHERE user_id = ? AND product_id = ?", [req.user.user_id, req.body.productId], (err) => {
    if (err) res.send({ error: "An error occurred" });
    else res.send({ success: "Item removed from cart" });
  });
});

router.post("/place-order", (req, res) => {
  conn.query("CALL place_order(?, ?, ?)", [req.user.user_id, req.body.shopId, req.body.location], (err, rows) => {
    const orderId = rows[0][0]["LAST_INSERT_ID()"];
    let sql = "INSERT INTO `order_product`(order_id, product_id, quantity) VALUES";
    req.body.cart.forEach(item => {
      sql += `(${orderId}, ${item.product_id}, ${item.quantity}),`
    });
    sql = sql.replace(/,\s*$/, "");
    conn.query(sql, err => {
      res.send({ success: "Order Placed" });
    });
  });
});

router.get("/get-order-details", (req, res) => {
  conn.query("SELECT * FROM `get_order_details` WHERE buyer_id=?", [req.user.user_id], (err, rows) => {
    res.send({ orderDetails: rows });
  });
});

router.post("/cancel-order", (req, res) => {
  conn.query("DELETE FROM `order` WHERE order_id = ?", [req.body.orderId], (err) => {
    console.log(err);
    if (!err) res.send({success: "Order cancelled"});
  });
});

module.exports = router;
