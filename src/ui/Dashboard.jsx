const Dashboard = ({picture , number1 , number2}) => {
    return (
        <>
            <div className='p-5 rounded-4xl border border-white'>
                <h2 className='text-center pt-5 font-medium text-[40px] pb-5'>ПРОСМОТРЫ</h2>
                <img src={picture} alt=""/>
                <div className='flex justify-between items-center pt-6'>
                    <p className='font-medium text-xl'>Охваченные аккаунты</p>
                    <div>
                        <p>{number1}</p>
                        <p className='text-[13px] text-gray-400 '>{number2}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;