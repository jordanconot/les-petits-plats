export async function getRecipes() {
  const recipesAPI = await fetch('./Data/recipes.json')
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error('error:', err);
    });
  return recipesAPI;
}
