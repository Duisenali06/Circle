
const Text = ({children}) => {
    return (
        <>
            <p className='py-10 px-6 border border-white rounded-4xl text-[20px]'>
                {children}
            </p>

        </>
    );
};

export default Text;