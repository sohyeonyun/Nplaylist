function fetchNoUid() {
  return fetch('wayV.json')
    .then(res => res.json())
    .then(data => data.wayV);
}

function fetchHaveUid() {
  return fetch('new.json')
    .then(res => res.json())
    .then(data => data.wayV);
}

// have -> no
async function changeJson() {
  const noUids = await fetchNoUid();
  const haveUids = await fetchHaveUid();
  var flag = false;
  var cnt = 0;

  haveUids.forEach(haveUid => {
    flag = false;
    noUids.forEach(noUid => {
      if (noUid.title == haveUid.title && noUid.album == haveUid.album) {
        cnt++;
        noUid['uid']['melon'] = haveUid['uid']['melon'];
        flag = true;
      }
    });

    if (flag == false) {
      console.log('같은게읍다', haveUid.title, haveUid.album);
    }
  });

  console.log(noUids);
  console.log(cnt, noUids.length, haveUids.length);
  console.log(JSON.stringify(noUids));
}

changeJson();
