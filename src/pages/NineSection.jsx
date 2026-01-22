import picture2 from "../images/picture-2.png";
import Text from "../ui/Text.jsx";

const NineSection = () => {
    return (
        <>
            <section className=' flex flex-col gap-y-4 pb-10 lg:flex-row md:px-4 xl:px-20 items-center gap-x-5 '>
                <Text>Дополнительно мы занимались дизайном печатных материалов и оформлением интерьера, чтобы визуальный
                    язык бренда был последовательно представлен и в цифровой среде, и в физическом пространстве. Это
                    усилило узнаваемость и связало коммуникацию в соцсетях с реальным опытом гостей.</Text>
                <img src={picture2} alt=""/>

            </section>
        </>
    );
};

export default NineSection;