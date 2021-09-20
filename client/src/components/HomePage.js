//Import the components
import Navbar from "./Navbar";
import Header from "./Header";
import About from "./About";
import Services from "./Services";
import Contact from "./Contact";

const HomePage = () => {
  return (
    <div id="home">
      <Navbar transparent={true} />
      <Header />
      <About />
      <Services />
      <Contact />
    </div>
  );
}

export default HomePage;
