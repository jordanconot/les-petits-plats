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

//---------------------------------------------------------------FILTER MAIN SEARCHBAR--------------------------------------------------------

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
    updateFilterLists();

    if (wordGroup && request && description === '') {
      if (tagIngredientsSelected.length > 0 || tagAppliancesSelected > 0 || tagUstensilsSelected > 0) {
        clearTags();
        filterRecipesByTag();
        updateFilterLists();
        return;
      } else {
        clearTags(); // Remove all tags if doesn't have search
        filterRecipesByTag();
        updateFilterLists();
        return;
      }
    }

    // Vérifier si la recherche correspond à un nom de recette
    const matchedRecipes = allRecipes.filter((recipe) => {
      return filterByName(recipe);
    });
    if (matchedRecipes.length > 0) {
      filteredRecipes = matchedRecipes;
      displayData(filteredRecipes);
      filterRecipesByTag();
      updateFilterLists();
      return;
    }
  });
}

function clearTags() {
  if (tagIngredientsSelected.length > 0) {
    tagIngredientsSelected = tagIngredientsSelected.slice(1);
  }
  if (tagAppliancesSelected.length > 0) {
    tagAppliancesSelected = tagAppliancesSelected.slice(1);
  }
  if (tagUstensilsSelected.length > 0) {
    tagUstensilsSelected = tagUstensilsSelected.slice(1);
  }
}
// Filtrer les listes déroulantes depuis la recherche principales
function updateFilterLists() {
  const searchValue = document.getElementById('searchbar').value.toLowerCase();

  let filteredIngredients = [];
  let filteredAppliances = [];
  let filteredUstensils = [];

  filteredRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const ingredientName = ingredient.ingredient.toLowerCase().trim();
      if (!filteredIngredients.includes(ingredientName)) {
        filteredIngredients.push(ingredientName);
      }
    });

    if (recipe.appliance && !filteredAppliances.includes(recipe.appliance.toLowerCase())) {
      filteredAppliances.push(recipe.appliance.toLowerCase());
    }

    recipe.ustensils.forEach((ustensil) => {
      const ustensilName = ustensil.toLowerCase().trim();
      if (!filteredUstensils.includes(ustensilName)) {
        filteredUstensils.push(ustensilName);
      }
    });
  });

  const ingredientListItems = document.querySelectorAll('.ingredients_results');
  const appplianceListItems = document.querySelectorAll('.appareils_results');
  const ustensilListItems = document.querySelectorAll('.ustensiles_results');

  ingredientListItems.forEach((item) => {
    const ingredientName = item.getAttribute('data-ingredient').toLowerCase().trim();
    const ingredientSelected = ingredientName.includes(searchValue);

    if (!filteredIngredients.includes(ingredientName) || (request && ingredientSelected)) {
      item.classList.add('hidden');
    } else {
      item.classList.remove('hidden');
    }
  });

  appplianceListItems.forEach((item) => {
    const applianceName = item.getAttribute('data-appliance').toLowerCase().trim();
    const applianceSelected = applianceName.includes(searchValue);

    if (!filteredAppliances.includes(applianceName) || (request && applianceSelected)) {
      item.classList.add('hidden');
    } else {
      item.classList.remove('hidden');
    }
  });

  ustensilListItems.forEach((item) => {
    const ustensilName = item.getAttribute('data-ustensil').toLowerCase().trim();
    const ustensilSelected = ustensilName.includes(searchValue);

    if (!filteredUstensils.includes(ustensilName) || (request && ustensilSelected)) {
      item.classList.add('hidden');
    } else {
      item.classList.remove('hidden');
    }
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
    const searchString = word.toLowerCase();

    return (
      recipe.name.toLowerCase().includes(searchString) ||
      recipe.description.toLowerCase().includes(searchString) ||
      recipe.ingredients.some((ingredient) => {
        return ingredient.ingredient.toLowerCase().includes(searchString);
      }) ||
      recipe.ustensils.some((ustensil) => {
        return ustensil.toLowerCase().includes(searchString);
      })
    );
  });
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

// Filter les recettes avec la methode filter en recherchant par titre de la recette et dans la description
function filterRecipes() {
  const recipes = allRecipes.filter((recipe) => {
    return filterByRequest(recipe);
  });
  filteredRecipes = recipes;
  availableIngredients = getAvailableIngredients(recipes);
  availableAppliances = getAvailableAppliances(recipes);
  availableUstensils = getAvailableUstensils(recipes);
  displayData(filteredRecipes);
  updateFilterLists();
}
//-------------------------------------------------------------END FILTER MAIN SEARCHBAR--------------------------------------------------------

//-------------------------------------------------------------RECOVERY VALID ITEMS---------------------------------------------------------------
function getAvailableIngredients(recipes) {
  const ingredientsSet = new Set();
  recipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const ingredientName = ingredient.ingredient.toLowerCase();
      ingredientsSet.add(ingredientName);
    });
  });
  return Array.from(ingredientsSet);
}

function getAvailableAppliances(recipes) {
  const appliancesSet = new Set();
  recipes.forEach((recipe) => {
    if (recipe.appliance) {
      const applianceName = recipe.appliance.toLowerCase();
      appliancesSet.add(applianceName);
    }
  });
  return Array.from(appliancesSet);
}

function getAvailableUstensils(recipes) {
  const ustensilsSet = new Set();
  recipes.forEach((recipe) => {
    recipe.ustensils.forEach((ustensil) => {
      const ustensilName = ustensil.toLowerCase();
      ustensilsSet.add(ustensilName);
    });
  });
  return Array.from(ustensilsSet);
}
//-------------------------------------------------------------END RECOVERY VALID ITEMS-------------------------------------------------------------

//-------------------------------------------------------------DISPLAY DROPDOWN---------------------------------------------------------------------

//Récupérer la liste des ingredients
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
    const ingredient = repetitionIngredients[l];
    const ingredientElement = document.createElement('li');
    ingredientElement.classList.add('ingredients_results');
    ingredientElement.textContent = ingredient;
    ingredientElement.setAttribute('data-ingredient', ingredient.toLowerCase());

    if (request && !ingredient.toLowerCase().includes(request.toLowerCase())) {
      ingredientElement.classList.add('hidden');
    }
    document.querySelector('.filter_ingredients').appendChild(ingredientElement);
  }
}
//Récupérer la liste des appareils
function displayAppliances(recipes) {
  let repetitionAppliances = [];
  document.querySelector('.filter_appareils').innerHTML = '';
  for (let i = 0; i < recipes.length; i++) {
    appliances.push(recipes[i].appliance.toLowerCase());
  }
  repetitionAppliances = appliances.filter((item, index) => appliances.indexOf(item) === index).sort();
  for (let j = 0; j < repetitionAppliances.length; j++) {
    const appliance = repetitionAppliances[j];
    const applianceElement = document.createElement('li');
    applianceElement.classList.add('appareils_results');
    applianceElement.textContent = appliance;
    applianceElement.setAttribute('data-appliance', appliance.toLowerCase());

    if (request && !appliance.toLowerCase().includes(request.toLowerCase())) {
      applianceElement.classList.add('hidden');
    }
    document.querySelector('.filter_appareils').appendChild(applianceElement);
  }
}
//Récupér la liste des ustensiles
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
    const ustensil = repetitionUstensiles[l];
    const ustensilElement = document.createElement('li');
    ustensilElement.classList.add('ustensiles_results');
    ustensilElement.textContent = ustensil;
    ustensilElement.setAttribute('data-ustensil', ustensil.toLowerCase());

    if (request && !ustensil.toLowerCase().includes(request.toLowerCase())) {
      ustensilElement.classList.add('hidden');
    }
    document.querySelector('.filter_ustensiles').appendChild(ustensilElement);
  }
}
// Afficher la liste des ingrédients au clique et cacher la liste lors de la perte du focus
function openDropDownIngredient() {
  filterEventIngredient.classList.add('flex');
  listEventIngredient.classList.remove('hidden_ul');
  inputPlaceHolderIngredient.placeholder = 'Rechercher un ingrédient';
  inputPlaceHolderIngredient.classList.add('opacity');
  inputPlaceHolderIngredient.classList.add('cursor');
  dropDownArrowIngredient.setAttribute('class', 'fas fa-chevron-up arrow');
}
function closeDropDownIngredient() {
  filterEventIngredient.classList.remove('flex');
  listEventIngredient.classList.add('hidden_ul');
  inputPlaceHolderIngredient.placeholder = 'Ingrédients';
  inputPlaceHolderIngredient.classList.remove('opacity');
  inputPlaceHolderIngredient.classList.remove('cursor');
  dropDownArrowIngredient.setAttribute('class', 'fas fa-chevron-down arrow');
}
function triggerDisplayListIngredients() {
  // const input = document.querySelector('.select_ingredient')
  filterEventIngredient.addEventListener('click', openDropDownIngredient);
  document.addEventListener('click', (e) => {
    if (!document.querySelector('.filter_select_ingredients').contains(e.target)) {
      closeDropDownIngredient();
      // input.classList.add('notDisplay');
    }
  });
}
//Afficher la liste des appareils au clique et cacher la liste lors de la perte du focus
function openDropDownAppliance() {
  filterEventAppliance.classList.add('flex');
  listEventAppliance.classList.remove('hidden_ul');
  inputPlaceHolderAppliance.placeholder = 'Rechercher un appareils';
  inputPlaceHolderAppliance.classList.add('opacity');
  inputPlaceHolderAppliance.classList.add('cursor');
  dropDownArrowAppliance.setAttribute('class', 'fas fa-chevron-up arrow');
}
function closeDropDownAppliance() {
  filterEventAppliance.classList.remove('flex');
  listEventAppliance.classList.add('hidden_ul');
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
  listEventUstensiles.classList.remove('hidden_ul');
  inputPlaceHolderUstensiles.placeholder = 'Rechercher un ustensile';
  inputPlaceHolderUstensiles.classList.add('opacity');
  inputPlaceHolderUstensiles.classList.remove('cursor');
  dropDownArrowUstensile.setAttribute('class', 'fas fa-chevron-up arrow');
}
function closeDropDownUstensiles() {
  filterEventUstensiles.classList.remove('flex');
  listEventUstensiles.classList.add('hidden_ul');
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
//-----------------------------------------------------------END DISPLAY DROPDOWN-----------------------------------------------------------------------

//-------------------------------------------------------------FILTER TAG-----------------------------------------------------------------------

//-----------------------------------------------------------MANAGE TAG INGREDIENT----------------------------------------------------------------------

//Selectionner un ingredient
function addIngredient(ingredientEvent) {
  const searchTag = document.querySelector('.tags_searched');
  const itemsSelected = ingredientEvent.target.innerText;
  let tagContainer = document.createElement('div');
  tagContainer.classList.add('ingredient_selected');
  tagContainer.innerHTML = `<p class="name_items_liste">${itemsSelected}</p><img class="close_btn" src='./assets/close-selected.svg'></i>`;

  searchTag.appendChild(tagContainer); // Afficher l'ingrédient sélectionné
  tagContainer.querySelector('.close_btn').addEventListener('click', () => {
    searchTag.removeChild(tagContainer); // Supprimer le tag sélectionné
    const index = tagIngredientsSelected.indexOf(itemsSelected);
    if (index !== -1) {
      tagIngredientsSelected.splice(index, 1);
    }
    filterRecipesByTag();
  });
  tagIngredientsSelected.push(itemsSelected);
  filterRecipesByTag();
  filterRecipes();
  updateFilterLists();
}
//ajouter le tag ingredient
function addTagIngredient() {
  const ingredientsList = document.querySelectorAll('.ingredients_results');
  for (let i = 0; i < ingredientsList.length; i++) {
    ingredientsList[i].addEventListener('click', (ingredientEvent) => {
      addIngredient(ingredientEvent);
      ingredientEvent.target.classList.add('none'); // Rendre l'ingrédient sélectionné invisible dans la liste
      const searchValue = document.getElementById('searchbar').value.toLowerCase();
      if (searchValue !== '') {
        request = searchValue;
      }
      filterRecipesByTag();
      updateFilterLists();
    });
  }
}
// Verification si un ingredient est deja selectionné en comparant son nom avec les ingredients séléctionés
function isIngredientSelected(ingredientName, selectedIngredients) {
  for (let i = 0; i < selectedIngredients.length; i++) {
    const selectedIngredient = selectedIngredients[i].innerText;
    if (selectedIngredient && selectedIngredient.toLowerCase() === ingredientName) {
      return true;
    }
  }
  return false;
}
// Filtrer les ingredients
function filterIngredients(tag) {
  const ingredientListItems = document.querySelectorAll('.ingredients_results');
  const selectedIngredients = document.querySelectorAll('.ingredient_selected .name_items_liste');
  const searchValue = document.getElementById('ingredients_input').value.toLowerCase();
  const input = document.getElementById('ingredients_input');
  const filteredIngredients = filteredRecipes.flatMap((recipe) =>
    recipe.ingredients.map((ingredient) => ingredient.ingredient.toLowerCase()),
  );

  if (tag === true) {
    input.value = '';
    ingredientListItems.forEach((item) => {
      const ingredientName = item.innerText.toLowerCase();
      const isSelected = isIngredientSelected(ingredientName, selectedIngredients);

      if (!isSelected && filteredIngredients.includes(ingredientName)) {
        item.classList.remove('none');
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });

    updateFilterLists();
  } else {
    // By input
    if (searchValue) {
      ingredientListItems.forEach((item) => {
        const ingredientName = item.innerText.toLowerCase();
        const isSelected = isIngredientSelected(ingredientName, selectedIngredients);
        const isRecipeMatch = filteredRecipes.some((recipe) =>
          recipe.ingredients.some((ingredient) => ingredient.ingredient.toLowerCase() === ingredientName),
        );

        if (
          !isSelected &&
          filteredIngredients.includes(ingredientName) &&
          (!request || isRecipeMatch) &&
          ingredientName.includes(searchValue)
        ) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    }

    if (searchValue === '') {
      ingredientListItems.forEach((item) => {
        const ingredientName = item.innerText.toLowerCase();
        const isSelected = isIngredientSelected(ingredientName, selectedIngredients);

        if (!isSelected && filteredIngredients.includes(ingredientName)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    }

    input.classList.remove('hidden');
  }
}
//Ecouteur evenement sur l'input ingredient
function triggerfilterIngredients() {
  const searchTagIngredient = document.getElementById('ingredients_input');
  searchTagIngredient.addEventListener('input', filterIngredients);
}
//-----------------------------------------------------------END MANAGE TAG INGREDIENT----------------------------------------------------------------------

//-----------------------------------------------------------MANAGE TAG APPLIANCE---------------------------------------------------------------------------

//Ajouter un appareil
function addAppliance(appliancetEvent) {
  const searchTag = document.querySelector('.tags_searched');
  const itemsSelected = appliancetEvent.target.innerText;
  let tagContainer = document.createElement('div');
  tagContainer.classList.add('appareil_selected');
  tagContainer.innerHTML = `<p class="name_items_liste">${itemsSelected}</p><img class="close_btn" src='./assets/close-selected.svg'></i>`;

  searchTag.appendChild(tagContainer); // Afficher l'ingrédient séléctionner
  tagContainer.querySelector('.close_btn').addEventListener('click', () => {
    searchTag.removeChild(tagContainer); // Supprimer le tag séléctionner
    const index = tagAppliancesSelected.indexOf(itemsSelected);
    if (index !== -1) {
      tagAppliancesSelected.splice(index, 1);
    }
    filterRecipesByTag();
  });
  tagAppliancesSelected.push(itemsSelected);
  filterRecipesByTag();
  filterRecipes();
  updateFilterLists();
}
// ajouter le tag appareil
function addTagAppliance() {
  const appliancesList = document.querySelectorAll('.appareils_results');
  for (let i = 0; i < appliancesList.length; i++) {
    appliancesList[i].addEventListener('click', (appliancetEvent) => {
      addAppliance(appliancetEvent);
      appliancetEvent.target.classList.add('none');
      const searchValue = document.getElementById('searchbar').value.toLowerCase();
      if (searchValue !== '') {
        request = searchValue;
      }
      filterRecipesByTag();
      updateFilterLists();
    });
  }
}
function isApplianceSelected(applianceName, selectedAppliances) {
  for (let i = 0; i < selectedAppliances.length; i++) {
    const selectedAppliance = selectedAppliances[i].innerText;
    if (selectedAppliance && selectedAppliance.toLowerCase() === applianceName) {
      return true;
    }
  }
  return false;
}
// Filtrer les ingredients avec l'input ingredients
function filterAppliances(tag) {
  const applianceListItems = document.querySelectorAll('.appareils_results');
  const selectedAppliances = document.querySelectorAll('.appareil_selected .name_items_liste');
  const searchValue = document.getElementById('appareils_input').value.toLowerCase();
  const input = document.getElementById('appareils_input');
  const filteredAppliances = filteredRecipes
    .map((recipe) => (recipe.appliance ? recipe.appliance.toLowerCase() : null))
    .filter((appliance) => appliance !== null);

  if (tag === true) {
    input.value = '';
    applianceListItems.forEach((item) => {
      const applianceName = item.innerText.toLowerCase();
      const isSelected = isApplianceSelected(applianceName, selectedAppliances);

      if (!isSelected && filteredAppliances.includes(applianceName)) {
        item.classList.remove('none');
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });

    updateFilterLists();
  } else {
    // By input
    if (searchValue) {
      applianceListItems.forEach((item) => {
        const applianceName = item.innerText.toLowerCase();
        const isSelected = isApplianceSelected(applianceName, selectedAppliances);
        const isRecipeMatch = filteredRecipes.some(
          (recipe) => recipe.appliance && recipe.appliance.toLowerCase() === applianceName,
        );

        if (
          !isSelected &&
          filteredAppliances.includes(applianceName) &&
          (!request || isRecipeMatch) &&
          applianceName.includes(searchValue)
        ) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    }

    if (searchValue === '') {
      applianceListItems.forEach((item) => {
        const applianceName = item.innerText.toLowerCase();
        const isSelected = isApplianceSelected(applianceName, selectedAppliances);

        if (!isSelected && filteredAppliances.includes(applianceName)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    }

    input.classList.remove('hidden');
  }
}

//ecouteur d'événement sur l'input appareil pour lancer la function de filtre
function triggerFilterAppliances() {
  const searchInputAppliance = document.getElementById('appareils_input');
  searchInputAppliance.addEventListener('input', filterAppliances);
}
//-----------------------------------------------------------END MANAGE TAG APPLIANCE-------------------------------------------------------------------------

//-----------------------------------------------------------MANAGE TAG USTENSIL------------------------------------------------------------------------------

// Ajouter un ustensile
function addUstensil(ustensiltEvent) {
  const searchTag = document.querySelector('.tags_searched');
  const itemsSelected = ustensiltEvent.target.innerText;
  let tagContainer = document.createElement('div');
  tagContainer.classList.add('ustensile_selected');
  tagContainer.innerHTML = `<p class="name_items_liste">${itemsSelected}</p><img class="close_btn" src='./assets/close-selected.svg'></i>`;

  searchTag.appendChild(tagContainer); // Afficher l'ustensile sélectionné
  tagContainer.querySelector('.close_btn').addEventListener('click', () => {
    searchTag.removeChild(tagContainer); // Supprimer le tag sélectionné
    const index = tagUstensilsSelected.indexOf(itemsSelected);
    if (index !== -1) {
      tagUstensilsSelected.splice(index, 1);
    }
    filterRecipesByTag();
  });
  tagUstensilsSelected.push(itemsSelected);
  filterRecipesByTag();
  filterRecipes();
  updateFilterLists();
}
// Ajouter le tag ustensile
function addTagUstensile() {
  const ustensilesList = document.querySelectorAll('.ustensiles_results');
  ustensilesList.forEach((ustensile) => {
    ustensile.addEventListener('click', (ustensiltEvent) => {
      addUstensil(ustensiltEvent);
      ustensiltEvent.target.classList.add('none');
      const searchValue = document.getElementById('searchbar').value.toLowerCase();
      if (searchValue !== '') {
        request = searchValue;
      }
      filterRecipesByTag();
      updateFilterLists();
    });
  });
}
function isUstensilSelected(ustensilName, selectedUstensils) {
  for (let i = 0; i < selectedUstensils.length; i++) {
    const selectedUstensil = selectedUstensils[i].innerText;
    if (selectedUstensil && selectedUstensil.toLowerCase() === ustensilName) {
      return true;
    }
  }
  return false;
}
function filterUstensils(tag) {
  const ustensilListItems = document.querySelectorAll('.ustensiles_results');
  const selectedUstensils = document.querySelectorAll('.ustensile_selected .name_items_liste');
  const searchValue = document.getElementById('ustensiles_input').value.toLowerCase();
  const input = document.getElementById('ustensiles_input');
  const filteredUstensils = filteredRecipes.flatMap((recipe) =>
    recipe.ustensils ? recipe.ustensils.map((ustensil) => ustensil.toLowerCase()) : [],
  );

  if (tag === true) {
    input.value = '';
    ustensilListItems.forEach((item) => {
      const ustensilName = item.innerText.toLowerCase();
      const isSelected = isUstensilSelected(ustensilName, selectedUstensils);

      if (!isSelected && filteredUstensils.includes(ustensilName)) {
        item.classList.remove('none');
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });

    updateFilterLists();
  } else {
    // By input
    if (searchValue) {
      ustensilListItems.forEach((item) => {
        const ustensilName = item.innerText.toLowerCase();
        const isSelected = isUstensilSelected(ustensilName, selectedUstensils);
        const isRecipeMatch = filteredRecipes.some(
          (recipe) => recipe.ustensils && recipe.ustensils.some((ustensil) => ustensil.toLowerCase() === ustensilName),
        );

        if (
          !isSelected &&
          filteredUstensils.includes(ustensilName) &&
          (!request || isRecipeMatch) &&
          ustensilName.includes(searchValue)
        ) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    }

    if (searchValue === '') {
      ustensilListItems.forEach((item) => {
        const ustensilName = item.innerText.toLowerCase();
        const isSelected = isUstensilSelected(ustensilName, selectedUstensils);

        if (!isSelected && filteredUstensils.includes(ustensilName)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    }

    input.classList.remove('hidden');
  }
}
//écouteur d'événement sur l'input ustensiles pour lancer la fonction de filtre
function triggerFilterUstensils() {
  const searchInputUstensil = document.getElementById('ustensiles_input');
  searchInputUstensil.addEventListener('input', filterUstensils);
}
//-----------------------------------------------------------END MANAGE TAG USTENSIL-------------------------------------------------------------------------

function filterRecipesByTag() {
  const recipes = allRecipes.filter((recipe) => {
    return (
      filterBySelectedIngredients(recipe) &&
      filterBySelectedAppliances(recipe) &&
      filterBySelectedUstensils(recipe) &&
      filterByRequest(recipe)
    );
  });

  filteredRecipes = recipes;
  availableIngredients = getAvailableIngredients(recipes);
  availableAppliances = getAvailableAppliances(recipes);
  availableUstensils = getAvailableUstensils(recipes);

  filterIngredients(true);
  filterAppliances(true);
  filterUstensils(true);
  displayData(filteredRecipes);
}
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
// Filtrer par tags appareils
function filterBySelectedAppliances(recipe) {
  if (tagAppliancesSelected.length === 0) {
    return true;
  }
  return tagAppliancesSelected.some((selectedAppliance) => {
    return recipe.appliance.toLowerCase() === selectedAppliance.toLowerCase();
  });
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
//-------------------------------------------------------------END FILTER TAG---------------------------------------------------------------------
//-----------------------------------------------------------INIT--------------------------------------------------------------------------------------------
// initialisation des foncions
async function init() {
  const { recipes } = await getRecipes();
  allRecipes = recipes;
  searchBar();
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
