// ポップアップのセッティング処理、新規タスク
function popupSetting(){
  let popup = document.getElementById('popup');
  if(!popup) return;

  let bgBlack = document.getElementById('bg-black');
  let closeBtn = document.getElementById('close-btn');
  let showBtn = document.getElementById('taskAddBtn');

  // ポップアップ
  popUp(bgBlack);
  popUp(closeBtn);
  popUp(showBtn);

  // ポップアップ処理
  function popUp(elem){
    if(!elem) return;
  
    elem.addEventListener('click', function(){
      popup.classList.toggle('is-show');
    });
  }
}

// 既存のタスク
function popupSetting2(){
  let popup = document.getElementById('popup');
  if(!popup) return;

  let bgBlack = document.getElementById('bg-black');
  let closeBtn = document.getElementById('close-btn');
  let showBtn = document.getElementById('taskEditBtn');

  // ポップアップ
  popUp(bgBlack);
  popUp(closeBtn);
  popUp(showBtn);

  // ポップアップ処理
  function popUp(elem){
    if(!elem) return;
  
    elem.addEventListener('click', function(){
      popup.classList.toggle('is-show');
    });
  }
}


// ポップアップのセッティング
popupSetting();