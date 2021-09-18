// export const getItems = () => {
//   const keyMapping = {
//     'Name': 'identifier',
//     'Min\nDmg': 'minimalDamage',
//     'Max\nDmg': 'maximalDamage',
//     'Req.\nStr': 'requiredStrength',
//     'Req. Str': 'requiredStrength',
//     'Req.\nDex': 'requiredDexterity',
//     'Req. Dex': 'requiredDexterity',
//     'Add.\nStr': 'addedStrength',
//     'Str': 'addedStrength',
//     'Add.\nDex': 'addedDexterity',
//     'Dex': 'addedDexterity',
//     'Con': 'addedConstitution',
//     'Int': 'addedIntelligence',
//     'Dur': 'durability',
//     'Price': 'price',
//     'Def': 'defense',
//     'Type': 'type',
//     'Block Chance': 'blockChance',
//   };
//
//   const keys = [];
//   const items = [];
//   for (const row of document.querySelectorAll('.sortable tr')) {
//     if (keys.length === 0) {
//       for (const link of row.querySelectorAll('a')) {
//         keys.push(link.innerText);
//       }
//       continue;
//     }
//
//     const item = {};
//     let i = 0;
//     for (const field of row.querySelectorAll('td')) {
//       const span = field.querySelector('span');
//       const link = field.querySelector('a');
//       const key = keyMapping[keys[i]] ?? null;
//       if (key) {
//         let value = (span ? span.innerText : link ? link.innerText : field.innerText).replace(/,|(_unique)/g, '');
//         if (value.length === 0) {
//           value = 0;
//         }
//
//         item[key] = !isNaN(parseInt(value)) ? parseInt(value) : value;
//       }
//       ++i;
//     }
//
//     items.push(item);
//   }
//
//   return JSON.stringify(items);
// };

export default 1;
