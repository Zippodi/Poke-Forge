const effectiveness = require('./effectiveness.json');

exports.typeList = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy'
];

//type defenses for 2 (or 1) types
exports.getDefensesJson = (type1, type2 = null) => {
  //create starter return object
  let base = this.typeList.reduce((pre, cur) => Object.assign(pre, { [cur]: 1 }), {});
  let ret = Object.assign(base, effectiveness[type1]);
  if (type2) {
    this.typeList.forEach((type) => {
      if (Object.hasOwn(effectiveness[type2], type)) {
        ret[type] *= effectiveness[type2][type];
      }
    });
  }
  return ret;
}