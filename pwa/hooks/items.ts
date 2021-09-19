import useSWRImmutable from 'swr/immutable';
import { Collection } from 'types/Collection';
import Item from 'types/Item';
import { ItemType } from 'types/ItemType';

const baseIRI = '/items';

type ItemsProps = {
  type?: ItemType | null,
}

export const useItems = ({type = null}: ItemsProps = {}) => {
  const {
    data,
    error,
  } = useSWRImmutable<Collection<Item>>(`${baseIRI}?pagination=false${type ? `&type=${type}` : ''}`);
  const loading = !data && !error;

  return {
    loading,
    items: data,
  };
};
