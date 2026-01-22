import Header from "./Header.jsx";
import Logo from "../images/Logo.png";
import Footer from "./Footer.jsx";


const Home = () => {
    return (
       <>
           <Header/>
           {/*<Footer/>*/}
           <section className='bg-yellow-300 pb-40 pt-[70px] md:pt-[175px] rounded-b-4xl'>
               <img className='m-auto' src={Logo} alt=""/>
               <h1 className='flex justify-center text-4xl  font-bold md:text-[88px] '>STEPPE COFFEE</h1>
           </section>
       </>
    );
};

export default Home;