import Dashboard from "../ui/Dashboard.jsx";
import dashboeard2 from '../images/dashboard2.png'

const SevenSection = () => {
    return (
        <>
            <section className=' px-4 pb-10 flex flex-col gap-y-5  md:grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_2fr] gap-x-6 xl:px-20'>
                <div className='xl:py-16 px-6 lg:py-8  border border-white rounded-4xl'>
                    <h2 className='text-[40px]' >В ОКТЯБРЕ</h2>
                    <p className='text-[20px]' >Мы усилили стратегию и сместили фокус в сторону Reels и сторис, а также более плотной связки
                        онлайна и офлайна. Результат – резкий рост ключевых метрик: охваты аккаунта выросли на 125,3%,
                        действия в профиле – на 6,3%, посещения профиля – на 8,4%. Прирост подписчиков за месяц составил
                        почти 12% по сравнению с концом сентября. Это подтвердило, что выбранная модель контента и темп
                        публикаций начали работать системно .</p>
                </div>
                <Dashboard picture={dashboeard2} number1={'4,935'} number2={'+125,3%'}/>
            </section>
        </>
    );
};

export default SevenSection;