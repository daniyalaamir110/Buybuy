import { useState, useEffect } from "react";
import slide1 from "../images/slide1.png";
import slide2 from "../images/slide2.png";
import slide3 from "../images/slide3.png";
import slide4 from "../images/slide4.png";
import slide5 from "../images/slide5.png";
import styles from "./Header.module.css";

const Header = () => {

  const [slide, setSlide] = useState(0);
  const [slideInterval, setSlideInterval] = useState(null);

  const nextSlide = () => {
    setSlide((slide + 1) % 5);
  }

  const prevSlide = () => {
    setSlide((slide + 4) % 5);
  }

  useEffect(() => {
    clearInterval(slideInterval);
    setSlideInterval(setInterval(() => {
      nextSlide();
    }, 10000));
    return () => {
      clearInterval(slideInterval);
    }
  }, [slide]);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.hrFull);
        } else {
          entry.target.classList.remove(styles.hrFull);
        }
      });
    });
    document.querySelectorAll("hr").forEach(element => {
      observer.observe(element);
    })
  }, []);

  return (
    <header id="home" className={styles.header}>
      <div className={styles.background}>
        <div className={styles.slider}>
          <div className={styles.slides} style={{ transform: `translateX(-${100 * slide}%)` }}>
            <div className={`${styles.slide} ${styles.slide1}`}>
              <div className={styles.text}>
                <h1>Catch Up Online Shoppers</h1>
                <hr />
                <p>Get access to hundreds of online shoppers around you.</p>
                <div>
                  <a className="btn btn-outline-light lead mx-1" href="/">Sign up</a>
                  <a className="btn btn-outline-light lead mx-1" href="#about">Learn more</a>
                </div>
              </div>
              <div>
                <img src={slide1} alt="slide1" />
              </div>
            </div>
            <div className={`${styles.slide} ${styles.slide2}`}>
              <div className={styles.text}>
                <h1>Use your resources efficiently</h1>
                <hr />
                <p>Easy to get a lot of things done in no time. Save your time and energy</p>
                <div>
                <a className="btn btn-outline-light lead mx-1" href="/">Sign up</a>
                <a className="btn btn-outline-light lead mx-1" href="#about">Learn more</a>
                </div>
              </div>
              <div>
                <img src={slide2} alt="slide2" />
              </div>
            </div>
            <div className={`${styles.slide} ${styles.slide3}`}>
              <div className={styles.text}>
                <h1>You are just one touch away</h1>
                <hr />
                <p>Order any product, from small gadgets and accessories to bigger appliances by a single touch of your cell phone</p>
                <div>
                <a className="btn btn-outline-light lead mx-1" href="/">Sign up</a>
                <a className="btn btn-outline-light lead mx-1" href="#about">Learn more</a>
                </div>
              </div>
              <div>
                <img src={slide3} alt="slide3" />
              </div>
            </div>
            <div className={`${styles.slide} ${styles.slide4}`}>
              <div className={styles.text}>
                <h1>Create your own virtual shop</h1>
                <hr />
                <p>Do you want to get more public attention and awareness towards your business? We can be a good solution for it</p>
                <div>
                <a className="btn btn-outline-light lead mx-1" href="/">Sign up</a>
                <a className="btn btn-outline-light lead mx-1" href="#about">Learn more</a>
                </div>
              </div>
              <div>
                <img src={slide4} alt="slide4" />
              </div>
            </div>
            <div className={`${styles.slide} ${styles.slide5}`}>
              <div className={styles.text}>
                <h1>Your views matter</h1>
                <hr />
                <p>We very much appreciate how our users feel being a part of us. Dont hesitate to leaving your valuable feedback.</p>
                <div>
                <a className="btn btn-outline-light lead mx-1" href="/">Sign up</a>
                <a className="btn btn-outline-light lead mx-1" href="#about">Learn more</a>
                </div>
              </div>
              <div>
                <img src={slide5} alt="slide5" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.left}>
        <button onClick={prevSlide}><i class="fas fa-chevron-left"></i></button>
      </div>
      <div className={styles.right}>
        <button onClick={nextSlide}><i class="fas fa-chevron-right"></i></button>
      </div>
      <div className={styles.dots}>
        {[...Array(5).keys()].map(i => <div className={`${styles.dot} ${slide === i ? styles.filled : ""}`} onClick={() => { setSlide(i) }}></div>)}
      </div>
    </header>
  );
}

export default Header;
