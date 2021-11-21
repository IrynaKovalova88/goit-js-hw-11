import axios from 'axios';

export default class PhotosPixabay {
    constructor() {
        this.searchQuery = "";
        this.page = 1;
        this.perPage = 40;
        this.totalHits = 0;
    }
    async searchPhotos() {
        const KEY = '24399627-fe2224483e9e3196e9df20926';
    axios.defaults.baseURL = 'https://pixabay.com/api';
  try {
        const hits = await axios.get(`?key=${KEY}&q=${this.searchQuery}&page=${this.page}&per_page=${this.perPage}&image_type=photo&orientation=horizontal&safesearch=true`);
        this.incrementPage();
        return hits.data;
        } catch(error) {
      return error;
        }

    }

    incrementPage() {
        this.page +=1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}
