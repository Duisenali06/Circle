import Home from "./Home.jsx";
import SecondSection from "./SecondSection.jsx";
import ThirdSection from "./ThirdSection.jsx";
import FourthSection from "./FourthSection.jsx";
// import FifthSection from "./FifthSection.jsx";
import SixSection from "./SixSection.jsx";
import SevenSection from "./SevenSection.jsx";
import EightSection from "./EightSection.jsx";
import NineSection from "./NineSection.jsx";
import Conclusion from "./Conclusion.jsx";
import Footer from "./Footer.jsx";

import background from '../images/background.png'

const Layout = () => {
    return (
        <>
            <Home/>
            <div className='h-5'></div>
            <div className='rounded-t-4xl
             '
                 style={{ backgroundImage: `url(${background})` }}
            >
                <SecondSection/>
                <ThirdSection/>
                <FourthSection/>
                {/*<FifthSection/>*/}
                <SixSection/>
                <SevenSection/>
                <EightSection/>
                <NineSection/>
                <Conclusion/>
                <Footer/>
            </div>


        </>
    );
};

export default Layout;

// bg-[linear-gradient(135deg,#FFD77A,#FFE699,#FFCC80,#FFD6B0,#FFE0F0)]