// 앞 페이지에서 선택된 옵션들 저장할 배열
let options = [];
const optionNum = 3;

function loadItems() {
  return fetch('data/nct-dream.json')
    .then(response => response.json())
    .then(data => data.nctDream);
}

function displayItems(items) {
  const container = document.querySelector('.items');
  container.innerHTML = items.map(item => createHTMLString(item)).join('');
}

function createHTMLString(item) {
  return `
    <div class="item">
      <img src="${item.image}" alt="" class="item__thumbnail" />
      <span class="item__description">${item.song}, ${item.artist}</span>
    </div>
    `;
}

function loadLocalStorage(index) {
  return localStorage.getItem(`item${index}`);
}

function getOptions() {
  for(let i = 0; i < optionNum; i++) {
    const item = loadLocalStorage(i);
    if(item) {
      options.push(item);
    }
  }
  return;
}

function displayOptions(items) {
  const container = document.querySelector('.selected');
  container.innerHTML = items.map(item => `<li>${item}</li>`).join('');
}

function showOptions() {
  // localStorage에 저장된 키워드들 리스트로 가져옴.
  getOptions();
  console.log('options: ', options);

  // 브라우저에 보여줌.
  displayOptions(options);
}
showOptions();

function countSongs(item) {
  console.log(item.tags);
  // if(options[0] in item.tags)
}

// 선택된 태그들이 들어 있는 노래 찾기
function findSongs(items) {
  const dreamNum = items.length;
  let cntSongList = new Array(dreamNum).fill(0);
  // 노래 기준 반복문, 선택된 태그 포함하는 노래면 배열 +1 
  items.forEach(item => countSongs(item)); 
}

// json 데이터 읽어오고, 선택된 키워드에 해당하는 노래는 보여주기
loadItems()
  .then( items => {
    console.log('items: ', items);
    findSongs(items);
    displayItems(items);
    // setEventListeners(items);
  })
  .catch(console.log);
