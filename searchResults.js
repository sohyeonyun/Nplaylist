const results = document.querySelector('.results__content');
const item = document.querySelector('.results__content');

function createHTMLItem(data) {
  const title = data.song ? data.song : data.Song; // 태그 수정 필요
  const image = data.image ? data.image : data.Image;
  const artist = data.artist ? data.artist : data.Artist;

  item.innerHTML = `
        <div class="musicItem">
          <img src="${image}" alt="" class="item__thumbnail" />
          <span class="item__description">${title}, ${artist}</span>
        </div>
  `;
}

function loadLocalStorage() {
  // get data from localStorage
  const data = JSON.parse(localStorage.getItem('obj'));
  console.log(data);
  createHTMLItem(data);
}

loadLocalStorage();
