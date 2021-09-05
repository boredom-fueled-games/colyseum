import axios from 'adapters/axios';
import useSWR, { mutate as mutateCharacter } from 'swr';
import { Character } from 'types/Character';
import { Collection } from 'types/Collection';

const baseIRI = '/characters';

export const useCharacters = () => {
  const {data, error, mutate} = useSWR<Collection<Character>>(baseIRI);
  const loading = !data && !error;

  const create = async (newCharacter: Character) => {
    const response = await axios.post<Character>('/characters', newCharacter);
    data['hydra:member'].push(response.data);
    mutate(data);
  };

  const preload = (id: string) => {
    let existingCharacter = null;
    for (const character of data['hydra:member']) {
      if (character['@id'] !== id) {
        continue;
      }
      existingCharacter = character;
      break;
    }

    mutateCharacter(id, existingCharacter);
  };

  return {
    loading,
    create,
    preload,
    characters: data,
  };
};

export const useCharacter = (id: string) => {
  const {data, error} = useSWR<Character>(id);
  const loading = !data && !error;

  return {
    loading,
    character: data,
  };
};
