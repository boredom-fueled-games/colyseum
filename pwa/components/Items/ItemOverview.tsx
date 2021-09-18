import { List, Pagination, Tabs } from 'antd';
import ItemDetails from 'components/Items/ItemDetails';
import ItemDrawer from 'components/Items/ItemDrawer';
import { useItems } from 'hooks/items';
import { useEffect, useState } from 'react';
import { ItemType, ItemTypes } from 'types/ItemType';
import Item from 'types/Item';

const {TabPane} = Tabs;

const ItemOverview = (): JSX.Element => {
  const [type, setType] = useState<ItemType>('weapon');
  const {items} = useItems({type});
  const [shownItem, setShownItem] = useState<Item | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  useEffect(() => {
    setPage(1);
  }, [items]);

  const showItem = (item: Item) => {
    console.log(item);
    setShownItem(item);
  };

  const handlePaginationChange = (page: number, pageSize?: number) => {
    setPage(page);
    if (!pageSize) {
      return;
    }

    setPageSize(pageSize);
  };

  const viableItems = items && items['hydra:member'] ? items['hydra:member'] : [];

  return (
    <>
      <Tabs className="shop" defaultActiveKey="weapon" centered onChange={(key) => setType(key)} type="card">
        {ItemTypes.map((type) => (
          <TabPane key={type} tab={type}/>
        ))}
      </Tabs>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 5,
          xxl: 5,
        }}
        style={{paddingTop: 16}}
        dataSource={viableItems.slice((page - 1) * pageSize, page * pageSize)}
        renderItem={(item: Item) => (
          <List.Item>
            <ItemDetails item={item} showItem={showItem}/>
          </List.Item>
        )}
      />
      <Pagination
        total={viableItems.length || 1}
        defaultPageSize={pageSize}
        defaultCurrent={page}
        onChange={handlePaginationChange}
      />
      {shownItem ? (<ItemDrawer item={shownItem} onClose={() => setShownItem(null)}/>) : null}
    </>
  );
};

export default ItemOverview;
