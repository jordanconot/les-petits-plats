import { getRecipes } from './api.js';
import { displayData } from './factory.js';

// Data storage
let request = '';
let allRecipes = [];
let ingredients = [];
let ustensils = [];
let description = '';
let appliances = [];
let filteredRecipes = [];
let tagIngredientsSelected = [];
let tagAppliancesSelected = [];
let tagUstensilsSelected = [];
let wordGroup = [];
// let selectedIngredient = [];
let availableIngredients = [];
let availableAppliances = [];
let availableUstensils = [];

// Declaration of constante
const filterEventUstensiles = document.getElementById('tags_ustensile');
const listEventUstensiles = document.querySelector('.filter_ustensiles');
const dropDownArrowUstensile = document.querySelector('.arrow_ustensiles');
const inputPlaceHolderUstensiles = document.getElementById('ustensiles_input');
const filterEventAppliance = document.getElementById('tags_appareil');
const listEventAppliance = document.querySelector('.filter_appareils');
const dropDownArrowAppliance = document.querySelector('.arrow_appareils');
const inputPlaceHolderAppliance = document.getElementById('appareils_input');
const filterEventIngredient = document.getElementById('tags_ingredient');
const listEventIngredient = document.querySelector('.filter_ingredients');
const dropDownArrowIngredient = document.querySelector('.arrow_ingredients');
const inputPlaceHolderIngredient = document.getElementById('ingredients_input');


//----------------------------------------------------Section search principal-----------------------------------------------

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

//Rechercher une recette en filtrant avec toutes les façon demandées
function filterByRequest(recipe) {
  return filterByIngredient(recipe) || filterByName(recipe) || filterByDescription(recipe) || filterByWordGroup(recipe);
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
  console.log(recipe);
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

//--------------------------------------------------------------------Filtre By TAG------------------------------------------------

// Filtrer par tags ingredients
function filterBySelectedIngredients(recipe) {
  if (tagIngredientsSelected.length === 0) {
    return true;
  }
  return (
    recipe.ingredients.filter((ingredient) => {
      return tagIngredientsSelected.some(
        (selectedIngredient) => selectedIngredient.toLowerCase() === ingredient.ingredient.toLowerCase(),
      );
    }).length === tagIngredientsSelected.length
  );
}

//Afficher les recettes par tags ingredients sélectionnés
function filterRecipesByIngredientsSelected() {
  const recipes = allRecipes.filter((recipe) => {
    return filterBySelectedIngredients(recipe);
  });
  filteredRecipes = recipes;
  availableIngredients = getAvailableIngredients(recipes);
  availableAppliances = getAvailableAppliances(recipes);
  availableUstensils = getAvailableUstensils(recipes);

  filterIngredients(true);
  filterAppliances(true);
  filterUstensils(true);
  displayData(recipes);
}

// Filtrer par tags appareils
function filterBySelectedAppliances(recipe) {
  if (tagAppliancesSelected.length === 0) {
    return true;
  }
  return tagAppliancesSelected.some((selectedAppliance) => {
    return recipe.appliance.toLowerCase() === selectedAppliance.toLowerCase();
  });
}

//Afficher les recettes par tags appareils sélectionnés
function filterRecipesByAppliancesSelected() {
  const recipes = allRecipes.filter((recipe) => {
    return filterBySelectedAppliances(recipe);
  });
  filteredRecipes = recipes;
  availableIngredients = getAvailableIngredients(recipes);
  availableAppliances = getAvailableAppliances(recipes);
  availableUstensils = getAvailableUstensils(recipes);

  filterAppliances(true);
  filterIngredients(true);
  filterUstensils(true);
  displayData(recipes);
}

// Filtrer par ustensiles sélectionnés
function filterBySelectedUstensils(recipe) {
  if (tagUstensilsSelected.length === 0) {
    return true;
  }
  return tagUstensilsSelected.every((selectedUstensil) => {
    return recipe.ustensils.some((ustensil) => {
      return ustensil.toLowerCase() === selectedUstensil.toLowerCase();
    });
  });
}

// Filtrer les recettes par ustensiles sélectionnés
function filterRecipesByUstensilsSelected() {
  const recipes = allRecipes.filter((recipe) => {
    return filterBySelectedUstensils(recipe);
  });
  filteredRecipes = recipes;
  availableIngredients = getAvailableIngredients(recipes);
  availableAppliances = getAvailableAppliances(recipes);
  availableUstensils = getAvailableUstensils(recipes);

  filterAppliances(true);
  filterUstensils(true);
  filterIngredients(true);
  displayData(recipes);
}




//--------------------------------------------------recovery of valid items---------------------------------------------------
function getAvailableIngredients(recipes) {
  // let availableIngredients = [];
  
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const ingredientName = ingredient.ingredient.toLowerCase();
      if (!availableIngredients.includes(ingredientName)) {
        availableIngredients.push(ingredientName);
        // console.log(availableIngredients);
      }
    });
  });
  return availableIngredients;
}


function getAvailableAppliances(recipes) {
  // const availableAppliances = [];
  recipes.forEach((recipe) => {
    if (recipe.appliance) {
      const applianceName = recipe.appliance.toLowerCase();
      if (!availableAppliances.includes(applianceName)) {
        availableAppliances.push(applianceName);
      }
    }
  });
  return availableAppliances;
}

function getAvailableUstensils(recipes) {
  // const availableUstensils = [];
  recipes.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      const ustensilName = ustensil.toLowerCase();
      if (!availableUstensils.includes(ustensilName)) {
        availableUstensils.push(ustensilName);
        console.log(availableUstensils);
      }
    });
  });
  return availableUstensils;
}


// Afficher la liste des ingrédients au clique et cacher la liste lors de la perte du focus
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


function triggerDisplayListIngredients() {
  filterEventIngredient.addEventListener('click', openDropDownIngredient);
  document.addEventListener('click', (e) => {
    if (!document.querySelector('.filter_select_ingredients').contains(e.target)) {
      closeDropDownIngredient();
    }
  });
}

//Afficher la liste des appareils au clique et cacher la liste lors de la perte du focus
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

function triggerDisplayListAppliances() {
  filterEventAppliance.addEventListener('click', openDropDownAppliance);
  document.addEventListener('click', (e) => {
    if (!document.querySelector('.filter_select_appareils').contains(e.target)) {
      closeDropDownAppliance();
    }
  });
}

//Afficher la liste des ustensiles au clique et cacher la liste lors de la perte du focus

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

function triggerDisplayListUstensiles() {
  filterEventUstensiles.addEventListener('click', openDropDownUstensiles);
  document.addEventListener('click', (e) => {
    if (!document.querySelector('.filter_select_ustensiles').contains(e.target)) {
      closeDropDownUstensiles();
    }
  });
}


//--------------------------------------------INGREDIENT---------------------------------------------------------------------------------

//Selectionner un ingredient
function addIngredient(ingredientEvent) {
  const searchTag = document.querySelector('.tags_searched');
  const itemsSelected = ingredientEvent.target.innerText;
  let tagContainer = document.createElement('div');
  tagContainer.innerHTML = '';
  tagContainer.classList.add('ingredient_selected');
  tagContainer.innerHTML = `<p class="name_items_liste">${itemsSelected}</p><img class="close_btn" src='./assets/close-selected.svg'></i>`;

  searchTag.appendChild(tagContainer); // Afficher l'ingrédient sélectionné
  tagContainer.querySelector('.close_btn').addEventListener('click', () => {
    searchTag.removeChild(tagContainer); // Supprimer le tag sélectionné
    const index = tagIngredientsSelected.indexOf(itemsSelected);
    if (index !== -1) {
      tagIngredientsSelected.splice(index, 1);
      filterRecipesByIngredientsSelected();
    }
  });

  tagIngredientsSelected.push(itemsSelected);
  filterRecipesByIngredientsSelected();
}
// Verification si un ingredient est deja selectionné en comparant son nom avec les ingredients séléctionés
function isIngredientSelected(ingredientName, selectedIngredients) {
  for (let i = 0; i < selectedIngredients.length; i++) {
    if (selectedIngredients[i].innerText.toLowerCase() === ingredientName) {
      return true;
    }
  }
  return false;
}

//ajouter le tag ingredient
function addTagIngredient() {
  const ingredientsList = document.querySelectorAll('.ingredients_results');
  for (let i = 0; i < ingredientsList.length; i++) {
    ingredientsList[i].addEventListener('click', (ingredientEvent) => {
      addIngredient(ingredientEvent);
      ingredientEvent.target.classList.add('none'); // Rendre l'ingrédient sélectionné invisible dans la liste
    });
  }
}

// Filtrer les ingredients avec l'input ingredients
function filterIngredients(tag){

  const ingredientListItems = document.querySelectorAll('.ingredients_results');
  const selectedIngredients = document.querySelectorAll('.ingredient_selected .name_items_liste');
  const searchValue = document.getElementById('ingredients_input').value.toLowerCase();
  const input = document.getElementById('ingredients_input');

    ingredientListItems.forEach((item) => {
      const ingredientName = item.innerText.toLowerCase();
      const isTagMatch = ingredientName.includes(searchValue);
      const isSearchMatch = availableIngredients.includes(ingredientName);
      const isSelected = isIngredientSelected(ingredientName, selectedIngredients);
  
      if ((searchValue && (isTagMatch || isSearchMatch)) || isSelected) {
        item.classList.remove('none');
      } else {
        item.classList.add('none');
      }
    });

    if (searchValue === '') {
      ingredientListItems.forEach((item) => {
        item.classList.remove('none');
      });
    }

   if(tag === true) {
    input.classList.add('none');
    ingredientListItems.forEach((item) => {
      const ingredientName = item.innerText.toLowerCase();
      if(availableIngredients.includes(ingredientName) && !isIngredientSelected(ingredientName, selectedIngredients)) {
        item.classList.remove('none');
      } else {
        item.classList.add('none');
      }
    })
    input.classList.remove('none');
  }
}

//Ecouteur evenement sur l'input ingredient
function triggerfilterIngredients() {
  const searchTagIngredient = document.getElementById('ingredients_input');
  searchTagIngredient.addEventListener('input', filterIngredients);
}
//---------------------------------------------------APPLIANCE---------------------------------------------------------

//Ajouter un appareil
function addAppliance(appliancetEvent) {
  const searchTag = document.querySelector('.tags_searched');
  const itemsSelected = appliancetEvent.target.innerText;
  let tagContainer = document.createElement('div');
  tagContainer.innerHTML = '';
  tagContainer.classList.add('appareil_selected');
  tagContainer.innerHTML = `<p class="name_items_liste">${itemsSelected}</p><img class="close_btn" src='./assets/close-selected.svg'></i>`;

  searchTag.appendChild(tagContainer); // Afficher l'ingrédient séléctionner
  tagContainer.querySelector('.close_btn').addEventListener('click', () => {
    searchTag.removeChild(tagContainer); // Supprimer le tag séléctionner
    const index = tagAppliancesSelected.indexOf(itemsSelected);
    if(index !== -1) {
      tagAppliancesSelected.splice(index, 1);
      filterRecipesByAppliancesSelected();
    }
  });
  tagAppliancesSelected.push(itemsSelected);
  filterRecipesByAppliancesSelected();
}
// ajouter le tag appareil
function addTagAppliance() {
  const appliancesList = document.querySelectorAll('.appareils_results');
  for (let i = 0; i < appliancesList.length; i++) {
    appliancesList[i].addEventListener('click', (appliancetEvent) => {
      addAppliance(appliancetEvent);
      appliancetEvent.target.classList.add('none');
    });
  }
}

function isApplianceSelected(applianceName, selectedAppliances) {
  for (let i = 0; i < selectedAppliances.length; i++) {
    if (selectedAppliances[i].innerText.toLowerCase() === applianceName) {
      return true;
    }
  }
  return false;
}

// Filtrer les ingredients avec l'input ingredients------------------------- A REVOIR-----------------------------
function filterAppliances(tag) {
  const searchValue = document.getElementById('appareils_input').value.toLowerCase();
  const applianceListItems = document.querySelectorAll('.appareils_results');
  const selectedAppliances = document.querySelectorAll('.appareil_selected .name_items_liste');
  const input = document.getElementById('appareils_input');
  
  applianceListItems.forEach((item) => {
    const applianceName = item.innerText.toLowerCase();
    const isTagMatch = applianceName.includes(searchValue);
    const isSearchMatch = availableAppliances.includes(applianceName);
    const isSelected = isApplianceSelected(applianceName, selectedAppliances);

    if ((searchValue && (isTagMatch || isSearchMatch)) || isSelected) {
      item.classList.remove('none');
    } else {
      item.classList.add('none');
    }
  });
  //Si l'input est vide, réaffiche la liste des appareils
  if (searchValue === '') {
    applianceListItems.forEach((item) => {
      item.classList.remove('none');
    });
  }
  if(tag === true) {
    input.classList.add('none');
    applianceListItems.forEach((item) => {
      const applianceName = item.innerText.toLowerCase();
      if (availableAppliances.includes(applianceName) && !isApplianceSelected(applianceName, selectedAppliances)) {
        item.classList.remove('none');
      } else {
        item.classList.add('none');
      }
    });
  }
  input.classList.remove('none');
}

//ecouteur d'événement sur l'input appareil pour lancer la function de filtre
function triggerFilterAppliances() {
  const searchInputAppliance = document.getElementById('appareils_input');
  searchInputAppliance.addEventListener('input', filterAppliances);
}


//--------------------------------------------------------USTENSILS---------------------------------------------------------------

function isUstensilSelected(ustensilName, selectedUstensils) {
  for (let i = 0; i < selectedUstensils.length; i++) {
    if (selectedUstensils[i].innerText.toLowerCase() === ustensilName) {
      return true;
    }
  }
  return false;
}

// Ajouter un ustensile
function addUstensil(ustensiltEvent) {
  const searchTag = document.querySelector('.tags_searched');
  const itemsSelected = ustensiltEvent.target.innerText;
  let tagContainer = document.createElement('div');
  tagContainer.innerHTML = '';
  tagContainer.classList.add('ustensile_selected');
  tagContainer.innerHTML = `<p class="name_items_liste">${itemsSelected}</p><img class="close_btn" src='./assets/close-selected.svg'></i>`;

  
  searchTag.appendChild(tagContainer); // Afficher l'ustensile sélectionné
  tagContainer.querySelector('.close_btn').addEventListener('click', () => {
    searchTag.removeChild(tagContainer); // Supprimer le tag sélectionné
    const index = tagUstensilsSelected.indexOf(itemsSelected);
    if (index !== -1) {
      tagUstensilsSelected.splice(index, 1);
      filterRecipesByUstensilsSelected();
    }
  });
    tagUstensilsSelected.push(itemsSelected)
    filterRecipesByUstensilsSelected();
}

// Ajouter le tag ustensile
function addTagUstensile() {
  const ustensilesList = document.querySelectorAll('.ustensiles_results');
  ustensilesList.forEach((ustensile) => {
    ustensile.addEventListener('click', (ustensiltEvent) => {
      addUstensil(ustensiltEvent);
      ustensiltEvent.target.classList.add('none');
    });
  });
}

function filterUstensils(tag) {
  const searchValue = document.getElementById('ustensiles_input').value.toLowerCase();
  const ustensilListItems = document.querySelectorAll('.ustensiles_results');
  const selectedUstensils = document.querySelectorAll('.ustensile_selected .name_items_liste');
  const input = document.getElementById('ustensiles_input');

  ustensilListItems.forEach((item) => {
    const ustensilName = item.innerText.toLowerCase();
    const isTagMatch = ustensilName.includes(searchValue);
    const isSearchMatch = availableUstensils.includes(ustensilName);
    const isSelected = isUstensilSelected(ustensilName, selectedUstensils);

    if((searchValue && (isTagMatch || isSearchMatch)) || isSelected) {
      item.classList.remove('none');
    } else {
      item.classList.add('none');
    }
  });
  //Si l'input est vide, réaffiche la liste des ustensiles
  if(searchValue === '') {
    ustensilListItems.forEach((item) => {
      item.classList.remove('none');
    });
  }
  if(tag === true) {
    input.classList.add('none');
    ustensilListItems.forEach((item) => {
      const ustensilName = item.innerText.toLowerCase();
      if(availableUstensils.includes(ustensilName) && !isUstensilSelected(ustensilName, selectedUstensils)) {
        item.classList.remove('none');
      } else {
        item.classList.add('none');
      }
    })
  }
  input.classList.remove('none');
}

//écouteur d'événement sur l'input ustensiles pour lancer la fonction de filtre
function triggerFilterUstensils() {
  const searchInputUstensil = document.getElementById('ustensiles_input');
  searchInputUstensil.addEventListener('input', filterUstensils);
}

//---------------------------------------------------------INIT-----------------------------------------
// initialisation des foncions
async function init() {
  const { recipes } = await getRecipes();
  allRecipes = recipes;
  searchBar(recipes);
  filteredRecipes = recipes;
  displayData(recipes);
  displayIngredients(recipes);
  displayAppliances(recipes);
  displayUstensiles(recipes);
  addTagAppliance();
  addTagIngredient();
  addTagUstensile();
  triggerDisplayListIngredients();
  triggerDisplayListAppliances();
  triggerDisplayListUstensiles();
  triggerfilterIngredients();
  triggerFilterAppliances();
  triggerFilterUstensils();
}

init();
