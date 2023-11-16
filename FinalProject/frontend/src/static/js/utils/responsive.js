export var small = false;

export const pokeDataToggleSmall = (pageString) => {
  const pageArr = pageString.split('/');
  let borders = document.getElementsByClassName('v-border');
  for (let b of borders) {
    b.classList.toggle('mx-4');
    b.classList.toggle('mx-2');
  }
  let labels = document.getElementsByClassName('link-info');
  for (let l of labels) {
    l.classList.toggle('link-info-small');
  }
  if (pageArr[pageArr.length - 1] == 'pokemon') {  //all pokemon viewpage
    let searchContainer = document.getElementById('searchContainer');
    let entryList = document.getElementsByClassName('poke-entry');
    let entryImgList = document.getElementsByClassName('entry-img');
    searchContainer.classList.toggle('col-6');
    for (let e of entryList) {
      e.classList.toggle('m-3');
      e.classList.toggle('m-2');
    }
    for (let e of entryImgList) {
      e.classList.toggle('mx-4');
      e.classList.toggle('mx-3');
    }
  } else if (pageString.includes('/pokemon/info/')) { //individual pokemon viewpage
    let accordionWrap = document.getElementById('accordion-wrap');
    accordionWrap.classList.toggle('col-8');
  }
  small = !small;
}

export const createToggleSmall = () => {
  let wrapper = document.getElementById('wrapper');
  //let names_divs = document.getElementsByClassName('poke-name');
  let abilItemContainers = document.getElementsByClassName('abil-item-container');
  let abilityContainers = document.getElementsByClassName('ability-container');
  let itemContainers = document.getElementsByClassName('item-container');
  wrapper.classList.toggle('w-75');
  for (let i = 0; i < abilItemContainers.length; i++) {
    abilItemContainers[i].classList.toggle('flex-column');
    abilItemContainers[i].classList.toggle('gap-2');
    abilityContainers[i].classList.toggle('me-2');
    itemContainers[i].classList.toggle('ms-1');
  }
  small = !small;
}