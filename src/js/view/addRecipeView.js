import View from './View';
import icons from '../../img/icons.svg';

class addRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _successMessage = 'Recipe was successfuly uploaded!';

  _overlay = document.querySelector('.overlay');
  _window = document.querySelector('.add-recipe-window');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  constructor() {
    super();
    this._addOpenHandler();
    this._addCloseHandler();
  }

  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  _addOpenHandler() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  _addCloseHandler() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addNewRecipeHandler(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      const fromDataApi = [...new FormData(this)];
      const formData = Object.fromEntries(fromDataApi);
      handler(formData);
    });
  }
}

export default new addRecipeView();
