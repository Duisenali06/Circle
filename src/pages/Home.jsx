import Logo from "../images/Logo.png";
import Footer from "./Footer.jsx";
import background from "../images/background.png";
import SecondSection from "./SecondSection.jsx";
import ThirdSection from "./ThirdSection.jsx";
import FourthSection from "./FourthSection.jsx";
import SixSection from "./SixSection.jsx";
import SevenSection from "./SevenSection.jsx";
import EightSection from "./EightSection.jsx";
import NineSection from "./NineSection.jsx";
import Conclusion from "./Conclusion.jsx";


const Home = () => {
    return (
       <>

           <section className='bg-yellow-300 pb-40 pt-[70px] md:pt-[175px] rounded-b-4xl'>
               <img className='m-auto' src={Logo} alt=""/>
               <h1 className='flex justify-center text-4xl  font-bold md:text-[88px] '>STEPPE COFFEE</h1>
           </section>
           <div className='h-5'></div>
           <div className='rounded-t-4xl
             '
                style={{ backgroundImage: `url(${background})` }}
           >
               <SecondSection/>
               <ThirdSection/>
               <FourthSection/>
               <SixSection/>
               <SevenSection/>
               <EightSection/>
               <NineSection/>
               <Conclusion/>
               {/*<Footer/>*/}
           </div>
       </>
    );
};

export default Home;
