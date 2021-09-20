CREATE TABLE `user` (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(64) NOT NULL,
  last_name VARCHAR(64) NOT NULL,
  username VARCHAR(64) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  secret VARCHAR(255) NOT NULL UNIQUE,
  verified BOOLEAN NOT NULL DEFAULT 0,
  account_type VARCHAR(16),
  is_locked BOOLEAN DEFAULT 0,
  password VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

DELIMITER $$
CREATE PROCEDURE `signup` (
  IN first_name VARCHAR(64),
  IN last_name VARCHAR(64),
  IN username VARCHAR(64),
  IN email VARCHAR(255),
  IN secret VARCHAR(4),
  IN account_type VARCHAR(16),
  IN password VARCHAR(255)
)
BEGIN
  INSERT INTO `user`(
    `first_name`,
    `last_name`,
    `username`,
    `email`,
    `secret`,
    `account_type`,
    `password`
  ) VALUES (
    first_name,
    last_name,
    username,
    email,
    secret,
    account_type,
    password
  );
END $$
DELIMITER ;

CALL `signup`("Daniyal", "Aamir", "admin290102", "daniyal.amir110@gmail.com", "4212", "admin", "Daniyal290102");

DELIMITER $$
CREATE PROCEDURE `get_user` (
  IN username VARCHAR(64)
)
BEGIN
  SELECT *
  FROM `user`
  WHERE `user`.`username` = username;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `verify_email` (
  IN username VARCHAR(64),
  IN secret VARCHAR(4)
)
BEGIN
  DECLARE done BOOLEAN DEFAULT 0;

  UPDATE `user`
  SET verified = 1
  WHERE `user`.`username` = username AND `user`.`secret` = secret;

  SELECT verified
  FROM `user`
  WHERE `user`.`username` = username;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `verify_email` (
  IN username VARCHAR(64),
  IN secret VARCHAR(4)
)
BEGIN
  DECLARE done BOOLEAN DEFAULT 0;

  UPDATE `user`
  SET verified = 1
  WHERE `user`.`username` = username AND `user`.`secret` = secret;

  SELECT verified
  FROM `user`
  WHERE `user`.`username` = username;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `change_general_info` (
  IN user_id INT,
  IN first_name VARCHAR(64),
  IN last_name VARCHAR(64),
  IN email VARCHAR(255),
  IN username VARCHAR(64),
  IN secret VARCHAR(4),
  IN verified BOOLEAN
)
BEGIN
  UPDATE `user`
  SET
    `user`.`first_name` = first_name,
    `user`.`last_name` = last_name,
    `user`.`email` = email,
    `user`.`secret` = secret,
    `user`.`verified` = verified,
    `user`.`username` = username
  WHERE `user`.`user_id` = user_id;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `change_password` (
  IN username VARCHAR(64),
  IN password VARCHAR(255)
)
BEGIN
  UPDATE `user`
  SET `user`.`password` = password
  WHERE `user`.`username` = username;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `change_profile_image` (
  IN username VARCHAR(64),
  IN profile_image VARCHAR(255)
)
BEGIN
  UPDATE `user`
  SET `user`.`profile_image` = profile_image
  WHERE `user`.`username` = username;
END $$
DELIMITER ;

CREATE TABLE `shop` (
  shop_id INT PRIMARY KEY AUTO_INCREMENT,
  shop_title VARCHAR(64) NOT NULL,
  shop_description TEXT NOT NULL,
  shop_location VARCHAR(255) NOT NULL,
  shop_logo VARCHAR(255),
  owner_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP
);

ALTER TABLE `shop`
ADD FOREIGN KEY(owner_id)
REFERENCES `user`.user_id
ON DELETE CASCADE;

DELIMITER $$
CREATE PROCEDURE `create_shop`(
  IN shop_title VARCHAR(64),
  IN shop_description TEXT,
  IN shop_location VARCHAR(255),
  IN owner_id INT
)
BEGIN
  INSERT INTO `shop`(
    `shop_title`,
    `shop_description`,
    `shop_location`,
    `owner_id`
  ) VALUES (
    shop_title,
    shop_description,
    shop_location,
    owner_id
  );
  SELECT LAST_INSERT_ID();
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `edit_shop`(
  IN shop_id INT,
  IN shop_title VARCHAR(64),
  IN shop_description TEXT,
  IN shop_location VARCHAR(255),
  IN owner_id INT
)
BEGIN
  UPDATE `shop`
  SET
    `shop`.`shop_title` = shop_title,
    `shop`.`shop_description` = shop_description,
    `shop`.`shop_location` = shop_location
  WHERE
    `shop`.`shop_id` = shop_id
  AND
    `shop`.`owner_id` = owner_id;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `change_shop_logo`(
  IN shop_id INT,
  IN shop_logo VARCHAR(255)
)
BEGIN
  UPDATE `shop`
  SET `shop`.`shop_logo` = shop_logo
  WHERE `shop`.`shop_id` = shop_id;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `get_seller_shops`(
  IN owner_id INT
)
BEGIN
  SELECT *
  FROM `shop`
  WHERE `shop`.`owner_id` = owner_id;
END $$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `get_seller_shop_by_id`(
  IN shop_id INT,
  IN owner_id INT
)
BEGIN
  SELECT *
  FROM `shop`
  WHERE
    `shop`.`shop_id` = shop_id
  AND
    `shop`.`owner_id` = owner_id;
  SELECT *
  FROM `category`;
END $$
DELIMITER ;

CREATE TABLE `category` (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(64) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
);

DELIMITER $$
CREATE PROCEDURE `add_category`(
  IN category_name VARCHAR(64)
)
BEGIN
  INSERT INTO `category`(
    `category_name`
  ) VALUES (
    category_name
  );
END$$
DELIMITER ;

CREATE TABLE `product` (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(64) NOT NULL,
  category_id INT NOT NULL,
  product_description TEXT NOT NULL,
  product_price INT NOT NULL,
  in_stock BOOLEAN NOT NULL DEFAULT FALSE,
  shop_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  product_image VARCHAR(255)
);

ALTER TABLE `product`
ADD FOREIGN KEY(shop_id)
REFERENCES `shop`.shop_id
ON DELETE CASCADE;

ALTER TABLE `product`
ADD FOREIGN KEY(category_id)
REFERENCES `category`.category_id
ON DELETE CASCADE;

DELIMITER $$
CREATE PROCEDURE `add_product`(
  IN product_name VARCHAR(64),
  IN category_id INT,
  IN product_description TEXT,
  IN product_price INT,
  IN in_stock BOOLEAN,
  IN shop_id INT
)
BEGIN
  INSERT INTO `product`(
    `product_name`,
    `category_id`,
    `product_description`,
    `product_price`,
    `in_stock`,
    `shop_id`
  ) VALUES (
    product_name,
    category_id,
    product_description,
    product_price,
    in_stock,
    shop_id
  );
  SELECT LAST_INSERT_ID();
END$$
DELIMITER ;

DELIMITER $$
CREATE PROCEDURE `change_product_image`(
  IN product_id INT,
  IN product_image VARCHAR(255)
)
BEGIN
  UPDATE `product`
  SET `product`.`product_image` = product_image
  WHERE `product`.`product_id` = product_id;
END $$
DELIMITER ;

CREATE VIEW get_all_products AS
SELECT `product`.*, `category`.category_name, `shop`.shop_title
FROM `product`
INNER JOIN `category`
ON `product`.category_id = `category`.category_id
INNER JOIN `shop`
ON `product`.shop_id = `shop`.shop_id;

DELIMITER $$
CREATE PROCEDURE `products_view`()
BEGIN
  SELECT * FROM `category`;
  SELECT * FROM `get_all_products`;
END $$
DELIMITER ;

CREATE TABLE `reviews` (
  comment_id INT PRIMARY KEY AUTO_INCREMENT,
  comment_body TEXT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `reviews`
ADD FOREIGN KEY(user_id)
REFERENCES `user`.user_id
ON DELETE CASCADE;

CREATE TABLE `cart` (
  user_id INT,
  product_id INT,
  quantity INT NOT NULL
);

ALTER TABLE `cart`
ADD FOREIGN KEY(user_id)
REFERENCES `user`(user_id)
ON DELETE CASCADE;

ALTER TABLE `cart`
ADD FOREIGN KEY(product_id)
REFERENCES `product`(product_id)
ON DELETE CASCADE;

ALTER TABLE `cart`
ADD PRIMARY KEY(user_id, product_id);

DELIMITER $$
CREATE PROCEDURE `add_to_cart`(
  IN user_id INT,
  IN product_id INT,
  IN quantity INT
)
BEGIN
  INSERT INTO `cart` (
    `user_id`,
    `product_id`,
    `quantity`
  ) VALUES (
    user_id,
    product_id,
    quantity
  );
END $$
DELIMITER ;

CREATE VIEW `cart_info`
AS
  SELECT
    cart.*,
    `product`.product_name,
    `product`.product_price,
    `product`.shop_id,
    `shop`.shop_title
  FROM `cart`
  INNER JOIN `product`
  ON `product`.product_id = `cart`.product_id
  INNER JOIN `shop`
  ON `shop`.shop_id = `product`.shop_id;

DELIMITER $$
CREATE PROCEDURE `get_shop_details_by_id`(
  IN shop_id INT
)
BEGIN
  SELECT *
  FROM `shop`
  WHERE
    `shop`.`shop_id` = shop_id;
  SELECT *
  FROM `category`;
END $$
DELIMITER ;

CREATE TABLE `order` (
  order_id INT PRIMARY KEY AUTO_INCREMENT,
  buyer_id INT NOT NULL,
  shop_id INT NOT NULL,
  order_location VARCHAR(255),
  status VARCHAR(16) NOT NULL DEFAULT "unconfirmed",
  delivery_charges INT NOT NULL DEFAULT 0,
  delivery_date DATETIME
);

ALTER TABLE `order`
ADD FOREIGN KEY (buyer_id)
REFERENCES `user` (user_id)
ON DELETE CASCADE;

ALTER TABLE `order`
ADD FOREIGN KEY (shop_id)
REFERENCES `shop` (shop_id)
ON DELETE CASCADE;

DELIMITER $$
CREATE PROCEDURE `place_order`(
  IN buyer_id INT,
  IN shop_id INT,
  IN order_location VARCHAR(255)
)
BEGIN
  INSERT INTO `order`(
    `buyer_id`,
    `shop_id`,
    `order_location`
  ) VALUES (
    buyer_id,
    shop_id,
    order_location
  );
  SELECT LAST_INSERT_ID();
END$$
DELIMITER ;

CREATE TABLE `order_product`(
  order_id INT,
  product_id INT,
  quantity INT
);

ALTER TABLE `order_product`
ADD FOREIGN KEY (order_id)
REFERENCES `order`(order_id)
ON DELETE CASCADE;

ALTER TABLE `order_product`
ADD FOREIGN KEY (product_id)
REFERENCES `product`(product_id)
ON DELETE CASCADE;

CREATE VIEW `get_order_details`
AS
SELECT
  `order`.*,
  `order_product`.product_id,
  `order_product`.quantity,
  `product`.product_name,
  `product`.product_price,
  `product`.product_price * `order_product`.quantity AS subtotal,
  `shop`.shop_title,
  `shop`.owner_id
FROM `order`
INNER JOIN `order_product`
ON `order`.order_id = `order_product`.order_id
INNER JOIN `product`
ON `order_product`.product_id = `product`.product_id
INNER JOIN `shop`
ON `product`.shop_id = `shop`.shop_id;

CREATE TABLE `logs` (
  log_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `logs`
ADD FOREIGN KEY (user_id)
REFERENCES `user` (user_id)
ON DELETE CASCADE;

-- Triggers

DELIMITER $$
CREATE PROCEDURE `insert_log` (
  IN user_id INT,
  IN message TEXT
)
BEGIN
  INSERT INTO `logs`(
    `user_id`, `message`
  ) VALUES (
    user_id, message
  );
END $$

CREATE TRIGGER `after_signup`
AFTER INSERT
ON `user` FOR EACH ROW
BEGIN
  CALL `insert_log`(NEW.user_id, CONCAT("<b>Congratulations ", NEW.first_name, "</b>, you successfully signed up with your ", NEW.account_type, " account."));
END$$

CREATE TRIGGER `after_general_info_change`
AFTER UPDATE
ON `user` FOR EACH ROW
BEGIN
  CALL `insert_log`(NEW.user_id, "You changed your account info.");
END$$

CREATE TRIGGER `after_create_shop`
AFTER INSERT
ON `shop` FOR EACH ROW
BEGIN
  CALL `insert_log`(NEW.owner_id, CONCAT("You set up your new shop <b>", NEW.shop_title, "</b>. <a href='/seller/shops/shop?shopId=", NEW.shop_id, "'>Visit your shop</a>"));
END $$

CREATE TRIGGER `after_add_product`
AFTER INSERT
ON `product` FOR EACH ROW
BEGIN
  CALL `insert_log`((SELECT `owner_id` FROM `shop` WHERE shop.`shop_id` = NEW.shop_id), CONCAT("You added a new product <b>", NEW.product_name, "</b>"));
END $$

CREATE TRIGGER `after_order_placed`
AFTER INSERT
ON `order_product` FOR EACH ROW
BEGIN
  DELETE FROM `cart`
  WHERE
    user_id IN (
      SELECT DISTINCT buyer_id
      FROM `order`
      WHERE `order`.order_id = NEW.order_id
    )
  AND
    product_id = NEW.product_id;
END$$
DELIMITER;
