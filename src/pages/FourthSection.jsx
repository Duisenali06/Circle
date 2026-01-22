// import saigak from "../images/saigak.mp4";
import caffee from "../images/caffee.png";
import smartphone from '../images/smartphone.png'

const FourthSection = () => {
    return (
       <>
           <section className='px-4 md:flex md:gap-x-6 md:px-10 lg:px-10 xl:px-20 pb-10'>
               <img className='hidden md:block  md:max-w-80 lg:max-w-100 xl:max-w-full ' src={smartphone} alt=""/>


                   {/*<video className='hidden md:block md:rounded-4xl md:w-80 md:h-110 lg:w-100 lg:h-150 xl:w-125 xl:h-170' autoPlay muted loop>*/}
                   {/*    <source src={saigak} type='video/mp4' />*/}
                   {/*</video>*/}

               <div className='flex flex-col '>
                   <p className=' mb-4 md:border border-white rounded-4xl md:px-5 lg:px-3 lg:py-5 lg: xl:px-6 xl:py-10 xl:text-[18px]' >После завершения этого этапа клиент перешел на пакет Cycle – формат ежемесячного
                       сопровождения, в рамках которого мы продолжаем развивать проект, усиливать
                       комьюнити и последовательно масштабировать коммуникацию на базе обновленного
                       визуального и смыслового фундамента.</p>
                   <p className='pt-4 mb-5 md:border border-white rounded-4xl md:px-5  lg:px-3 lg:py-5 xl:px-6 xl:py-10 xl:text-[18px] '>Мы взяли на себя работу с контентом, визуальной подачей, печатными материалами и
                       офлайн-активностями, а также участвовали в оформлении интерьера кофейни, чтобы
                       пространство и коммуникация работали как единое целое.</p>

                   <img className='rounded-4xl' src={caffee} alt=""/>

               </div>
           </section>
           
       </>
    );
};

export default FourthSection;