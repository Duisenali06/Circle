
import Footer from "./Footer.jsx";

import Header from "./Header.jsx";
import {Outlet} from "react-router-dom";
import background from "../images/background.png";

const Layout = () => {
    return (
        <>

            <div className='rounded-t-4xl
             '
                 style={{ backgroundImage: `url(${background})` }}
            >
                <Header/>
                <Outlet/>
                <Footer/>

            </div>




        </>
    );
};

export default Layout;

// bg-[linear-gradient(135deg,#FFD77A,#FFE699,#FFCC80,#FFD6B0,#FFE0F0)]