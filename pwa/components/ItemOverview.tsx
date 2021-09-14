import { Button, Space, Table, Tabs, Tooltip } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/es/table/interface';
import axios from 'axios';
import ItemDetails from 'components/ItemDetails';
import { useAuth } from 'context/AuthContext';
import { useItems } from 'hooks/items';
import { useOwnedItems } from 'hooks/OwnedItems';
import { useState } from 'react';
import { ItemType, ItemTypes } from 'types/ItemType';
import Item from 'types/Item';
import {
  PlusOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';

const {TabPane} = Tabs;

type ItemColumn = (ColumnGroupType<Item> & { showOn?: ItemType[] } | ColumnType<Item> & { showOn?: ItemType[] });

const ItemOverview = (): JSX.Element => {
  const {user, activeCharacter} = useAuth();
  const [type, setType] = useState<ItemType>('weapon');
  const {items} = useItems({type});
  const {ownedItems} = useOwnedItems({character: activeCharacter});

  const handlePurchase = async (item: Item, autoEquip?: boolean): Promise<void> => {
    await axios.post('/api/proxy/owned_items', {
      item: item['@id'],
      user: user['@id'],
      character: autoEquip ? activeCharacter['@id'] : null
    });
  };

  const getColumns = (type: ItemType): ItemColumn[] => {
    const itemTypeColumns: ItemColumn[] = [
      {
        title: 'Name',
        dataIndex: 'identifier',
        sorter: {
          compare: (a, b) => a.identifier > b.identifier ? 1 : -1,
          multiple: 1,
        }
      },
      {
        title: 'Damage',
        key: 'damage',
        showOn: ['weapon'],
        sorter: {
          compare: (a, b) =>
            (a.minimalDamage + a.maximalDamage) - (b.minimalDamage + b.maximalDamage),
          multiple: 1,
        },
        render: (text, item) => `${item.minimalDamage} - ${item.maximalDamage}`
      },
      {
        title: 'Block chance',
        dataIndex: 'blockChance',
        showOn: ['shield'],
        sorter: {
          compare: (a, b) => a.blockChance - b.blockChance,
          multiple: 1,
        }
      },
      {
        title: 'Defense',
        dataIndex: 'defense',
        showOn: ['shield', 'helmet', 'body', 'gloves', 'boots'],
        sorter: {
          compare: (a, b) => a.defense - b.defense,
          multiple: 1,
        }
      },
      {
        title: 'Req. Strength',
        dataIndex: 'requiredStrength',
        showOn: ['weapon', 'helmet', 'body', 'gloves', 'boots'],
        sorter: {
          compare: (a, b) => a.requiredStrength - b.requiredStrength,
          multiple: 1,
        }
      },
      {
        title: 'Req. Dexterity',
        dataIndex: 'requiredDexterity',
        showOn: ['weapon', 'shield'],
        sorter: {
          compare: (a, b) => a.requiredDexterity - b.requiredDexterity,
          multiple: 1,
        }
      },
      {
        title: 'Str bonus',
        dataIndex: 'addedStrength',
        showOn: ['weapon', 'helmet', 'body', 'gloves', 'boots'],
        sorter: {
          compare: (a, b) => a.addedStrength - b.addedStrength,
          multiple: 1,
        }
      },
      {
        title: 'Dex bonus',
        dataIndex: 'addedDexterity',
        showOn: ['weapon', 'helmet', 'body', 'gloves', 'boots'],
        sorter: {
          compare: (a, b) => a.addedDexterity - b.addedDexterity,
          multiple: 1,
        }
      },
      {
        title: 'Con bonus',
        dataIndex: 'addedConstitution',
        showOn: ['helmet', 'body', 'gloves', 'boots'],
        sorter: {
          compare: (a, b) => a.addedConstitution - b.addedConstitution,
          multiple: 1,
        }
      },
      {
        title: 'Int bonus',
        dataIndex: 'addedIntelligence',
        showOn: ['helmet', 'body', 'gloves', 'boots'],
        sorter: {
          compare: (a, b) => a.addedIntelligence - b.addedIntelligence,
          multiple: 1,
        }
      },
      // {
      //   title: 'Durability',
      //   dataIndex: 'durability',
      //   sorter: {
      //     compare: (a, b) => a.durability - b.durability,
      //     multiple: 1,
      //   }
      // },
      // {
      //   title: 'Price',
      //   dataIndex: 'price',
      //   sorter: {
      //     compare: (a, b) => a.price - b.price,
      //     multiple: 1,
      //   }
      // },
      {
        key: 'functions',
        render: (text, item) => (
          <Space>
            <Tooltip title="Buy" key="buy">
              <Button icon={<PlusOutlined/>} onClick={() => handlePurchase(item)}/>
            </Tooltip>
            <Tooltip title="Buy and Equip" key="equip">
              <Button icon={<UserSwitchOutlined/>} onClick={() => handlePurchase(item, true)}/>
            </Tooltip>
          </Space>
        )
      },
    ];
    return itemTypeColumns.filter((column) => !column.showOn || column.showOn.includes(type));
  };

  return (
    <>
      {(ownedItems ? ownedItems['hydra:member'] : [])
        .filter((ownedItem) => ownedItem.item.type === type)
        .map((ownedItem) => (<ItemDetails key={ownedItem['@id']} ownedItem={ownedItem}/>))}
      <br/>
      <Tabs className="shop" defaultActiveKey="weapon" centered onChange={(key) => setType(key)} type="card">
        {ItemTypes.map((type) => (
          <TabPane key={type} tab={type}/>
        ))}
      </Tabs>
      <Table
        rowKey="@id"
        dataSource={items ? items['hydra:member'] : []}
        loading={!items}
        columns={items ? getColumns(type) : null}
        pagination={false}
      />
    </>
  );
};

export default ItemOverview;
