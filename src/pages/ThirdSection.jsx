import after from '../images/after.png'
import before from '../images/before.png'
const ThirdSection = () => {
    return (
        <>
            <section className='px-4 md:flex gap-x-4 lg:gap-x-6 pb-10'>
                <div>
                    <h3 className='flex justify-center font-medium pb-2 text-2xl md:text-3xl lg:text-4xl'>ДО</h3>
                    <img className='border border-white rounded-2xl' src={before} alt=""/>
                </div>
                <div>
                    <h3 className='flex justify-center font-medium pb-2 text-2xl md:text-3xl lg:text-4xl'>ПОСЛЕ</h3>
                    <img className='border border-white rounded-2xl' src={after} alt=""/>
                </div>


            </section>
        </>
    );
};

export default ThirdSection;