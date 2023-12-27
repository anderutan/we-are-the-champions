import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';

const appSettings = {
  databaseURL:
    'https://we-are-the-champion-b0a14-default-rtdb.asia-southeast1.firebasedatabase.app/',
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsListInDB = ref(database, 'endorsements');

const inputEl = document.querySelector('#input-section');
const fromEl = document.querySelector('#from');
const toEl = document.querySelector('#to');
const btn = document.querySelector('.publish-btn');
const commentSection = document.querySelector('.comment-section');

// Push data as object to firebase
btn.addEventListener('click', () => {
  let inputValue = inputEl.value;
  let fromValue = fromEl.value;
  let toValue = toEl.value;

  let comment = { inputValue, fromValue, toValue };
  push(endorsementsListInDB, comment);

  clearInputEl();
  clearFromEl();
  clearToEl();
});

function clearInputEl() {
  inputEl.value = '';
}

function clearFromEl() {
  fromEl.value = '';
}

function clearToEl() {
  toEl.value = '';
}

//retrieve data from firebase and display under endorsements
onValue(endorsementsListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let commentArray = Object.entries(snapshot.val());

    clearEndorsementList();

    for (let i = commentArray.length - 1; i >= 0; i--) {
      let currentComment = commentArray[i];
      appendCommentToDiv(currentComment);
    }
  } else {
    commentSection.textContent = 'No comment showed...';
  }
});

function clearEndorsementList() {
  commentSection.innerHTML = '';
}

//append comment into .comment div
// Example
/* <div class="comment">
      <p class="bolder">To Leanne</p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt,
        laboriosam. Aliquid illo eligendi alias itaque aperiam! Voluptatem
        odit corrupti itaque ad possimus sapiente asperiores ipsa.
      </p>
      <div class="comment-footer">
        <p class="bolder from-comment">From Frode</p>
        <p class="emoji">❤️ 1</p>
      </div>
    </div> */
function appendCommentToDiv(item) {
  let itemToValue = item[1].toValue;
  let itemFromValue = item[1].fromValue;
  let itemInputValue = item[1].inputValue;

  let commentDiv = document.createElement('div');
  let toPara = document.createElement('p');
  let fromPara = document.createElement('p');
  let inputPara = document.createElement('p');
  let emojiButton = document.createElement('p');
  let footDiv = document.createElement('div');

  //To paragraph
  toPara.classList.add('bolder');
  toPara.textContent = itemToValue;

  //Input paragraph
  inputPara.textContent = itemInputValue;

  //Foot Div
  footDiv.classList.add('comment-footer');
  fromPara.classList.add('bolder', 'from-comment');
  fromPara.textContent = itemFromValue;

  //emoji count
  emojiButton.classList.add('emoji');
  let emojiCount = localStorage.getItem(item[0]) || 0;
  emojiButton.textContent = `❤️ ${emojiCount}`;
  emojiButton.addEventListener('click', function () {
    emojiCount++;
    emojiButton.textContent = `❤️ ${emojiCount}`;
    localStorage.setItem(item[0], emojiCount);
  });

  footDiv.appendChild(fromPara);
  footDiv.appendChild(emojiButton);

  commentDiv.classList.add('comment');
  commentDiv.appendChild(toPara);
  commentDiv.appendChild(inputPara);
  commentDiv.appendChild(footDiv);

  commentSection.appendChild(commentDiv);
}
