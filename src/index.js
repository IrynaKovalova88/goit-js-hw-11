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

  if (photosPixabay.query === '') {
    refs.loadMoreBtn.classList.add('is-hidden');
    refs.gallery.innerHTML = '';
    return Notify.failure(`Please, type your search query`);
  }
  photosPixabay.resetPage();
  photosPixabay.searchPhotos().then(({hits, totalHits}) => {
    refs.gallery.innerHTML = '';
    if (hits.length === 0) {
      refs.loadMoreBtn.classList.add('is-hidden');
      return Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
    }
    Notify.info(`Hooray! We found ${totalHits} images.`);
    renderPhotos(hits);
    lightboxPhotos();
    refs.loadMoreBtn.classList.remove('is-hidden');
  })
}

function onLoadMoreBtn() {
  photosPixabay.searchPhotos().then(({ hits, totalHits, page, perPage }) => {
    renderPhotos(hits);
    lightboxPhotos();
    scroll();
    if (page < totalHits / perPage) {
      refs.loadMoreBtn.classList.add("is-hidden");
      return Notify.info(`We're sorry, but you've reached the end of search results.`);
    }
  })
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
  top: cardHeight * 8,
  behavior: "smooth",
});
}
