import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { getJson, sendJson } from './helper.js';
// console.log(get);
export const state = {
  recipe: {},

  search: {
    query: '',
    results: [],
    resultPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  console.log(recipe);
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJson(`${API_URL}${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(err);
    // throw err;
  }
};

export const loadSearchRecipe = async function (query) {
  try {
    // reset the pagination everytime if there there is new recipe search happen
    state.search.page = 1;
    //will get array of all recipe releated to query
    const data = await getJson(`${API_URL}?search=${query}&key=${KEY}`);
    state.search.results = data.data.recipes.map(cur => {
      return {
        id: cur.id,
        imageUrl: cur.image_url,
        publisher: cur.publisher,
        title: cur.title,
        ...(cur.key && { key: cur.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};
// loadSearchRecipe('pizza');

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    // quantity=oldQty*newServings/oldServings===>2*8/4
  });
  state.recipe.servings = newServings;
  console.log(state.recipe);
};

const presistBookmarks = function () {
  return localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  state.recipe.bookmark = true;
  presistBookmarks();
};

export const deleteBokmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.bookmark === id);
  state.bookmarks.splice(index, 1);
  state.recipe.bookmark = false;
  presistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        //Gaurd Clause
        if (ingArr.length !== 3)
          throw new Error(
            `Ingredient format is not correct! Please use this format Ingredient1:quantity,unit,description`
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJson(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
