import { Character } from 'types/Character';

export default interface User {
  '@id': string;
  username: string;
  currency: number;
  characters: Character[];
}
