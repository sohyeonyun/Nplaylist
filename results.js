// 앞 페이지에서 선택된 옵션들 저장할 배열
let options = [];
let optionNum = 3;
// 전체 노래들에 대해 일치하는 키워드 수를 저장할 배열
let cntSongList = [];
// 선택 태그에 해당하는 노래들만 저장할 배열 (선택태그수, json인덱스)
let tagSongList = [];

function loadItems(fileName) {
  return fetch(`data/${fileName}.json`)
    .then(response => response.json())
    .then(data => data.nctDream);
}

// 전체 노래(items) 중 tagSongList(태그수, 인덱스)의 인덱스 번째에 해당하는 노래만 보여줌.
function displayItems(items) {
  // 총 몇 곡인지 HTML에 수정
  const selected__num = document.querySelector('.selected__num');
  selected__num.innerText = `바탕으로 총 ${tagSongList.length} 곡 선택했어여잉~`;
  // 실제 아이템
  const container = document.querySelector('.itemContainer');
  tagSongList.forEach(tagInfo => {  // (인덱스 해당 노래, 태그수)로 HTML 작성
    container.appendChild(createHTMLItem(items[tagInfo[1]], tagInfo[0]));
  });
}

function createHTMLItem(item, tagCount) {
  const musicItem = document.createElement('div');
  musicItem.setAttribute('class', 'musicItem');
  musicItem.innerHTML = `
    <div class="item">
      <img src="${item.image}" alt="" class="item__thumbnail" />
      <span class="item__description">${item.song}, ${item.artist}, (${tagCount}/${optionNum})</span>
    </div>
  `
  return musicItem;
}

function loadLocalStorage(index) {
  return localStorage.getItem(`item${index}`);
}

function getOptions() {
  optionNum = localStorage.length;
  console.log(`선택한 옵션 개수는? : ${optionNum}`);
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

function getDisplayOptions() {
  // localStorage에 저장된 키워드들 리스트로 가져옴.
  getOptions();
  console.log('options: ', options);

  // 브라우저에 보여줌.
  displayOptions(options);
}
getDisplayOptions();

// 각 노래마다 태그 몇 개씩 해당하는지 확인
function countSongs(item, index) {
  if(item.tags === undefined) {
    return;
  }
  for(let i = 0 ; i < optionNum ; i++) {
    if(item.tags.includes(options[i])) { // 태그 포함하는 노래면 리스트 업데이트
      cntSongList[index] += 1;
    }
  }
}

// 태그 해당하는 노래만 리턴 (노래 인덱스, 태그 개수)
function onlyTagSongs() {
  cntSongList.forEach((tagCount, songIndex) => {
    if(tagCount > 0) {
      tagSongList.push([tagCount, songIndex]);
    }
  });
}

// 선택된 태그들이 들어 있는 노래 찾기
function findTagSongs(items) {
  const jsonNum = items.length;
  cntSongList = new Array(jsonNum).fill(0);
  // 노래(item)마다 반복문 돌림. 선택된 태그 포함하는 노래면 배열 +1 
  items.forEach((item, index) => countSongs(item, index)); 
  console.log(cntSongList);
  // 태그 해당 노래만 (노래 인덱스, 태그수) 리턴
  onlyTagSongs();
  // 태그 개수 기준 내림차순 정렬
  tagSongList.sort((a, b) => b[0] - a[0]);
  console.log("tagSongList : ", tagSongList);
}

// json 데이터 읽어오고, 선택된 키워드에 해당하는 노래는 보여주기
loadItems('nct-dream')  // 파일 이름 해당하는 json 전부 읽어옴.
  .then( items => {
    findTagSongs(items);  // 태그 해당하는 노래 가져옴.
    displayItems(items);  // 찾은 노래 보여줌.
    // setEventListeners(items);
  })
  .catch(console.log);
