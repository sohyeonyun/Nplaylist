const ul = document.querySelector('.pop_rel_keywords');
const searchInput = document.querySelector('.nSearch__input__searchBar');
const relContainer = document.querySelector('.rel_search');
let cache = '';
let JSON_NCT127;
let JSON_NCTDREAM;
let JSON_NCT = [];
let merged = {};
let mergeCnt = 0;
let matchedArray;
let id;

// matchedArray[id]

async function fetchNCT127() {
  return fetch('data/nct127.json')
    .then(response => response.json())
    .then(data => (JSON_NCT127 = data.nct127));
}

async function fetchNCTDREAM() {
  return fetch('data/nctDream.json')
    .then(response => response.json())
    .then(data => (JSON_NCTDREAM = data.nctDream));
}

async function fetchNCTJSON() {
  // 모든 곡들을 합친 객체를 리턴
  JSON_NCT127 = await fetchNCT127();
  JSON_NCTDREAM = await fetchNCTDREAM();
  JSON_NCT127.forEach(song => (merged[mergeCnt++] = song));
  JSON_NCTDREAM.forEach(song => (merged[mergeCnt++] = song));
  return merged;
}

function findMatches(wordToMatch, json) {
  return json.filter(song => {
    const regex = new RegExp(wordToMatch, 'gi');
    return (
      (song.Song && song.Song.match(regex)) ||
      (song.song && song.song.match(regex))
    ); // 태그 수정 후 수정 필요
  });
}

function displayInputValue() {
  matchedArray = findMatches(searchInput.value, JSON_NCT);
  console.log(searchInput.value, matchedArray);

  if (searchInput.value === '' || !matchedArray.length) {
    relContainer.classList.add('hide');
  } else {
    relContainer.classList.remove('hide');
    fillSearch(matchedArray);
  }
}
searchInput.addEventListener('input', displayInputValue);

const fillSearch = suggestArr => {
  ul.innerHTML = '';
  suggestArr.forEach((el, idx) => {
    const song = el.song ? el.song : el.Song; // 태그 수정 필요
    const image = el.image ? el.image : el.Image;
    const artist = el.artist ? el.artist : el.Artist;

    const item = document.createElement('li');
    item.innerHTML = `
      <div class="musicItem" data-id="${idx}">
        <img src="${image}" alt="" class="item__thumbnail" />
        <span class="item__description">${song}, ${artist}</span>
      </div>
    `;
    ul.appendChild(item);
  });
};

function goNextPage(event) {
  let text = '';
  if (event.target.tagName == 'DIV') {
    text = event.path[0].childNodes[3].innerHTML;
    id = event.path[0].getAttribute('data-id');
  } else if (event.target.tagName == 'SPAN' || event.target.tagName == 'IMG') {
    text = event.path[1].childNodes[3].innerHTML;
    id = event.path[1].getAttribute('data-id');
  }
  console.log(JSON.stringify(matchedArray[id]));

  localStorage.clear();
  localStorage.setItem('obj', JSON.stringify(matchedArray[id]));
  location.href = `searchResults.html`;
}
ul.addEventListener('click', goNextPage);

fetchNCTJSON()
  .then(json => (JSON_NCT = Object.values(json)))
  .catch(console.log);
