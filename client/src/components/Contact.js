import styles from "./Contact.module.css";

const Contact = () => {
  return (
    <div id="contact" className={styles.contact}>
      <div className="container text-light p-5">
        <div className="row">
          <div className="col-lg-3 col-6">
            <h4>Categories</h4>
            <ul>
              <li><a className="btn">Mobile Phones</a></li>
              <li><a className="btn">PCs/Laptops</a></li>
              <li><a className="btn">Handheld/Gadgets</a></li>
              <li><a className="btn">Electronics</a></li>
              <li><a className="btn">Home Appliances</a></li>
              <li><a className="btn">Kitchenware</a></li>
              <li><a className="btn">Furniture</a></li>
              <li><a className="btn">Men's Clothes</a></li>
              <li><a className="btn">Women's Clothes</a></li>
              <li><a className="btn">Hygiene</a></li>
              <li><a className="btn">Ornamental</a></li>
              <li><a className="btn">Vehicles</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-6">
            <h4>Company</h4>
            <ul>
              <li><a className="btn">About Us</a></li>
              <li><a className="btn">Our Team</a></li>
              <li><a className="btn">Services</a></li>
              <li><a className="btn">News</a></li>
              <li><a className="btn">Contact</a></li>
            </ul>
            <hr />
            <h4>Learn More</h4>
            <ul>
              <li><a className="btn">Community</a></li>
              <li><a className="btn">Developers</a></li>
              <li><a className="btn">Privacy Policy</a></li>
              <li><a className="btn">Terms & Conditions</a></li>
              <li><a className="btn">FAQs</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-6">
            <h4>Get Started</h4>
            <ul>
              <li><a className="btn">Login</a></li>
              <li><a className="btn">Signup</a></li>
              <li><a className="btn">Usage Guide</a></li>
              <li><a className="btn">Products</a></li>
            </ul>
            <hr />
            <h4>Social Media</h4>
            <ul>
              <li><a className="btn"><i className="fab fa-facebook"></i> Facebook</a></li>
              <li><a className="btn"><i className="fab fa-twitter"></i> Twitter</a></li>
              <li><a className="btn"><i className="fab fa-instagram"></i> Instagram</a></li>
              <li><a className="btn"><i className="fab fa-google"></i> Google+</a></li>
              <li><a className="btn"><i className="fab fa-pinterest"></i> Pinterest</a></li>
              <li><a className="btn"><i className="fab fa-linkedin"></i> LinkedIn</a></li>
            </ul>
          </div>
          <div className="col-lg-3 col-6">
            <h4 className="mb-3">Contact</h4>
            <h6><i className="fa fa-envelope"></i> Email</h6>
            <ul>
              <li>daniyal.amir110@gmail.com</li>
              <li>hannanashraf333@gmail.com</li>
              <li>johndoe123@gmail.com</li>
            </ul>
            <hr />
            <h6><i className="fa fa-phone"></i> Phone</h6>
            <ul>
              <li>+92 304 2868395</li>
              <li>+92 300 1234567</li>
              <li>+92 301 3579246</li>
            </ul>
            <hr />
            <h4>Customer Care</h4>
            <ul>
              <li><a className="btn">Submit Feedback</a></li>
              <li><a className="btn">Report Abuse</a></li>
            </ul>
          </div>
        </div>
        <hr />
        <p className="text-center">&copy; 2021 Buybuy.pk, Pakistan</p>
      </div>
    </div>
  );
}

export default Contact;
