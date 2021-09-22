import axios from 'adapters/axios';
import useSWR from 'swr';
import { Character } from 'types/Character';
import { Collection } from 'types/Collection';

const baseIRI = '/characters';

type useCharactersProps = {
  training?: boolean,
  level?: number | null,
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
    if (!data || !data['hydra:member']) {
      throw new Error('This should never have happened!');
    }

    data['hydra:member'].push(response.data);
    mutate(data);
    return response.data;
  };

  return {
    loading,
    create,
    characters: data,
  };
};

export const useCharacter = (id: string | null) => {
  const {data, error} = useSWR<Character>(id);
  const loading = !data && !error;

  return {
    loading,
    character: data,
  };
};
