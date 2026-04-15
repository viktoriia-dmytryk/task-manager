const refs = {
  inputTask: document.querySelector('.task-input'),
  formTask: document.querySelector('.controls-form'),
  listTask: document.querySelector('.list'),
  addBtnTask: document.querySelector('.add'),
  removeBtn: document.querySelector('.remove-btn'),
};

refs.formTask.addEventListener('submit', onAddBtnTaskSubmit);
refs.listTask.addEventListener('change', onListTaskClick);
refs.removeBtn.addEventListener('click', onRemoveBtnClick);
refs.listTask.addEventListener('click', onListTaskClickDelete);
function onAddBtnTaskSubmit(event) {
  event.preventDefault();
  const inputText = refs.inputTask.value.trim();
  if (!inputText) {
    return;
  }
  const liText = `<li class="list-item">
                <label class="task-label">
                <input class="check visually-hidden" type="checkbox" />
                <span class="checkbox-span">⬜</span>
                <span class="task-text">${inputText}</span></label>
                <p class="remove-smile">✖️</p>
            </li>`;

  refs.listTask.insertAdjacentHTML('beforeend', liText);
  refs.removeBtn.classList.remove('btn-display-none');
  refs.formTask.reset();
}

function onListTaskClick(event) {
  const label = event.target.closest('.task-label');
  const checkboxSpan = label.querySelector('.checkbox-span');
  const text = label.querySelector('.task-text');

  if (event.target.checked) {
    checkboxSpan.textContent = '☑️';
    text.classList.add('strikethrough');
  } else {
    checkboxSpan.textContent = '⬜';
    text.classList.remove('strikethrough');
  }
}

function onRemoveBtnClick(event) {
  if (!confirm('Бажаєте стерти весь список справ?')) {
    return;
  }
  const allLi = document.querySelectorAll('.list-item');
  allLi.forEach(li => li.remove());
  refs.removeBtn.classList.add('btn-display-none');
}

function onListTaskClickDelete(event) {
  if (event.target.nodeName !== 'P') {
    return;
  }
  if (confirm('Бажаєте видалити це завдання?')) {
    event.target.closest('.list-item').remove();
  }
  if (refs.listTask.children.length === 0) {
    refs.removeBtn.classList.add('btn-display-none');
  }
}
