import { List, Pagination, Tabs } from 'antd';
import ItemDetails, { ItemActionType } from 'components/Items/ItemDetails';
import ItemDrawer from 'components/Items/ItemDrawer';
import { useEffect, useState } from 'react';
import { ItemType, ItemTypes } from 'types/ItemType';
import Item from 'types/Item';

const {TabPane} = Tabs;

type ItemOverviewProps = {
  items: Item[],
  disableFilter?: boolean
  disablePagination?: boolean
  showItemType?: boolean
  itemActions?: ItemActionType[]
}
const ItemOverview = ({items, disableFilter = false, disablePagination = false, itemActions = [], showItemType = false}: ItemOverviewProps): JSX.Element => {
  const [type, setType] = useState<ItemType>('weapon');
  const [shownItem, setShownItem] = useState<Item | null>(null);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  useEffect(() => {
    setPage(1);
  }, [items]);

  const handlePaginationChange = (page: number, pageSize?: number) => {
    setPage(page);
    if (!pageSize) {
      return;
    }

    setPageSize(pageSize);
  };

  const viableItems = items.filter((item) => disableFilter ? true : item.type === type);

  return (
    <>
      {disableFilter ? null : <Tabs
        className="shop"
        defaultActiveKey="weapon"
        centered onChange={(key) => setType(key)}
        type="card"
      >
        {ItemTypes.map((type) => (
          <TabPane key={type} tab={type}/>
        ))}
      </Tabs>}
      {viableItems.length ? <>
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
          dataSource={disablePagination ? viableItems : viableItems.slice((page - 1) * pageSize, page * pageSize)}
          renderItem={(item: Item) => (
            <List.Item>
              <ItemDetails item={item} showItem={setShownItem} itemActions={itemActions} showItemType={showItemType}/>
            </List.Item>
          )}
        />
        {disablePagination ? null : <Pagination
          total={viableItems.length || 1}
          defaultPageSize={pageSize}
          defaultCurrent={page}
          onChange={handlePaginationChange}
        />}
      </> : null}

      {shownItem ? (<ItemDrawer item={shownItem} onClose={() => setShownItem(null)}/>) : null}
    </>
  );
};


export default ItemOverview;
