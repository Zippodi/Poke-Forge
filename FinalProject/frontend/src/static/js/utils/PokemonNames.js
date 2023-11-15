export const nameVariants = {
  'Type Null': 'Type: Null',
  'Type-Null': 'Type: Null',
  'Nidoran M': 'Nidoran♂',
  'Nidoran F': 'Nidoran♀',
  'Mr Mime': 'Mr. Mime',
  'Mr Rime': 'Mr. Rime',
  'Flabébé': 'Flabebe'
}

export const getSpriteName = (name) => {
  let n = name.toLowerCase();
  n = n.replaceAll(' ', '-').replaceAll(':', '').replaceAll("'", '');
  n = n.replaceAll('♂', '-m').replaceAll('♀', '-f').replaceAll('.', '');
  //random chances for being silly
  if (n == 'pikachu') {
    let random = Math.floor(Math.random() * 10) + 1;
    if (random == 3) {
      n += '-partner-cap';
    }
  } else if (n == 'unown') {
    //TODO maybe later
  } else if (n == 'gastrodon' || n == 'shellos') {
    let random = Math.floor(Math.random() * 2) + 1;
    if (random == 1) {
      n += '-west';
    } else {
      n += '-east';
    }
  } else if (n == 'basculin') {
    let random = Math.floor(Math.random() * 2) + 1;
    if (random == 1) {
      n += '-red-striped';
    } else {
      n += '-blue-striped';
    }
  } else if (n == 'greninja') {
    let random = Math.floor(Math.random() * 20) + 1;
    if (random == 3) {
      n += '-ash';
    }
  }
  return n;
}