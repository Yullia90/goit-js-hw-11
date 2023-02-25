// <!-- Завдання -->

//========================================================================================================
import fetchPhotos from './fetch';
//=======Бібліотека SimpleLightbox========================
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';
//=======підключаємо розмітку=========
import { createPhotoCard } from './photoCardTpl';
//=======Бібліотека Notify========================
import Notiflix from 'notiflix';
//Користувач буде вводити рядок для пошуку у текстове поле, а по сабміту форми необхідно виконувати
// HTTP - запит.

//=======звертаємось до змінних=================
const submitBtn = document.querySelector('.search-form__btn');
const photoGalery = document.querySelector('.gallery');
const searchFormEl = document.querySelector('.search-form');
const searchFormInputEl = document.querySelector('.search-form__input');
const paginatioBtnEl = document.querySelector('.load-more');
const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
//=========викликаємо слухачів=====================
searchFormEl.addEventListener('submit', onSubmit);
searchFormEl.addEventListener('keydown', event => {
  if (event.currentTarget.value === 'Enter') onSubmit();
});
searchFormInputEl.addEventListener('input', onInput);
paginatioBtnEl.addEventListener('click', onPaginationBtnClick);
//============
let searchQuery = '';
let numberOfPage = 1;
//============звертаємось до форми и значення в ній==================
async function onSubmit() {
  event.preventDefault();
  addVisibleClsToPaginationBtn();
  paginatioBtnEl.textContent = 'Loading';
  submitBtn.disabled = true;
  numberOfPage = 1;

  if (!searchQuery.trim()) {
    // якщо рядок пустий або містить тільки пробіли
    Notiflix.Notify.warning('Please enter a valid search query.');
    return; // виходимо з функції, якщо рядок порожній
  }
  try {
    const response = await fetchPhotos(searchQuery, numberOfPage);
    const photos = response.data.hits;
    const totalHits = response.data.totalHits;
    totalMatches = photos.length;
    if (photos.length === 0) {
      removeVisibleClsOfPaginationBtn();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (photos.length !== 0) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    const markup = await createPhotoCard(photos);
    updateGaleryMarkup(markup);

    if (markup) {
      paginatioBtnEl.textContent = 'Load more';
    }
    // Перевірка, якщо картинок менше, ніж 40 на сторінці
    if (photos.length < 40) {
      removeVisibleClsOfPaginationBtn();
    }
    gallery.refresh();
  } catch (error) {
    console.log(error);
  }
}

//=======додаємо та прибираємо клас на кнопку
function addVisibleClsToPaginationBtn() {
  paginatioBtnEl.classList.add('visible');
}

function removeVisibleClsOfPaginationBtn() {
  paginatioBtnEl.classList.remove('visible');
}

function onInput(event) {
  searchQuery = event.target.value.trim();
  if (searchQuery) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
  return searchQuery;
}

let totalMatches = 0;
//===Пагінація
async function onPaginationBtnClick(event) {
  numberOfPage += 1;
  paginatioBtnEl.disabled = true;

  try {
    const response = await fetchPhotos(searchQuery, numberOfPage);
    const photos = response.data.hits;
    const totalHits = response.data.totalHits;
    totalMatches += photos.length;
    if (totalMatches >= totalHits || totalMatches === 0) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      removeVisibleClsOfPaginationBtn();
    }

    const markup = await createPhotoCard(photos);
    addMarkupToGalery(markup);
    paginatioBtnEl.disabled = false;
    gallery.refresh();
  } catch (error) {
    alert('Whoops, something wrong((( Please, try again');
  }
}

//=========додаємо сторінку========
function updateGaleryMarkup(markup) {
  photoGalery.innerHTML = markup;
}

function addMarkupToGalery(markup) {
  photoGalery.insertAdjacentHTML('beforeend', markup);
}

// Для повідомлень використовуй бібліотеку notiflix.
Notiflix.Notify.init({
  position: 'center-center',
  width: '50%',
  height: '100px',
  fontSize: '30px',
  timeout: 1500,
  warning: {
    background: '#1facc5',
    position: 'center-center',
  },
  failure: {
    background: '#e90c0c',
  },
});
