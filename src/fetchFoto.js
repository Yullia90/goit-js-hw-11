export function fetchFoto() {
  URL = `https://pixabay.com/api/`;
  API_KEY = '33754982-043267dd718d3746dfd898c11';

  //OPTIONS = { q, image_type, orientation, safesearch };
  fetch(
    `URL?key=API_KEY&q&image_type=photo&orientation=horizontal&safesearch=true`
  )
    .then(response => response.json())
    .then(data => console.log(data));
}
