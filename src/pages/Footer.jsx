import circleLogo from '../images/circleLogo.png'
import call from '../images/Call.svg'
import mail from '../images/Mail.svg'
import location from '../images/Location.svg'

const Footer = () => {
    return (
        <>
            <footer>
                <div className='flex flex-col md:flex-row mg:px-10 lg:px-30 py-20 justify-between items-center'>
                    <div>
                        <img className='w-[200px]' src={circleLogo} alt=""/>
                        <p className='hidden md:block pl-3 w-[300px]' >Circle Creative Buro – креативное бюро и рекламное агентство полного цикла в Алматы.
                            Развиваем бренды в цифровом пространстве и за его пределами: стратегия, креатив, веб, моушн,
                            интерьеры под ключ.</p>
                    </div>
                    <div className='flex flex-col items-center md:items-start gap-y-4'>
                        <p className=' text-[32px]'>Контакты</p>
                        <div className='flex gap-x-2'>
                            <img src={call} alt=""/>
                            <p>+7 708 268 69 82</p>
                        </div>
                        <div className='flex gap-x-2'>
                            <img src={mail} alt=""/>
                            <p>ул. Байзакова 280, Алматы</p>
                        </div>
                        <div className='flex gap-x-2'>
                            <img src={location} alt=""/>
                            <p>info@circleburo.kz</p>
                        </div>

                    </div>

                </div>
            </footer>
        </>
    );
};

export default Footer;