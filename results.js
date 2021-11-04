/*
  선택된 태그들에 해당하는 노래 검색해서 보여주기
  1. json 에서 데이터 가져오기
  2. 선택된 태그들 localStorage에서 가져오기
  3. 태그 우선 순위 부여하기 ( 그룹별 -> 콘서트 버전 )
  4. 태그 해당하는 노래 찾기
  5. 찾은 노래들 보여주기
*/

let JSON_NCT = {};
let JSON_NCT127, JSON_NCTDREAM;
let tagCount;
let groupTagCnt = 0;
let concertTagCnt = 0;
let tags = [];
let unusedTags = [];
let songs = [];
let songsCnt;
const LP = document.querySelector('.LP__black');
const song0 = document.querySelector('.song0');
const song1 = document.querySelector('.song1');
const song2 = document.querySelector('.song2');
const song3 = document.querySelector('.song3');
const song4 = document.querySelector('.song4');
const song5 = document.querySelector('.song5');
const song6 = document.querySelector('.song6');

// 1. json 에서 데이터 가져오기
function fetchNCT127() {
  return fetch('data/nct127.json')
    .then(response => response.json())
    .then(data => (JSON_NCT127 = data.nct127));
}

function fetchNCTDREAM() {
  return fetch('data/nctDream.json')
    .then(response => response.json())
    .then(data => (JSON_NCTDREAM = data.nctDream));
}

// 2. 선택된 태그들 localStorage에서 가져오기
function loadLocalStorage(index) {
  return localStorage.getItem(`item${index}`);
}

function loadTags() {
  tagCount = localStorage.length;
  console.log(`[loadTags] 선택한 태그 개수는 : ${tagCount} 개`); // for debug
  for (let i = 0; i < tagCount; i++) {
    const tag = loadLocalStorage(i);
    tag && tags.push(tag);
  }
  console.log(`[loadTags] 선택한 태그들은 : ${tags}`); // for debug
  unusedTags = tags;
}

function displayTags() {
  // const container = document.querySelector('.selected');
  // container.innerHTML = tags.map(tag => `<li>${tag}</li>`).join('');
  const selected__keywords = document.querySelector('.selected__keywords');
  selected__keywords.innerHTML = tags.map(tag => `#${tag} `).join('') + '에';
}

loadTags();
displayTags();

// 3. 태그 우선 순위 부여하기 ( 그룹별 -> 콘서트 버전 )
/*
    (목적) 그룹별이나 콘서트 버전 태그를 선택했을 시, 이 태그들에 해당하는 노래 정보만 다음 단계로 넘김.
    1) 그룹 태그 선택이 있을 경우 (중복 가능), 
    기존에 합쳐 놓았던 노래 목록을 모두 버리고 그룹별 JSON 변수를 이용해 새로 정의한 JSON 변수에 선택된 그룹 곡만 넣음.
    2) 콘서트 태그 선택이 있을 경우,
    앞에서 넘어온 JSON 변수 (그룹 태그 선택했든 안했든) 에 콘서트 태그 있는 곡만 남김.
*/
async function mergeJsonObjects() {
  // 모든 곡들을 합친 객체를 리턴
  let merged = {};
  let mergeCnt = 0;
  JSON_NCT127.forEach(song => (merged[mergeCnt++] = song));
  JSON_NCTDREAM.forEach(song => (merged[mergeCnt++] = song));
  return merged;
}

async function isGroupInTag() {
  const groupTag = [
    'NCT127',
    'NCTDREAM',
    'WayV',
    'NCTU',
    'OST',
    'SMSTATION',
    'FEATURING',
    'SPECIAL',
  ];
  groupTagCnt = tags.filter(tag => groupTag.includes(tag)).length;
  return groupTagCnt ? true : false;
}

async function isConcertInTag() {
  const concertTag = '방구석콘서트';
  return tags.includes(concertTag);
}

async function WhichGroup() {
  const groupTag = [
    'NCT127',
    'NCTDREAM',
    'WayV',
    'NCTU',
    'OST',
    'SMSTATION',
    'FEATURING',
    'SPECIAL',
  ];
  return tags.filter(tag => groupTag.includes(tag));
}

function remainingTag(used) {
  // 우선순위 처리되고 남은 태그들
  unusedTags = unusedTags.filter(x => !used.includes(x));
}

async function findGroupSongs(songs) {
  // 그룹 태그가 있는 상황,,
  const taggedGroups = await WhichGroup();
  console.log(`[findGroupSongs] : 선택된 그룹들 - ${taggedGroups}...`);
  remainingTag(taggedGroups);

  let groupSongs = {}; // assign을 할 경우, 인덱스가 자동 저장되어 합쳐질 때 중복되는 키의 노래가 덮혀지는 문제가 생겨 배열마다 담아주는 방식을 택함.
  let songCnt = 0;
  if (taggedGroups.includes('NCT127')) {
    JSON_NCT127.forEach(song => (groupSongs[songCnt++] = song));
  }
  if (taggedGroups.includes('NCTDREAM')) {
    JSON_NCTDREAM.forEach(song => (groupSongs[songCnt++] = song));
  }
  if (!Object.keys(groupSongs).length) {
    console.log(
      `[findGroupSongs] : 선택된 그룹의 노래 없음. 전체 대상에서 탐색`
    );
    return songs;
  }
  return groupSongs;
}

async function findConcertSongs(songs) {
  concertTagCnt = 1;
  console.log(`[findConcertSongs] 콘서트 태그가 선택되었습니다.`); // for debug
  remainingTag(['방구석콘서트']);
  let concertSongs = {};
  let cnt = 0;
  for (let i in songs) {
    if (songs[i].tags && songs[i].tags.includes('방구석콘서트')) {
      concertSongs[cnt++] = songs[i];
    }
  }
  return concertSongs;
}

async function removeConcertSongs(songs) {
  console.log(`[removeConcertSongs] : 콘서트 태그가 선택되지 않아 제거합니다.`);
  let notConcertSongs = {};
  let cnt = 0;
  for (let i in songs) {
    if (songs[i].tags && !songs[i].tags.includes('방구석콘서트')) {
      notConcertSongs[cnt++] = songs[i];
    }
  }
  return notConcertSongs;
}

async function givePriority() {
  let songs;
  songs = await mergeJsonObjects();
  (await isGroupInTag()) && (songs = await findGroupSongs(songs));
  (await isConcertInTag())
    ? (songs = await findConcertSongs(songs))
    : (songs = await removeConcertSongs(songs));
  return songs;
}

// 4. 태그 해당하는 노래 찾기
/*
    (목표) 선택된 태그 해당하는 노래들을 리턴
    1) 앞서 우선순위 부여를 위해 처리했던 태그들(그룹별, 콘서트)은 제외하고 남은 태그인 unusedTags에서 처리함.
    2) 태그 해당 노래들의 index, 그리고 몇 개의 태그에 해당하는지 cnt를 계산
    3) 노래, 태그 개수 리턴
*/
function objSort(obj) {
  return Object.assign(
    {},
    Object.values(obj).sort((a, b) => b.tagCnt - a.tagCnt)
  );
}

function findTaggedSongs(songs) {
  let results = [];
  let cnt = 0;

  // 콘서트 태그 -> 태그 1개 혹은 그룹별까지만 태그 2개뿐
  if (concertTagCnt) {
    groupTagCnt ? (cnt = 2) : (cnt = 1);
    for (let i in songs) {
      songs[i].tagCnt = cnt;
    }
    return songs;
  }

  // 그룹별 태그 -> 들어오는 노래 전부 돌려줌. (1 + 해당 태그 수)
  if (groupTagCnt) {
    for (let i in songs) {
      songs[i].tagCnt = 1;
      unusedTags.forEach(tag => {
        songs[i].tags.includes(tag) && songs[i].tagCnt++;
      });
    }
    return objSort(songs);
  }

  // 그룹 ㄴ, 콘서트 ㄴ -> 들어오는 노래들 중 태그 걸리는 것만 돌려줌.
  for (let i in songs) {
    cnt = 0;
    unusedTags.forEach(tag => {
      songs[i].tags.includes(tag) && cnt++;
    });
    cnt && (songs[i].tagCnt = cnt) && results.push(songs[i]);
  }
  return objSort(results);
}

// 5. 찾은 노래들 보여주기
// json 수정 후 수정 필요
function createHTMLItem(song) {
  if (Object.keys(song).length === 0) {
    return '';
  }
  const title = song.song ? song.song : song.Song; // 태그 수정 필요
  const image = song.image ? song.image : song.Image;
  const artist = song.artist ? song.artist : song.Artist;
  const album = song.album ? song.album : song.Album;

  const HTMLtext = `
          <img class="image" src="${image}"></img>
          <div class="description">
            <div class="title">${title}</div>
            <div class="artist">${artist}</div>
            <div class="album">${album}</div>
          </div>
  `;
  //${tagCnt}/${tags.length}
  return HTMLtext;
}

function displaySongs(songs) {
  const selected__num = document.querySelector('.selected__num');
  selected__num.innerText = `적합한 ${
    Object.keys(songs).length
  }개의 곡을 추천합니다`;

  // const container = document.querySelector('.itemContainer');
  // Object.values(songs).forEach(song => {
  //   container.appendChild(createHTMLItem(song, song.tagCnt));
  // });
  return songs;
}

function allocateSongs(completed_songs) {
  songs = Object.values(completed_songs);
  songsCnt = Object.keys(songs).length;

  songs.unshift({}, {}, {});
  songs.push({}, {}, {});
  console.log(songsCnt, songs);
}

function initLP() {
  // LP판 초기화
  song3.innerHTML = createHTMLItem(songs[3]);
  song4.innerHTML = createHTMLItem(songs[4]);
  song5.innerHTML = createHTMLItem(songs[5]);
  song6.innerHTML = createHTMLItem(songs[6]);
}

// 함수 호출
fetchNCT127()
  .then(fetchNCTDREAM)
  .then(givePriority)
  .then(songs => findTaggedSongs(songs))
  // .then(songs => console.log(`[Completed Tagging] : ${JSON.stringify(songs)}`))
  .then(songs => displaySongs(songs))
  .then(songs => allocateSongs(songs))
  .then(songs => initLP())
  .catch(console.log);

// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------
// ---------------------------------------------

let centerSongIdx = 3; // LP판 중앙에 올 노래 인덱스

song6.addEventListener('animationend', () => {
  let active_in = song6.classList.contains('active_in');
  let active_out = song6.classList.contains('active_out');
  active_in && getVisualSongsForIn() && toggleActiveIn();
  active_out && getVisualSongsForOut() && toggleActiveOut();

  console.log('animation ended');
});

song6.addEventListener('animationcancel', () => {
  let active_in = song6.classList.contains('active_in');
  let active_out = song6.classList.contains('active_out');
  active_in && getVisualSongsForIn() && toggleActiveIn();
  active_out && getVisualSongsForOut() && toggleActiveOut();

  console.log('animation canceled');
});

function getVisualSongsForIn() {
  centerSongIdx--;
  song0.innerHTML = createHTMLItem(songs[centerSongIdx - 3]);
  song1.innerHTML = createHTMLItem(songs[centerSongIdx - 2]);
  song2.innerHTML = createHTMLItem(songs[centerSongIdx - 1]);
  song3.innerHTML = createHTMLItem(songs[centerSongIdx]);
  song4.innerHTML = createHTMLItem(songs[centerSongIdx + 1]);
  song5.innerHTML = createHTMLItem(songs[centerSongIdx + 2]);
  song6.innerHTML = createHTMLItem(songs[centerSongIdx + 3]);
  return true;
}

function getVisualSongsForOut() {
  centerSongIdx++;
  song0.innerHTML = createHTMLItem(songs[centerSongIdx - 3]);
  song1.innerHTML = createHTMLItem(songs[centerSongIdx - 2]);
  song2.innerHTML = createHTMLItem(songs[centerSongIdx - 1]);
  song3.innerHTML = createHTMLItem(songs[centerSongIdx]);
  song4.innerHTML = createHTMLItem(songs[centerSongIdx + 1]);
  song5.innerHTML = createHTMLItem(songs[centerSongIdx + 2]);
  song6.innerHTML = createHTMLItem(songs[centerSongIdx + 3]);
  return true;
}

function toggleActiveIn() {
  song0.classList.toggle('active_in');
  song1.classList.toggle('active_in');
  song2.classList.toggle('active_in');
  song3.classList.toggle('active_in');
  song4.classList.toggle('active_in');
  song5.classList.toggle('active_in');
  song6.classList.toggle('active_in');
}

function toggleActiveOut() {
  song0.classList.toggle('active_out');
  song1.classList.toggle('active_out');
  song2.classList.toggle('active_out');
  song3.classList.toggle('active_out');
  song4.classList.toggle('active_out');
  song5.classList.toggle('active_out');
  song6.classList.toggle('active_out');
}

let cnt = 0;
function zoom(event) {
  cnt++;
  if (cnt % 20 == 0) {
    console.log(cnt, event.deltaY);
    if (event.deltaY < 0) {
      console.log('In');
      centerSongIdx > 3 &&
        !song6.classList.contains('active_in') &&
        !song6.classList.contains('active_out') &&
        toggleActiveIn();
    } else {
      console.log('Out');
      centerSongIdx < songs.length - 4 &&
        !song6.classList.contains('active_in') &&
        !song6.classList.contains('active_out') &&
        toggleActiveOut();
    }
  }
}
document.onwheel = zoom;
