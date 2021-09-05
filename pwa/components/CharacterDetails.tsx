import { Character } from 'types/Character';

const CharacterDetails = ({character}: { character: Character }) => (
  <div>
    <p>Name: {character.identifier}</p>
    <p>Level: {character.level}</p>
    <p>Experience: {character.experience}</p>
    <p>Strength: {character.strength}</p>
    <p>Dexterity: {character.dexterity}</p>
    <p>Constitution: {character.constitution}</p>
  </div>
);

export default CharacterDetails;
