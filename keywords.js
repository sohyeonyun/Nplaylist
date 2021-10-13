'use strict';

const types = [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]];
const keywords = [
  ['봄노래', '여름노래', '가을노래', '겨울노래', '새벽 감성', '비 올 때', '해가 쨍쨍', '공부', '노동요', '드라이브', '산책', '이별', '사랑', '등교, 출근길', '여행'],
  ['감성자극', '기분전환', '내적댄스', '스트레스 아웃', '자신감뿜뿜', '위로가 필요할 때', '혼자 있고 싶을 때', '흥이 날 때', '전투력 상승', '누군가 그리울 때', '하루를 되돌아보며', '지친하루', '나만 알기 아까운'],
  ['청량', '마라', '네오', '섹시', '달달', '힙합', '몽환', '잔잔한', '발라드', '신나는', '댄스곡'],
  ['NCT 127',  'NCT DREAM',  'WayV', 'NCT U', 'OST', 'SM STATION', 'FEATURING', 'SPECIAL']
];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
}

// 실시간 추천 조합 - random
function realtimeRecomm() {
  const recomm1 = document.querySelector('.realtimeRecomm__right__1');
  const recomm2 = document.querySelector('.realtimeRecomm__right__2');

  // situations, feelings, moods, groups 중 두 개 선택
  const typeNum = getRandomInt(0, types.length); 
  const type1 = types[typeNum][0];
  const type2 = types[typeNum][1];

  // keywords 두 개 조합
  const keyword1 = getRandomInt(0, keywords[type1].length);
  const keyword2 = getRandomInt(0, keywords[type2].length);
  recomm1.innerText = keywords[type1][keyword1];
  recomm2.innerText = keywords[type2][keyword2];
}
realtimeRecomm();

// 키워드 선택 시, goNext Btn 위로 올라오게
const keywordLines = document.querySelectorAll('.keywords__line2');
const goNextBtn = document.querySelector('#goNext');
let selectedBtnNum = 0;
keywordLines.forEach( keywordLine => {
  keywordLine.addEventListener('click', (event) => {
    // console.log(event.target.parentElement.parentNode);
    // console.log(event.target);
    // 버블링 방지
    if(event.target === event.currentTarget) {
      return;
    }
    if(event.target.tagName == 'DIV' & !event.target.classList.contains('selected')) { // 선택 안되어있다.
      // 최대 3개 선택 가능
      if(selectedBtnNum === 3) {
        // 나머지 태그 하얘지게 - border, color
        return;
      }
      selectedBtnNum++;
      event.target.classList.add('selected');
      // 버튼 색상, 위치 변경
      event.target.style.background = 'var(--color-nct-neon)';
      event.target.style.color = 'midnightblue';
      goNextBtn.style.bottom = '-5%';

    } else if (event.target.tagName == 'DIV' & event.target.classList.contains('selected')) { // 선택 되어있다.
      selectedBtnNum--;
      event.target.classList.remove('selected');
      // 버튼 색상 변경
      event.target.style.background = 'white';
      event.target.style.color = 'var(--color-nct-dark-green)';
      // 선택된 키워드 하나도 없으면 버튼 내림.
      if( selectedBtnNum == 0){
        goNextBtn.style.bottom = '-10%';
      }
    }
  });
})

// 토글 버튼 클릭 시, 키워드 리스트 보이도록
const selectedLines = document.querySelectorAll('.keywords__line1');
selectedLines.forEach(selectedLine => {
  selectedLine.addEventListener('click', (event) => {
    const toggleBtn = selectedLine.querySelector('.fas');
    const hiddenClass = event.path[2].querySelector('.keywords__line2');

    if(hiddenClass.classList.contains('invisible')) {
      // 키워드 편다.
      hiddenClass.classList.remove('invisible');
      toggleBtn.classList.replace('fa-chevron-circle-down', 'fa-chevron-circle-up');
      toggleBtn.style.opacity = '0.6';
    } else {
      // 키워드 접는다.
      hiddenClass.classList.add('invisible');
      toggleBtn.classList.replace('fa-chevron-circle-up', 'fa-chevron-circle-down');
      toggleBtn.style.opacity = '1';
    }
  });
})


// 만들어주세요 버튼 클릭 시, 선택한 키워드 localStorage에 저장
const goNext = document.querySelector('#goNext');
const keyword = document.querySelectorAll('.keyword');
goNext.addEventListener('click', (event) => {
  if(selectedBtnNum == 0) {
    return;
  }
  // 선택된 키워드
  const selected = document.querySelectorAll('.keyword.selected');
  // for debug!
  selected.forEach((item, index) => {
    console.log(`item${index}: ${item.textContent}`);
  });

  localStorage.clear();
  selected.forEach((item, index) => localStorage.setItem(`item${index}`, item.textContent));
  location.href="results.html";
})