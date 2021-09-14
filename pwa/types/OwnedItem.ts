import Item from 'types/Item';

export default interface OwnedItem {
  '@id': string;
  user: string;
  item: Item;
  character?: string
}
