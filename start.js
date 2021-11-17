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
let currentIndex = -1; // 현재 키보드가 가리키고 있는 li 태그의 인덱스

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
    const regex = new RegExp('^' + wordToMatch, 'gi'); // '^' : 해당 문자로 시작하는 문자열만 탐색 -> 무한적아 같은거 못함
    return song.title.match(regex);
    // (
    //   (song.Song && song.Song.match(regex)) ||
    //   (song.song && song.song.match(regex))
    // ); // 태그 수정 후 수정 필요
  });
}

function displayInputValue() {
  matchedArray = findMatches(searchInput.value, JSON_NCT);
  currentIndex = -1;

  if (searchInput.value === '' || !matchedArray.length) {
    matchedArray = [];
    relContainer.classList.add('hide');
  } else {
    relContainer.classList.remove('hide');
    fillSearch(matchedArray);
    console.log(searchInput.value, matchedArray);
  }
}
searchInput.addEventListener('input', displayInputValue);

function createHTMLItem(idx, title, image, artist) {
  const item = document.createElement('li');
  item.innerHTML = `
    <div class="musicItem" data-id="${idx}">
      <img src="${image}" alt="thumbnail" class="item__thumbnail" />
      <div class="item__right" />
        <div class="item__right__title">${title}</div>
        <div class="item__right__artist">${artist}</div>
      </div>
    </div>
  `;
  return item;
}

function fillSearch(suggestArr) {
  ul.innerHTML = '';
  suggestArr.forEach((el, idx) => {
    const title = el.title;
    const image = el.image;
    const artist = el.artist;
    const item = createHTMLItem(idx, title, image, artist);
    ul.appendChild(item);
  });
}

function saveLocalStorage(key, item) {
  localStorage.clear();
  localStorage.setItem(key, item);
}

function saveAndGoToNext(event) {
  id =
    event.path[1].getAttribute('data-id') ||
    event.path[2].getAttribute('data-id');
  console.log(id, JSON.stringify(matchedArray[id]));

  saveLocalStorage('obj', JSON.stringify(matchedArray[id]));
  location.href = `searchResults.html`;
}
ul.addEventListener('click', saveAndGoToNext);

function handleKeyDown(e) {
  if (!ul.childNodes[0]) {
    // 검색 안했을 경우 종료
    return;
  }
  switch (e.keyCode) {
    case 38: //up
      if (currentIndex <= -1) break;
      ul.childNodes[currentIndex--].classList.remove('pressed');
      if (currentIndex == -1) return;
      ul.childNodes[currentIndex].classList.add('pressed');
      break;
    case 40: // down
      if (currentIndex >= matchedArray.length - 1) break;
      currentIndex++;
      if (currentIndex > 0)
        ul.childNodes[currentIndex - 1].classList.remove('pressed');
      ul.childNodes[currentIndex].classList.add('pressed');
      break;
    case 13: // enter
      if (currentIndex <= -1) break;
      id = e.path[1].nextSibling.nextElementSibling.children[0]
        .querySelector('.pressed .musicItem')
        .getAttribute('data-id');
      saveLocalStorage('obj', JSON.stringify(matchedArray[id]));
      location.href = `searchResults.html`;
    default:
      return;
  }
}
window.addEventListener('keydown', handleKeyDown);

fetchNCTJSON()
  .then(json => (JSON_NCT = Object.values(json)))
  .catch(console.log);
