import { Button, Card, Descriptions, Divider, Drawer, Space, Typography } from 'antd';
import Item from 'types/Item';

const {Title} = Typography;

type ItemDrawerProps = {
  item: Item
  onClose: () => void
};

const ItemDrawer = ({item, onClose}: ItemDrawerProps): JSX.Element => {
  const handlePurchase = async (item: Item, autoEquip?: boolean): Promise<void> => {
    // await axios.post('/api/proxy/owned_items', {
    //   item: item['@id'],
    //   user: user['@id'],
    //   character: autoEquip ? activeCharacter['@id'] : null
    // });
  };

  return (
    <Drawer
      // title={item.identifier.charAt(0).toUpperCase() + item.identifier.slice(1)}
      placement="right"
      onClose={onClose}
      visible
      width={Math.min(736, window.innerWidth)}
      closeIcon={false}
    >
      <Card>
        <Space direction="vertical">
          <Title>{item.identifier.charAt(0).toUpperCase() + item.identifier.slice(1)}</Title>
          <>
            <Divider orientation="left">Requirements</Divider>
            <Descriptions>
              <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
              <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
              <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
            </Descriptions>
          </>
          <>
            <Divider orientation="left">Stats</Divider>
            <Descriptions>
              <Descriptions.Item label="Product">Cloud Database</Descriptions.Item>
              <Descriptions.Item label="Billing Mode">Prepaid</Descriptions.Item>
              <Descriptions.Item label="Automatic Renewal">YES</Descriptions.Item>
            </Descriptions>
          </>
          <Space>
            <Button type="primary" onClick={() => handlePurchase(item)}>Buy and equip</Button>
            <Button onClick={() => handlePurchase(item)}> Buy and store</Button>
          </Space>
        </Space>
      </Card>
    </Drawer>
  );
};

export default ItemDrawer;
