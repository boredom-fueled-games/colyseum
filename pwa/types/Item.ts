export default interface Item {
  '@id': string;
  identifier: string;
  minimalDamage: number;
  maximalDamage: number;
  blockChance: number;
  defense: number;
  requiredStrength: number;
  requiredDexterity: number;
  addedStrength: number;
  addedDexterity: number;
  addedConstitution: number;
  addedIntelligence: number;
  durability: number;
  price: number;
  type: string;
  equipped?: boolean;
}
