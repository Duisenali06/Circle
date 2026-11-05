import conclusionPicture from '../images/conclusionPicture.png'

const Conclusion = () => {
    return (
        <>
            <section className='' >
                <div className='mb-10 px-4  md:border border-white rounded-4xl md:py-15 md:px-12 md:max-w-[600px] lg:max-w-[700px] xl:max-w-[845px] m-auto'>
                    <h2 className='text-center font-medium text-4xl pb-4' >ИТОГИ</h2>
                    <p>Итог работы с Steppe Coffee: Социальные сети стали отражением жизни кофейни, офлайн-мероприятия
                        начали работать как инструмент привлечения и удержания аудитории, а бренд получил понятную и
                        устойчивую коммуникационную модель, которую можно масштабировать дальше.</p>
                </div>
                <img className='w-full'  src={conclusionPicture} alt=""/>
            </section>

        </>
    );
};

export default Conclusion;
