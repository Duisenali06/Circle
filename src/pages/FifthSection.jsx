import first from '../images/first.png'
import second from '../images/second.png'

const FifthSection = () => {
    return (
        <section className="max-w-screen">
            <div className="block md:flex justify-between  gap-x-3">
                <img
                    src={first}
                    alt=""
                    className='md:max-w-[370px] lg:max-w-[500px] xl:max-w-[600px]'

                />
                <img
                    src={second}
                    alt=""
                    className='md:max-w-[370px] lg:max-w-[500px] xl:max-w-[600px]'

                />
            </div>
        </section>
    );
};

export default FifthSection
