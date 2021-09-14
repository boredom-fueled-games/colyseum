import useSWR from 'swr';
import { Character } from 'types/Character';
import { Collection } from 'types/Collection';
import { ItemType } from 'types/ItemType';
import OwnedItem from 'types/OwnedItem';

const baseIRI = '/owned_items';

type OwnedItemsProps = {
  type?: ItemType,
  character?: Character,
}

export const useOwnedItems = ({type = null, character = null}: OwnedItemsProps) => {
  const {
    data,
    error,
  } = useSWR<Collection<OwnedItem>>(
    `${baseIRI}?pagination=false${type ? `&item.type=${type}` : ''}${character ? `&character=${character['@id']}` : ''}`
  );
  const loading = !data && !error;

  return {
    loading,
    ownedItems: data,
  };
};
