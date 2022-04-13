import View from './View';

import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  paginationHandler(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPage = Math.ceil(
      this._data.results.length / this._data.resultPerPage
    );
    // console.log(numPage);
    //page 1,and other pager
    if (currentPage === 1 && numPage > 1) {
      return `
       <button
       data-goto="${currentPage + 1}"
       class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    //other pages
    if (currentPage < numPage) {
      return `
      <button data-goto="${
        currentPage - 1
      }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
          <button data-goto="${
            currentPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }
    //last page
    if (currentPage === numPage && numPage > 1) {
      return `
       <button data-goto="${
         currentPage - 1
       }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>          
            <span>Page ${currentPage - 1}</span>
          </button>`;
    }
    //only 1 page
    return '';
  }
}

export default new PaginationView();
