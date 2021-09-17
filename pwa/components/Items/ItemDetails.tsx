import { Card, Tooltip } from 'antd';
import { UserSwitchOutlined } from '@ant-design/icons';
import OwnedItem from 'types/OwnedItem';

const ItemDetails = ({ownedItem}: { ownedItem: OwnedItem }): JSX.Element => (
  <Card
    style={{width: 300}}
    title={ownedItem.item.identifier}
    actions={[
      <Tooltip title="Unequip" key="unequip"><UserSwitchOutlined onClick={() =>console.log(123)}/></Tooltip>,
      <Tooltip title="Unequip & Destroy" key="sell"><i className="ra ra-hammer-drop ra-lg" /></Tooltip>,
    ]}
  >
    {`Damage: ${ownedItem.item.minimalDamage} - ${ownedItem.item.maximalDamage}`}
  </Card>
);

export default ItemDetails;
