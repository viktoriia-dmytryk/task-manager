//* коментарі на випадок, якщо хтось тут таки полізе в код)

//* отут зібрала всі елементи, до яких треба доступ
const refs = {
  inputTask: document.querySelector('.task-input'),
  formTask: document.querySelector('.controls-form'),
  listTask: document.querySelector('.list'),
  addBtnTask: document.querySelector('.add'),
  removeBtn: document.querySelector('.remove-btn'),
  container: document.querySelector('.container'),
  saveBtn: document.querySelector('.save-btn'),
};

// *це штука з бібліотеки з сортуванням, робить лі-шки здатними перетягуватись між собою
const sortable = Sortable.create(refs.listTask, {
  animation: 250,
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)',

  ghostClass: 'sortable-ghost',
  chosenClass: 'sortable-chosen',
  dragClass: 'sortable-drag',
});

// *тут-от всі слухачі вписала, щоб далеко не ходить
refs.formTask.addEventListener('submit', onAddBtnTaskSubmit);
refs.listTask.addEventListener('change', onListTaskClick);
refs.removeBtn.addEventListener('click', onRemoveBtnClick);
refs.listTask.addEventListener('click', onListTaskClickDelete);
refs.listTask.addEventListener('click', onListEdit);
refs.saveBtn.addEventListener('click', onSaveBtn);
refs.inputTask.addEventListener('input', onSaveInput);

// *отут збереження поля введення
const savedInput = localStorage.getItem('saveInput');
if (savedInput) {
  refs.inputTask.value = savedInput;
}
function onSaveInput(event) {
  localStorage.setItem('saveInput', event.target.value);
}
// *  отут лежить все, до чого треба для збереження тасків
const savedTask = localStorage.getItem('saveTask');

if (savedTask) {
  refs.listTask.innerHTML = savedTask;
  refs.removeBtn.classList.remove('btn-display-none');
  refs.saveBtn.classList.remove('btn-display-none');
}

function onSaveBtn(event) {
  localStorage.setItem('saveTask', refs.listTask.innerHTML);
  if (refs.listTask.children.length === 0) {
    refs.saveBtn.classList.add('btn-display-none');
  }
}

// *це функція події кнопки форми, додає вписаний текст в лі-шку і виводить на сторінку
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
                <span class="task-text"></span></label>

                <button class="edit-btn" type="button">✒️</button>
                <button class="remove-smile" type="button">✖️</button>
            </li>`;

  refs.listTask.insertAdjacentHTML('beforeend', liText);

  const lastItem = refs.listTask.lastElementChild;

  lastItem.querySelector('.task-text').textContent = inputText;
  refs.saveBtn.classList.remove('btn-display-none');
  refs.removeBtn.classList.remove('btn-display-none');

  refs.formTask.reset();
  localStorage.removeItem('saveInput');
}

// *ця функція функція до слухача чекбокса, перекреслює текст і змінює
// * відображуваний чекбокс (смайлики перемикає в залежності від того виконаний таск чи ні)
function onListTaskClick(event) {
  if (!event.target.classList.contains('check')) {
    return;
  }
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

// *це стирає всі пункти списку
function onRemoveBtnClick(event) {
  removeElementModal('Бажаєте стерти весь список?', () => {
    const allLi = refs.listTask.querySelectorAll('.list-item');
    allLi.forEach(li => li.remove());
    refs.removeBtn.classList.add('btn-display-none');
  });
}

// *а це стирає тільки один пункт
function onListTaskClickDelete(event) {
  if (!event.target.classList.contains('remove-smile')) {
    return;
  }

  removeElementModal(`Бажаєте видалити це завдання?`, () => {
    event.target.closest('.list-item').remove();
    if (refs.listTask.children.length === 0) {
      refs.removeBtn.classList.add('btn-display-none');
    }
  });
}

// *а це модалка з бібліотеки, викликається в функціях стирання замість confirm,
// *в аргументи треба повідомлення, яке треба вивести, і функція, яку треба виконати при стиранні
function removeElementModal(message, onConfirm) {
  const modalOverlay =
    basicLightbox.create(`<h2 class="modal-title">${message}</h2>
    <div class="btn-box">
      <button class="del-btn modal-btn-for-style" type="button">Так</button>
      <button class="cancel-btn modal-btn-for-style" type="button">Ні</button>
    </div>`);
  modalOverlay.show();

  const delBtn = document.querySelector('.del-btn');
  const cancelBtn = document.querySelector('.cancel-btn');

  cancelBtn.addEventListener(
    'click',
    () => {
      modalOverlay.close();
    },
    { once: true }
  );

  delBtn.addEventListener(
    'click',
    () => {
      onConfirm();
      modalOverlay.close();
    },
    { once: true }
  );
}

// *функція на редагування тасків і попередження, що редагування попереднього не завершено
function onListEdit(event) {
  if (!event.target.classList.contains('edit-btn')) {
    return;
  }
  if (refs.inputTask.value.trim()) {
    const modalEdit = basicLightbox.create(
      `<p class="modal-title">Ви ще не завершили попереднє редагування!</p>`
    );
    modalEdit.show();
    return;
  }
  const listItem = event.target.closest('.list-item');
  const textForEdit = listItem.querySelector('.task-text').textContent;
  refs.inputTask.value = textForEdit;
  localStorage.setItem('saveInput', refs.inputTask.value);
  listItem.remove();
  if (refs.listTask.children.length === 0) {
    refs.removeBtn.classList.add('btn-display-none');
  }
}
