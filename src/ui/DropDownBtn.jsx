import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, message, Space} from 'antd';
const handleButtonClick = e => {
    message.info('Click on left button.');
    console.log('click left button', e);
};
const handleMenuClick = e => {
    message.info('Click on menu item.');
    console.log('click', e);
};
const items = [
    {
        label: '1st menu item',
        key: '1',
        icon: <UserOutlined />,
    },
    {
        label: '2nd menu item',
        key: '2',
        icon: <UserOutlined />,
    },
];
const menuProps = {
    items,
    onClick: handleMenuClick,
};
const DropDownBtn = ({children}) => (

    <Space wrap>
        <Dropdown menu={menuProps}>
            <Button shape="round" style={{ borderColor: '#000' }} onClick={handleButtonClick} icon={<DownOutlined />} iconPlacement="end">
                {children}
            </Button>
        </Dropdown>
    </Space>
);
export default DropDownBtn;