import styles from "./Services.module.css";

// Import the images
import onlineStore from "../images/online-store.jpg";
import braodVariety from "../images/broad-variety.jpg";
import easierTrading from "../images/easier-trading.jpg";

const Services = () => {
  return (
    <div id="services" className={"p-5 " + styles.services}>
      <div className="container text-light">
        <div className="row">
          <div className="col-12">
            <h1 className="display-3 text-center">Services</h1>
            <div className="heading-divider-light mx-auto"></div>
          </div>
        </div>
        <div className="row row-eq-height">
          <div className={"col-lg-4 col-md-6 mx-auto " + styles.card}>
            <div className={styles.imageWrapper}>
              <img src={onlineStore} alt="online store" />
            </div>
            <h2 className="display-5 text-center font-weight-light">Online Stores</h2>
            <hr />
            <p className="lead text-center">Can't afford to have a physical store? With Buybuy, you can avail the opportunity of creating your free virtual shop, and reach out to the public on a larger scale, even though if you don't have a physical store. Go ahead! Avail the exclusive opportunity, subscribe to our service and grow up your business.</p>
          </div>
          <div className={"col-lg-4 col-md-6 mx-auto " + styles.card}>
            <div className={styles.imageWrapper}>
              <img src={braodVariety} alt="online store" />
            </div>
            <h2 className="display-5 text-center font-weight-light">Broad Variety</h2>
            <hr />
            <p className="lead text-center">Roam around the whole market just by swiping through your cellphone screen and throw your favorite items in your carts and order them anytime. Here, you will find all the products of everyday need, from handheld gadgets or accessories, to home appliances, to vehicles, everything. You can add your needed items in your carts and order them anytime.</p>
          </div>
          <div className={"col-lg-4 col-md-6 mx-auto " + styles.card}>
            <div className={styles.imageWrapper}>
              <img src={easierTrading} alt="online store" />
            </div>
            <h2 className="display-5 text-center font-weight-light">Easier trading</h2>
            <hr />
            <p className="lead text-center">We care for our users and like them to do minimal effort for trade. We make ecommerce easier by providing a communication platform to our users, and deliver the products at their doorsteps. All you have to do is just create your account, enjoy the experience, and leave the rest of the work on us.</p>
          </div>
        </div>
        <div class="row">
          <div class={"mx-auto rounded-circle border-secondary " + styles.benefits}>
            <div className={styles.ball}></div>
            <div className={styles.ball}></div>
            <div className={styles.ball}></div>
            <ul className="lead">
              <h5 className="display-4">Benefits</h5>
              <li>Cost Effective</li>
              <li>Customizable Shops</li>
              <li>Unlimited products</li>
              <li>More Public Attention</li>
              <li>Order Statistics</li>
              <li>On-time Delivery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
