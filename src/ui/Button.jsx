import React from 'react';
import { Button} from 'antd';
const App = ({children}) => (
    <>
        <Button shape='round' style={{ background: 'red' }} type="primary">{children}</Button>
    </>
);
export default App;