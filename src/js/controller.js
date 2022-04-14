import * as modal from './modal.js';
import { async } from 'regenerator-runtime';
import addRecipeView from './view/addRecipeView.js';
// import 'core-js/stable';
import { KEY, MODAL_CLOSE_SEC } from './config.js';
import resultView from './view/resultView.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchView.js';
import paginationView from './view/paginationView.js';
import bookmarkView from './view/bookmarkView.js';
const recipeController = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    // 0) update only the elements that have changes NoOTthe whole container
    resultView.updated(modal.getSearchResultsPage());

    bookmarkView.updated(modal.state.bookmarks);
    // 1) fetching data about recipe

    await modal.loadRecipe(id);
    // 2) Recipe renderer

    recipeView.render(modal.state.recipe);
  } catch (err) {
    recipeView.renderErrMsg();
  }
};

const recipeSearchController = async function () {
  try {
    // resultView.renderSpinner();
    // get recipe name
    const query = searchView.getQuery();

    // Gaurd clause
    if (!query) return;

    // load that recipe result through api
    await modal.loadSearchRecipe(query);
    resultView.render(modal.getSearchResultsPage());
    paginationView.render(modal.state.search);
  } catch (err) {
    alert(err);
  }
};

const paginationController = function (goToPage) {
  // Render new page on click
  resultView.render(modal.getSearchResultsPage(goToPage));
  paginationView.render(modal.state.search);
};

const servingsController = function (newServings) {
  modal.updateServings(newServings);
  // recipeView.render(modal.state.recipe);
  // updated After increasing or decreasing servings
  recipeView.updated(modal.state.recipe);
};

const addBookmarksController = function () {
  //ADD or DELETE bookmarks
  if (!modal.state.recipe.bookmark) modal.addBookmark(modal.state.recipe);
  else modal.deleteBokmark(modal.state.recipe.id);

  // update the recipe without reloading the whole recipe data
  recipeView.updated(modal.state.recipe);

  // render BOOKMARKS lists
  bookmarkView.render(modal.state.bookmarks);
};

const localStgBookMrkRender = function () {
  bookmarkView.render(modal.state.bookmarks);
};

const addRecipeControler = async function (newRecipe) {
  try {
    //render spinner before uploading
    addRecipeView.renderSpinner();

    //Uploading a recipe
    await modal.uploadRecipe(newRecipe);

    //Rendering the uploaded recipe
    recipeView.render(modal.state.recipe);

    // render success message
    addRecipeView.renderSuccessMsg();

    //adding the recipe in bookmarksView
    bookmarkView.render(modal.state.bookmarks);

    // bookmarkView.updated(modal.state.bookmarks);

    window.history.pushState(null, '', `#${modal.state.recipe.id}`);

    // bookmarkView.updated(modal.state.bookmarks);

    // close window after uploading recipe
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderErrMsg(err);
  }
};
console.log('khan');
const init = function () {
  bookmarkView.localStgBookMrkHandler(localStgBookMrkRender);
  recipeView.addHandlerRender(recipeController);
  recipeView.addHandlerUpdateServings(servingsController);
  recipeView.addHandlerBookmark(addBookmarksController);
  searchView.searchHandlerRender(recipeSearchController);
  paginationView.paginationHandler(paginationController);
  addRecipeView.addNewRecipeHandler(addRecipeControler);
};
init();
