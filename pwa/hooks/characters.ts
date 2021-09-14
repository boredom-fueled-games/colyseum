import axios from 'adapters/axios';
import useSWR, { mutate as mutateCharacter } from 'swr';
import { Character } from 'types/Character';
import { Collection } from 'types/Collection';

const baseIRI = '/characters';

type useCharactersProps = {
  training?: boolean,
  level?: number,
}

export const useCharacters = ({training = false, level = null}: useCharactersProps = {}) => {
  const {
    data,
    error,
    mutate
  } = useSWR<Collection<Character>>(`${baseIRI}?exists[user]=${(training ? 'false' : 'true')}${level ? `&level=${level}` : ''}`);
  const loading = !data && !error;

  const create = async (newCharacter: Character): Promise<Character> => {
    const response = await axios.post<Character>('/api/proxy/characters', newCharacter);
    data['hydra:member'].push(response.data);
    mutate(data);
    return response.data;
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
