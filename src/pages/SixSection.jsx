import dashboard from '../images/dashboard.png'
import smartphone2 from '../images/smartphone2.png'
import Text from "../ui/Text.jsx";
import Dashboard from "../ui/Dashboard.jsx";

const SixSection = () => {
    return (
        <>
            <section className='pt-10 pb-18 px-4 block md:flex gap-x-9 xl:px-20 '>
                <div className='flex flex-col gap-y-5'>
                    <Text>В рамках SMM мы выстроили регулярное присутствие бренда в Instagram и TikTok, переработали
                        подачу контента и сделали акцент на живые форматы. В сентябре, несмотря на просадку охватов
                        относительно предыдущего периода, нам удалось сохранить активность аудитории и зафиксировать
                        рост подписчиков на 9% по сравнению с августом. Этот этап стал диагностическим: мы
                        протестировали форматы и выявили, что наибольшую вовлеченность дают визуальные посты и контент с
                        офлайн-жизнью кофейни .</Text>
                    <Dashboard picture={dashboard} number1 ={'2,190'} number2={'-65,5%'} />
                </div>
                <img className='hidden lg:block' src={smartphone2} alt=""/>
            </section>
        </>
    );
};

export default SixSection;