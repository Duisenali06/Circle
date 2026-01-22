import saigak from '../images/saigak.mp4'

const SecondSection = () => {
    return (
        <>
            <section className='  flex items-start gap-x-2 lg:gap-x-6 xl:gap-x-10 md:px-10 lg:px-15 xl:px-20 pt-4 pb-8'>
                <div className='md:border md:border-white rounded-4xl md:pt-10 md:pb-10 md:mt-15 lg:mt-35 lg:pt-15 lg:pb-15 lg:px-6 xl:mt-45'>
                    <h2 className='flex justify-center pb-4 md:block md:px-4 font-medium text-2xl md:text-3xl lg:text-[40px]'>STEPPE COFFEE</h2>
                    <p className='px-4 lg:text-[15px]' >Steppe Coffee – городской кофейный проект
                        с сильным комьюнити-потенциалом и фокусом на живое общение.
                        В рамках первого этапа мы пересобрали визуальный язык бренда,
                        усилили характер и атмосферу Steppe Coffee,
                        а также заложили единую логику для дальнейшего развития контента и
                        коммуникаций. Это позволило бренду выглядеть цельно и узнаваемо во всех
                        точках контакта с аудиторией.</p>
                </div>

                <video className='hidden md:block md:rounded-4xl md:w-80 md:h-110 lg:w-100 lg:h-150 xl:w-125 xl:h-170' autoPlay muted loop>
                    <source src={saigak} type='video/mp4' />
                </video>




            </section>
        </>
    );
};

export default SecondSection;