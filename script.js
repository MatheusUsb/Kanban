let dragged;

function handleDragStart(event) {
    dragged = this;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', this.outerHTML);
}

function handleDragOver(event) {
    if (event.preventDefault) {
        event.preventDefault();
    }
    this.classList.add('over');
    event.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(event) {
    this.classList.add('over');
}

function handleDragLeave(event) {
    this.classList.remove('over');
}

function handleDrop(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    }
    if (dragged != this) {
        this.parentNode.removeChild(dragged);
        const dropHTML = event.dataTransfer.getData('text/html');
        this.insertAdjacentHTML('beforebegin',dropHTML);
        const dropElem = this.previousSibling;
        addDnDHandlers(dropElem);
    }
    this.classList.remove('over');
    saveTasksToLocalStorage();
    return false;
}

function handleDragEnd(event) {
    this.classList.remove('over');
}

function addDnDHandlers(elem) {
    elem.addEventListener('dragstart', handleDragStart, false);
    elem.addEventListener('dragover', handleDragOver, false);
    elem.addEventListener('dragenter', handleDragEnter, false);
    elem.addEventListener('dragleave', handleDragLeave, false);
    elem.addEventListener('drop', handleDrop, false);
    elem.addEventListener('dragend', handleDragEnd, false);
}

function addTask(columnId) {
    const task = document.createElement('div');
    task.className = 'task';
    task.draggable = true;
    const taskDescription = prompt('Insira o nome da tarefa');
    task.innerText = taskDescription;
    task.oncontextmenu = function(e) {
        e.preventDefault();
        if (confirm('Você quer deletar esta tarefa?')) {
            task.remove();
            saveTasksToLocalStorage();
        }
    };
    const column = document.getElementById(columnId);
    column.appendChild(task);
    addDnDHandlers(task);
    saveTasksToLocalStorage();
}

function saveTasksToLocalStorage() {
    const columns = document.getElementsByClassName('column');
    const tasks = Array.from(columns).map(column => Array.from(column.getElementsByClassName('task')).map(task => task.innerText));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        const columns = document.getElementsByClassName('column');
        tasks.forEach((columnTasks, columnIndex) => {
            columnTasks.forEach(taskDescription => {
                const task = document.createElement('div');
                task.className = 'task';
                task.draggable = true;
                task.innerText = taskDescription;
                columns[columnIndex].appendChild(task);
                addDnDHandlers(task);
            });
        });
    }
}

loadTasksFromLocalStorage();