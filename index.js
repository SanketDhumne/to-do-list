let rootEl = document.getElementById("root");
let userInEl = document.getElementById("userIn");
let msgEl = document.getElementById("msg");

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

    let dltBtn = document.createElement("button");
    dltBtn.classList.add("dlt-btn");
    dltBtn.onclick = function () {
        onDeleteTodo(todoId);
    }
    labelEl.appendChild(dltBtn);

    let dltIconEL = document.createElement("i");
    dltIconEL.classList.add("fa-solid", "fa-trash");
    dltBtn.appendChild(dltIconEL);
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
    let userVal = userInEl.value;

    if (userVal === "") {
        msgEl.textContent = "Please enter a valid task";
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
}