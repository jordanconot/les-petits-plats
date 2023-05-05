import { getRecipes } from './api.js';
import { displayData } from './factory.js';

//Tableau pour stocker les datas
let request = '';
let allRecipes = [];
let ingredients = [];
let ustensils = [];
let description = '';
let appliances = [];
let filteredRecipes = [];
let tagSelected = [];
let wordGroup = [];

// Rechercher une recette avec la bar de recherche
function searchBar() {
  const researchBar = document.getElementById('searchbar');
  researchBar.addEventListener('input', (e) => {
    e.preventDefault();
    if (e.target.value.length > 0 && e.target.value.length < 3) {
      return;
    }
    wordGroup = e.target.value.trim().toLowerCase().split(' ');
    request = wordGroup.join(' ');
    description = wordGroup.join(' ');
    filterRecipes();
  });
}

//Lancer la recherche en filtrant avec toutes les façon demandées
function filterByRequest(recipe) {
  return filterByName(recipe) || filterByDescription(recipe) || filterByIngredient(recipe) || filterByWordGroup(recipe);
}

// Recherche par groupe de mots
function filterByWordGroup(recipe) {
  if (wordGroup.length === 0) {
    return true;
  }
  return wordGroup.every((word) => {
    return (
      recipe.name.toLowerCase().includes(word) ||
      recipe.description.toLowerCase().includes(word) ||
      recipe.ingredients.some((ingredient) => {
        return ingredient.ingredient.toLowerCase().includes(word);
      }) ||
      recipe.ustensils.some((ustensil) => {
        return ustensil.toLowerCase().includes(word);
      })
    );
  });
}

// Filter les recettes avec la methode filter en recherchant par titre de la recette et dans la description
function filterRecipes() {
  const recipes = allRecipes.filter((recipe) => {
    return filterByRequest(recipe);
  });
  filteredRecipes = recipes;
  displayData(recipes);
}

//Filtrer par nom avec la methode includes
function filterByName(recipe) {
  if (request === '') {
    return true;
  }
  return recipe.name.toLowerCase().includes(request.toLowerCase());
}

//Filtrer par description avec la methode includes
function filterByDescription(recipe) {
  if (description === '') {
    return true;
  }
  return recipe.description.toLowerCase().includes(description.toLowerCase());
}

//Filtrer par ingredient avec la methode includes
function filterByIngredient(recipe) {
  if (ingredients.length === 0) {
    return true;
  }
  return (
    recipe.ingredients.filter((ingredient) => {
      return ingredients.includes(ingredient.ingredient);
    }).length === ingredients.length
  );
}
//Afficher la liste des ingredients
function displayIngredients(recipes) {
  let array = [];
  let repetitionIngredients = [];
  document.querySelector('.filter_ingredients').innerHTML = '';
  for (let i = 0; i < recipes.length; i++) {
    array.push(recipes[i].ingredients);
  }
  for (let el in array) {
    for (let a = 0; a < array[el].length; a++) {
      let items = array[el][a].ingredient;
      ingredients.push(items.toLowerCase());
    }
  }

  repetitionIngredients = ingredients.filter((item, index) => ingredients.indexOf(item) === index).sort();
  for (let l = 0; l < repetitionIngredients.length; l++) {
    document.querySelector(
      '.filter_ingredients',
    ).innerHTML += `<li class="ingredients_results">${repetitionIngredients[l]}</li>`;
  }
}

//Afficher la liste des appareils
function displayAppliances(recipes) {
  let repetitionAppliances = [];
  document.querySelector('.filter_appareils').innerHTML = '';
  for (let i = 0; i < recipes.length; i++) {
    appliances.push(recipes[i].appliance.toLowerCase());
  }
  repetitionAppliances = appliances.filter((item, index) => appliances.indexOf(item) === index).sort();
  for (let j = 0; j < repetitionAppliances.length; j++) {
    document.querySelector(
      '.filter_appareils',
    ).innerHTML += `<li class="appareils_results">${repetitionAppliances[j]}</li>`;
  }
}

//afficher la liste des ustensiles
function displayUstensiles(recipes) {
  let array = [];
  let repetitionUstensiles = [];
  document.querySelector('.filter_ustensiles').innerHTML = '';
  for (let i = 0; i < recipes.length; i++) {
    array.push(recipes[i].ustensils);
  }
  for (let el in array) {
    for (let a = 0; a < array[el].length; a++) {
      let items = array[el][a];
      ustensils.push(items.toLowerCase());
    }
  }

  repetitionUstensiles = ustensils.filter((item, index) => ustensils.indexOf(item) === index).sort();
  for (let l = 0; l < repetitionUstensiles.length; l++) {
    document.querySelector(
      '.filter_ustensiles',
    ).innerHTML += `<li class="ustensiles_results">${repetitionUstensiles[l]}</li>`;
  }
}

// Afficher la liste des ingrédients au clique et cacher la liste lors de la perte du focus
const filterEventIngredient = document.getElementById('tags_ingredient');
const listEventIngredient = document.querySelector('.filter_ingredients');
const dropDownArrowIngredient = document.querySelector('.arrow_ingredients');
const inputPlaceHolderIngredient = document.getElementById('ingredients_input');

function openDropDownIngredient() {
  filterEventIngredient.classList.add('flex');
  listEventIngredient.classList.remove('none');
  inputPlaceHolderIngredient.placeholder = 'Rechercher un ingrédient';
  inputPlaceHolderIngredient.classList.add('opacity');
  inputPlaceHolderIngredient.classList.add('cursor');
  dropDownArrowIngredient.setAttribute('class', 'fas fa-chevron-up arrow');
}

function closeDropDownIngredient() {
  filterEventIngredient.classList.remove('flex');
  listEventIngredient.classList.add('none');
  inputPlaceHolderIngredient.placeholder = 'Ingrédients';
  inputPlaceHolderIngredient.classList.remove('opacity');
  inputPlaceHolderIngredient.classList.remove('cursor');
  dropDownArrowIngredient.setAttribute('class', 'fas fa-chevron-down arrow');
}

filterEventIngredient.addEventListener('click', openDropDownIngredient);
document.addEventListener('click', (e) => {
  if (!document.querySelector('.filter_select_ingredients').contains(e.target)) {
    closeDropDownIngredient();
  }
});

//Afficher la liste des appareils au clique et cacher la liste lors de la perte du focus
const filterEventAppliance = document.getElementById('tags_appareil');
const listEventAppliance = document.querySelector('.filter_appareils');
const dropDownArrowAppliance = document.querySelector('.arrow_appareils');
const inputPlaceHolderAppliance = document.getElementById('appareils_input');

function openDropDownAppliance() {
  filterEventAppliance.classList.add('flex');
  listEventAppliance.classList.remove('none');
  inputPlaceHolderAppliance.placeholder = 'Rechercher un appareils';
  inputPlaceHolderAppliance.classList.add('opacity');
  inputPlaceHolderAppliance.classList.add('cursor');
  dropDownArrowAppliance.setAttribute('class', 'fas fa-chevron-up arrow');
}

function closeDropDownAppliance() {
  filterEventAppliance.classList.remove('flex');
  listEventAppliance.classList.add('none');
  inputPlaceHolderAppliance.placeholder = 'Appareils';
  inputPlaceHolderAppliance.classList.remove('opacity');
  inputPlaceHolderAppliance.classList.remove('cursor');
  dropDownArrowAppliance.setAttribute('class', 'fas fa-chevron-down arrow');
}

filterEventAppliance.addEventListener('click', openDropDownAppliance);
document.addEventListener('click', (e) => {
  if (!document.querySelector('.filter_select_appareils').contains(e.target)) {
    closeDropDownAppliance();
  }
});

//Afficher la liste des ustensiles au clique et cacher la liste lors de la perte du focus
const filterEventUstensiles = document.getElementById('tags_ustensile');
const listEventUstensiles = document.querySelector('.filter_ustensiles');
const dropDownArrowUstensile = document.querySelector('.arrow_ustensiles');
const inputPlaceHolderUstensiles = document.getElementById('ustensiles_input');

function openDropDownUstensiles() {
  filterEventUstensiles.classList.add('flex');
  listEventUstensiles.classList.remove('none');
  inputPlaceHolderUstensiles.placeholder = 'Rechercher un ustensile';
  inputPlaceHolderUstensiles.classList.add('opacity');
  inputPlaceHolderUstensiles.classList.remove('cursor');
  dropDownArrowUstensile.setAttribute('class', 'fas fa-chevron-up arrow');
}

function closeDropDownUstensiles() {
  filterEventUstensiles.classList.remove('flex');
  listEventUstensiles.classList.add('none');
  inputPlaceHolderUstensiles.placeholder = 'Ustensiles';
  inputPlaceHolderUstensiles.classList.remove('opacity');
  dropDownArrowUstensile.setAttribute('class', 'fas fa-chevron-down arrow');
}

filterEventUstensiles.addEventListener('click', openDropDownUstensiles);
document.addEventListener('click', (e) => {
  if (!document.querySelector('.filter_select_ustensiles').contains(e.target)) {
    closeDropDownUstensiles();
  }
});

//Selectionner un ingredient
function addIngredient(ingredientEvent) {
  const searchTag = document.querySelector('.tags_searched');
  let itemsSelected = ingredientEvent.target.innerText;
  let tagContainer = document.createElement('div');
  tagContainer.innerHTML = '';
  tagContainer.classList.add('ingredient_selected');
  tagContainer.innerHTML = `<p class="name_items_liste">${itemsSelected}</p><img class="close_btn" src='./assets/close-selected.svg'></i>`;

  ingredientEvent.target.classList.add('none'); // Supprimer de la liste le tag séléctionner
  searchTag.appendChild(tagContainer); // Afficher l'ingrédient séléctionner
  tagContainer.querySelector('.close_btn').addEventListener('click', () => {
    searchTag.removeChild(tagContainer); // Supprimer le tag séléctionner
    ingredientEvent.target.classList.remove('none'); // Réafficher dans la liste le tag supprimer
  });
}
//ajouter le tag ingredient
function addTagIngredient() {
  const ingredientsList = document.querySelectorAll('.ingredients_results');
  for (let i = 0; i < ingredientsList.length; i++) {
    ingredientsList[i].addEventListener('click', (ingredientEvent) => {
      addIngredient(ingredientEvent);
    });
  }
}

//Filtrer les ingredients avec l'input ingredients
function filterIngredients() {
  const searchValue = document.getElementById('ingredients_input').value.toLowerCase();
  const ingredientListItems = document.querySelectorAll('.ingredients_results');

  ingredientListItems.forEach((item) => {
    const ingredientName = item.innerText.toLowerCase();
    if (ingredientName.includes(searchValue)) {
      item.classList.remove('none');
    } else {
      item.classList.add('none');
    }
  });
}
//Ecouteur evenement sur l'input ingredient
const searchInputIngredient = document.getElementById('ingredients_input');
searchInputIngredient.addEventListener('input', filterIngredients);



//Ajouter un appareil
function addAppliance(appliancetEvent) {
  const searchTag = document.querySelector('.tags_searched');
  let itemsSelected = appliancetEvent.target.innerText;
  let tagContainer = document.createElement('div');
  tagContainer.innerHTML = '';
  tagContainer.classList.add('appareil_selected');
  tagContainer.innerHTML = `<p class="name_items_liste">${itemsSelected}</p><img class="close_btn" src='./assets/close-selected.svg'></i>`;

  appliancetEvent.target.classList.add('none'); // Supprimer de la liste le tag séléctionner
  searchTag.appendChild(tagContainer); // Afficher l'ingrédient séléctionner
  tagContainer.querySelector('.close_btn').addEventListener('click', () => {
    searchTag.removeChild(tagContainer); // Supprimer le tag séléctionner
    appliancetEvent.target.classList.remove('none'); // Réafficher dans la liste le tag supprimer
  });
}
// ajouter le tag appareil
function addTagAppliance() {
  const appliancesList = document.querySelectorAll('.appareils_results');
  for (let i = 0; i < appliancesList.length; i++) {
    appliancesList[i].addEventListener('click', addAppliance);
  }
}
//filtrer les appareil avec l'input appareils
function filterAppliances() {
  const searchValue = document.getElementById('appareils_input').value.toLowerCase();
  const applianceListItems = document.querySelectorAll('.appareils_results');

  applianceListItems.forEach((item) => {
    const applianceName = item.innerText.toLowerCase();
    if (applianceName.includes(searchValue)) {
      item.classList.remove('none');
    } else {
      item.classList.add('none');
    }
  });
}
//ecouteur d'événement sur l'input appareil pour lancer la function de filtre
const searchInputAppliance = document.getElementById('appareils_input');
searchInputAppliance.addEventListener('input', filterAppliances);

//Ajouter un ustensile
function addUstensile(ustensiletEvent) {
  const searchTag = document.querySelector('.tags_searched');
  let itemsSelected = ustensiletEvent.target.innerText;
  let tagContainer = document.createElement('div');
  tagContainer.innerHTML = '';
  tagContainer.classList.add('ustensile_selected');
  tagContainer.innerHTML = `<p class="name_items_liste">${itemsSelected}</p><img class="close_btn" src='./assets/close-selected.svg'></i>`;

  ustensiletEvent.target.classList.add('none'); // Supprimer de la liste le tag séléctionner
  searchTag.appendChild(tagContainer); // Afficher l'ingrédient séléctionner
  tagContainer.querySelector('.close_btn').addEventListener('click', () => {
    searchTag.removeChild(tagContainer); // Supprimer le tag séléctionner
    ustensiletEvent.target.classList.remove('none'); // Réafficher dans la liste le tag supprimer
  });
}
//ajouter le tag ustensile
function addTagUstensile() {
  const ustensilesList = document.querySelectorAll('.ustensiles_results');
  for (let i = 0; i < ustensilesList.length; i++) {
    ustensilesList[i].addEventListener('click', addUstensile);
  }
}
//filtrer les ustensiles avec l'input ustensile
function filterUstensil() {
  const searchValue = document.getElementById('ustensiles_input').value.toLowerCase();
  const ustensilListItems = document.querySelectorAll('.ustensiles_results');

  ustensilListItems.forEach((item) => {
    const ustensilName = item.innerText.toLowerCase();
    if (ustensilName.includes(searchValue)) {
      item.classList.remove('none');
    } else {
      item.classList.add('none');
    }
  });
}
//écouteur d'événement sur l'input ustensiles pour lancer la fonction de filtre
const searchInputUstensil = document.getElementById('ustensiles_input');
searchInputUstensil.addEventListener('input', filterUstensil);

// initialisation des foncions
async function init() {
  const { recipes } = await getRecipes();
  allRecipes = recipes;
  searchBar(recipes);
  filteredRecipes = [];
  displayData(recipes);
  displayIngredients(recipes);
  displayAppliances(recipes);
  displayUstensiles(recipes);
  addTagAppliance();
  addTagIngredient();
  addTagUstensile();
}
init();
