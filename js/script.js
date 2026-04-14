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
function onAddBtnTaskSubmit(event) {
  event.preventDefault();
  const inputText = refs.inputTask.value.trim();
  if (!inputText) {
    return;
  }
  const liText = `<li class="list-item">
                <label class="task-label">
                <input class="check" type="checkbox" />
                <span class="task-text">${inputText}</span></label>
                
            </li>`;

  refs.listTask.insertAdjacentHTML('beforeend', liText);
  refs.removeBtn.classList.remove('btn-display-none');
  refs.formTask.reset();
}

function onListTaskClick(event) {
  if (event.target.checked) {
    event.target.closest('.task-label').classList.add('strikethrough');
  } else {
    event.target.closest('.task-label').classList.remove('strikethrough');
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
