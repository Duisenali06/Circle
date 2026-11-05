import React, {useState} from 'react';
import {headerData} from "../data/headerData.js";
import coffeeLogo from "../images/coffeeLogo.svg"
import DropDownBtn from "../ui/DropDownBtn.jsx";
import Button from "../ui/Button.jsx";

const Header = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <header className='bg-yellow-300 px-5 py-5 '>
                <nav
                    className={`bg-white relative px-4 py:1.25  lg:px-15
                    grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center
                    ${open ? 'rounded-t-4xl rounded-b-none' : 'rounded-4xl'}
                     `}>
                    <a href=""> <img src={coffeeLogo} alt=""/></a>
                    <div className='hidden md:flex gap-x-4 pr-2 justify-center'>
                        {headerData.map((header) => (
                            <a key={header.path} href={header.path}>{header.title}</a>
                        ))}
                    </div>
                    <div className='hidden md:flex gap-x-3 justify-end'>
                        <DropDownBtn>рус</DropDownBtn>
                        <Button>Связаться с нами</Button>
                    </div>
                    <button className='justify-self-end md:hidden' onClick={() => {
                        setOpen(!open)
                    }}>
                        ☰
                    </button>
                    {open && (
                        <div className='absolute top-full rounded-b-4xl pb-3 left-0 w-full flex flex-col pl-4 bg-white md:hidden'>
                            <div className='flex flex-col'>
                                {headerData.map((header) => (
                                    <a key={header.path} href={header.path}>{header.title}</a>
                                ))}
                            </div>
                            <div className='flex gap-x-4'>
                                <DropDownBtn>рус</DropDownBtn>
                                <Button>Связаться с нами</Button>
                            </div>

                        </div>



                    )}


                </nav>
            </header>
        </>

    );
};

export default Header;
