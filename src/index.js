import 'material-icons/iconfont/material-icons.css';
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PhotosPixabay from './js/search-photo';
import photoCard from './template/photo-card.hbs';

const photosPixabay = new PhotosPixabay();

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more-btn')
}

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

function onSearch(e) {
  e.preventDefault();
  photosPixabay.query = e.currentTarget.elements.searchQuery.value.trim();
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
  refs.searchForm.reset();

  photosPixabay.resetPage();
  photosPixabay.searchPhotos().then(({ hits, totalHits, perPage, page }) => {
    if (photosPixabay.query === '') {
    Notify.failure(`Please, type your search query`);
    return;
  }
    if (hits.length === 0) {
      Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
      return;
    }
    Notify.info(`Hooray! We found ${totalHits} images.`);
    renderPhotos(hits);
    lightboxPhotos();
    refs.loadMoreBtn.classList.remove('is-hidden');
    endPhotos(totalHits, perPage, page);
  })
}

function onLoadMoreBtn() {
  photosPixabay.searchPhotos().then(({ hits, totalHits, perPage, page }) => {
    renderPhotos(hits);
    lightboxPhotos();
    scroll();
    endPhotos(totalHits, perPage, page);
  })
}
    
function endPhotos (totalHits, perPage, page) {
 const lastPage = 1 + Math.ceil(totalHits / perPage);
  if (page >= lastPage) {
   Notify.info(`We're sorry, but you've reached the end of search results.`);
    refs.loadMoreBtn.classList.add("hidden");
 }
}

function renderPhotos(hits) {
    refs.gallery.insertAdjacentHTML('beforeend', photoCard(hits));
}

function lightboxPhotos() {
  const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
}

function scroll () {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}

// let totalPage = Math.ceil(totalHits / perPage);
//     if (page === totalPage) {
//       endHits = true;
//       Notify.info(`We're sorry, but you've reached the end of search results.`);
//     }


