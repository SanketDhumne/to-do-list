let rootEl = document.getElementById("root");
let userInEl = document.getElementById("userIn");
let msgEl = document.getElementById("msg");

let currentEditTodoId = null;
let currentEditTitleId = null;
let editModalInstance = null;

// ENTER key handling for New Todo
userInEl.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        onAddTodo();
    }
});

function getTodoList() {
    let parsedTodoList = JSON.parse(localStorage.getItem("todoList"));
    if (parsedTodoList === null) {
        return [];
    } else {
        return parsedTodoList;
    }
}

let todoList = getTodoList();

function onStatusUpdate(chkId, titleId, todoId) {
    let checkEl = document.getElementById(chkId);
    let titleEl = document.getElementById(titleId);

    if (checkEl.checked) {
        titleEl.style.textDecoration = "line-through";
    } else {
        titleEl.style.textDecoration = "none";
    }

    let todoIndex = todoList.findIndex(todo => todo.id == todoId.slice(4));

    todoList[todoIndex].isChecked = checkEl.checked;
}

function createAndAppendTodo(todo) {

    let checkboxId = "chechbox" + todo.id;
    let titleId = "title" + todo.id;
    let todoId = "todo" + todo.id;

    let listItem = document.createElement("li");
    listItem.classList.add("list-item");
    listItem.id = todoId;
    rootEl.appendChild(listItem);

    let checkboxEl = document.createElement("input")
    checkboxEl.type = "checkbox";
    checkboxEl.id = checkboxId;
    checkboxEl.checked = todo.isChecked;

    checkboxEl.onclick = function () {
        onStatusUpdate(checkboxId, titleId, todoId);
    }
    listItem.appendChild(checkboxEl);

    let labelEl = document.createElement("label");
    labelEl.classList.add("label-el");
    labelEl.htmlFor = checkboxId;
    listItem.appendChild(labelEl);

    let titleEl = document.createElement("h4");
    titleEl.textContent = todo.title;
    titleEl.id = titleId;
    if (todo.isChecked) {
        titleEl.style.textDecoration = "line-through";
    }
    labelEl.appendChild(titleEl);

    let iconsContainer = document.createElement("div");

    let editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.onclick = function () {
        onEditTodo(todoId, titleId);
    };
    iconsContainer.appendChild(editBtn);

    let editIconEL = document.createElement("i");
    editIconEL.classList.add("fa-solid", "fa-pencil");
    editBtn.appendChild(editIconEL);

    let dltBtn = document.createElement("button");
    dltBtn.classList.add("dlt-btn");
    dltBtn.onclick = function () {
        onDeleteTodo(todoId);
    };
    iconsContainer.appendChild(dltBtn);

    let dltIconEL = document.createElement("i");
    dltIconEL.classList.add("fa-solid", "fa-trash");
    dltBtn.appendChild(dltIconEL);

    labelEl.appendChild(iconsContainer);
}

function onEditTodo(todoId, titleId) {
    let titleEl = document.getElementById(titleId);
    let currentText = titleEl.textContent;

    currentEditTodoId = todoId;
    currentEditTitleId = titleId;

    document.getElementById("editTaskInput").value = currentText;
    document.getElementById("editMsg").style.display = "none";

    if (!editModalInstance) {
        editModalInstance = new bootstrap.Modal(document.getElementById('editModal'));
    }
    editModalInstance.show();
}

function saveEditedTodo() {
    let inputEl = document.getElementById("editTaskInput");
    let msgEl = document.getElementById("editMsg");
    let newText = inputEl.value.trim();
    let titleEl = document.getElementById(currentEditTitleId);
    let currentText = titleEl.textContent;

    // ENTER key handling for Edit Todo
    document.getElementById("editTaskInput").addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            saveEditedTodo();
        }
    });

    let isDuplicate = todoList.some(todo => todo.title.toLowerCase() === newText.toLowerCase());

    if (newText === "") {
        msgEl.textContent = "Task cannot be empty!";
        msgEl.style.display = "block";
    } else if (newText.toLowerCase() !== currentText.toLowerCase() && isDuplicate) {
        msgEl.textContent = "This task already exists!";
        msgEl.style.display = "block";
    } else {
        titleEl.textContent = newText;
        let todoIndex = todoList.findIndex(todo => todo.id == currentEditTodoId.slice(4));
        todoList[todoIndex].title = newText;

        editModalInstance.hide();
    }
}

function onDeleteTodo(todoId) {
    let todoEl = document.getElementById(todoId);
    rootEl.removeChild(todoEl);

    let todoIndex = todoList.findIndex(todo => todo.id == todoId.slice(4));

    todoList.splice(todoIndex, 1);
}

for (each of todoList) {
    createAndAppendTodo(each);
}

function onAddTodo() {
    let userVal = userInEl.value.trim().replace(/\n+/g, " ");
    let isDuplicate = todoList.some(todo => todo.title.toLowerCase() === userVal.toLowerCase());

    if (userVal === "") {
        msgEl.textContent = "Please enter a valid task";
    } else if (isDuplicate) {
        msgEl.textContent = "This task already exists";
    }
    else {
        let newTodo = {

            id: todoList.length + 1,
            title: userVal,
            isChecked: false

        };

        createAndAppendTodo(newTodo);
        todoList.push(newTodo);
        userInEl.value = "";
        msgEl.textContent = "";
    }
}

function onSaveTodo() {
    localStorage.setItem("todoList", JSON.stringify(todoList));

    const toastEl = document.getElementById("saveToast");
    const toast = new bootstrap.Toast(toastEl, {
        delay: 2000
    });
    toast.show();
}