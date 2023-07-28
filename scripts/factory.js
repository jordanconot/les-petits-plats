export function recipeFactory(data) {
  const { name, time, description, picture } = data;

  const pictures = `./assets/img-recette/${picture}`

  function getRecipeCardDOM() {
    const article = document.createElement('article');
    article.setAttribute('class', 'recette_section_article');

    const imgContainer = document.createElement('img');
    imgContainer.setAttribute('class', 'recette_section_img');
    imgContainer.setAttribute('src', pictures)

    const recetteContainer = document.createElement('div');
    recetteContainer.setAttribute('class', 'recette_section_recette');

    const recetteTilteTime = document.createElement('div');
    recetteTilteTime.setAttribute('class', 'recette_section_title_prep_time');

    const timer = document.createElement('span');
    timer.textContent = time + ' ' + 'min';
    timer.setAttribute('class', 'recette_section_prep_time');
    const clock = './assets/timer.svg';
    const imgClock = document.createElement('img');
    imgClock.setAttribute('src', clock);

    const recetteIngredientsInstructions = document.createElement('div');
    recetteIngredientsInstructions.setAttribute('class', 'recette_section_ingredients_instructions');

    const ingredients = document.createElement('ul');
    ingredients.setAttribute('class', 'recette_section_ingredients_liste');

    let listIngredients = data['ingredients'];
    for (let i = 0; i < listIngredients.length; i++) {
      let inList = document.createElement('li');
      if (listIngredients[i].ingredient === undefined) listIngredients[i].ingredient = '';
      if (listIngredients[i].quantity === undefined) listIngredients[i].quantity = '';
      if (listIngredients[i].unit === undefined) listIngredients[i].unit = '';
      inList.textContent =
        listIngredients[i].ingredient + ' ' + ' : ' + listIngredients[i].quantity + ' ' + listIngredients[i].unit;
      ingredients.appendChild(inList);
    }

    const recetteInstructions = document.createElement('p');
    recetteInstructions.textContent = description;
    recetteInstructions.setAttribute('class', 'recette_section_instructions');

    const h3 = document.createElement('h3');
    h3.textContent = name;
    h3.setAttribute('class', 'recette_section_title');

    imgContainer.appendChild(recetteContainer);
    article.appendChild(imgContainer);
    article.appendChild(recetteContainer);
    recetteContainer.appendChild(recetteTilteTime);
    recetteTilteTime.appendChild(h3);
    recetteTilteTime.appendChild(timer);
    timer.appendChild(imgClock);
    recetteContainer.appendChild(recetteIngredientsInstructions);
    recetteIngredientsInstructions.appendChild(ingredients);
    recetteIngredientsInstructions.appendChild(recetteInstructions);

    return article;
  }
  return { getRecipeCardDOM };
}

export async function displayData(recipes) {
  const recipeSection = document.querySelector('.recette_section');
  recipeSection.innerHTML = '';
  if (recipes.length === 0) {
    const h3 = document.createElement('h3');
    h3.textContent = 'Aucun résultat ne correspond à votre critère... vous pouvez chercher << tarte aux pommes >>, << poisson >>, etc.';
    recipeSection.appendChild(h3);
  } else {
    recipes.forEach((recipe) => {
      const recipeModel = recipeFactory(recipe);
      const userCardDOM = recipeModel.getRecipeCardDOM();
      recipeSection.appendChild(userCardDOM);
    });
  }
}
