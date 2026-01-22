import picture1 from '../images/picture-1.png'
import Text from "../ui/Text.jsx";

const EightSection = () => {
    return (
        <>
            <section className='flex flex-col gap-y-4 pb-10 lg:flex-row md:px-4 xl:px-20 items-center gap-x-5 '>
                <img src={picture1} alt=""/>
                <Text>Отдельным направлением стала работа с комьюнити. Мы не просто анонсировали мероприятия, а
                    выстраивали вокруг Steppe Coffee точки притяжения. За период сотрудничества были восстановлены связи
                    с уже существующими сообществами и привлечены новые – SpacED, Language Mixer, Bookclub Almaty. В
                    кофейне прошёл арт-мастер-класс, который усилил офлайн-трафик и стал контентной опорой для
                    социальных сетей. Такой формат позволил бренду выйти за рамки «кофейни» и закрепиться как городское
                    пространство для встреч и идей.</Text>
            </section>
        </>
    );
};

export default EightSection;