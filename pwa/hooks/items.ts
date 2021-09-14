import useSWR from 'swr';
import { Collection } from 'types/Collection';
import Item from 'types/Item';
import { ItemType } from 'types/ItemType';

const baseIRI = '/items';

type ItemsProps = {
  type?: ItemType,
}

export const useItems = ({type = null}: ItemsProps) => {
  const {
    data,
    error,
  } = useSWR<Collection<Item>>(`${baseIRI}?pagination=false${type ? `&type=${type}` : ''}`);
  const loading = !data && !error;

  return {
    loading,
    items: data,
  };
};
