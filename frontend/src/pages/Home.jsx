import AboutSection from "../component/AboutSection";
import Disclaimer from "../component/Disclaimer";
import HeroSection from "../component/HeroSection";
import Navbar from "../component/Navbar";

function Home(){
    return (
        <div>
            <Navbar />
            <HeroSection />
            <AboutSection />
            <Disclaimer />
        </div>
    )
}

export default Home;