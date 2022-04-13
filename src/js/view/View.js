import icons from '../../img/icons.svg';

export default class View {
  _data;

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErrMsg();
    this._data = data;
    this._clear();
    const markUp = this._generateMarkup();
    this._parentEl.insertAdjacentHTML('beforeend', markUp);
  }

  updated(data) {
    this._data = data;
    const updatedMarkup = this._generateMarkup();

    const newDOM = document
      .createRange()
      .createContextualFragment(updatedMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const currentEl = currElements[i];

      // updates TEXT

      if (
        !newEl.isEqualNode(currentEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl.firstChild?.nodeValue.trim(), '🛑');
        currentEl.textContent = newEl.textContent;
      }

      // updates ATTRIBUTES

      if (!newEl.isEqualNode(currentEl)) {
        Array.from(newEl.attributes).forEach(attr => {
          currentEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }

  renderSpinner() {
    const markUp = `
       <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }

  renderErrMsg(message = this._errMessage) {
    const markUp = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }

  renderSuccessMsg(message = this._successMessage) {
    const markUp = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markUp);
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }
}
