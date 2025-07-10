'use strict';

// デフォルトで表示される項目
const defaultItems = [
  { name: "シャンプー", quantity: 1 },
  { name: "リンス", quantity: 1 },
  { name: "ボディソープ", quantity: 1 },
  { name: "食器洗剤", quantity: 1 },
  { name: "洗濯用洗剤", quantity: 1 },
  { name: "柔軟剤", quantity: 1 },
  { name: "ティッシュ", quantity: 1 },
  { name: "ウェットティッシュ", quantity: 1 },
  { name: "トイレットペーパー", quantity: 1 }
];

let items = [];
let isEditing = false; // 編集モードの状態を管理
let dragSrcIndex = null;

// データ読み込み
function loadItems() {
  const stored = localStorage.getItem("stockItems");
  items = stored ? JSON.parse(stored) : [...defaultItems];
  renderItems();
}

// 保存
function saveItems() {
  localStorage.setItem("stockItems", JSON.stringify(items));
}

// 画面にアイテム一覧を表示
function renderItems() {
  const list = document.getElementById("item-list");
  list.innerHTML = "";

  items.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "item";
    div.draggable = isEditing;

    //並び替えハンドル
    if (isEditing) {
      const handle = document.createElement("div");
      handle.className = "drag-handle";
      div.appendChild(handle);
    }


    //ドラッグ開始
    div.addEventListener("dragstart", () => {
      dragSrcIndex = index;
      div.classList.add("dragging");
    });

    //ドラッグ終了
    div.addEventListener("dragend", () => {
      div.classList.remove("dragging");
    });




    div.addEventListener("dragover", (e) => e.preventDefault());
    div.addEventListener("drop", () => {
      if (dragSrcIndex === null || dragSrcIndex === index) return;
      const draggedItem = items[dragSrcIndex];
      items.splice(dragSrcIndex, 1);
      items.splice(index, 0, draggedItem);
      dragSrcIndex = null;
      saveItems();
      renderItems();
    });
    // 名前とボタン追加
    const name = document.createElement("div");
    name.className = "item-name";
    name.textContent = `${item.name} : ${item.quantity}`;

    const controls = document.createElement("div");
    controls.className = "item-controls";

    // ±/-/ボタン
    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.onclick = () => {
      item.quantity++;
      saveItems();
      renderItems();
    };

    const minus = document.createElement("button");
    minus.textContent = "-";
    minus.onclick = () => {
      if (item.quantity > 0) item.quantity--;
      saveItems();
      renderItems();
    };

    const del = document.createElement("button");
    del.textContent = "削除";
    del.onclick = () => {
      items.splice(index, 1);
      saveItems();
      renderItems();
    };

    controls.appendChild(plus);
    controls.appendChild(minus);

    if (isEditing) {
      controls.appendChild(del); // 編集モード中だけ削除ボタンを表示
    }

    div.appendChild(name);
    div.appendChild(controls);
    list.appendChild(div);
  });
}

// アイテムを追加
function addItem() {
  const nameInput = document.getElementById("item-name");
  const quantityInput = document.getElementById("item-quantity");

  const name = nameInput.value.trim();
  const quantity = parseInt(quantityInput.value);

  if (!name || isNaN(quantity) || quantity < 1) {
    alert("正しい商品名と数量を入力してください");
    return;
  }

  items.push({ name, quantity });
  saveItems();
  renderItems();

  nameInput.value = "";
  quantityInput.value = "";
}

// 編集ボタンをクリックしたときの処理
document.getElementById("edit-toggle").addEventListener("click", () => {
  isEditing = !isEditing;
  document.getElementById("edit-toggle").textContent = isEditing ? "完了" : "編集";
  document.getElementById("add-form").style.display = isEditing ? "flex" : "none";
  renderItems();
});

// 初期化
loadItems();
