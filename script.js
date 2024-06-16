function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    saveTasksToLocalStorage();
}

function deleteTask(task) {
Swal.fire({
title: 'Tem certeza que deseja excluir este registro?',
icon: 'warning',
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#d33',
confirmButtonText: 'Sim, deletar!',
cancelButtonText: 'Não, cancelar!'
}).then((result) => {
if (result.isConfirmed) {
    task.remove();
    saveTasksToLocalStorage();
    Swal.fire(
        'Deletado!',
        'Sua tarefa foi deletada.',
        'success'
    )
}
})
}

function addTask(columnId) {
    Swal.fire({
        title: 'Digite a descrição da tarefa:',
        input: 'text',
        showCancelButton: true,
        confirmButtonText: 'Adicionar',
        showLoaderOnConfirm: true,
        preConfirm: (taskDescriptionText) => {
            if (taskDescriptionText === '' || taskDescriptionText.trim() === '') {
                Swal.showValidationMessage('Por favor, insira uma descrição para a tarefa.')
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            const task = document.createElement('div');
            task.className = 'task';
            task.draggable = true;
            task.id = Math.random().toString(36).substring(2);
            task.ondragstart = drag;

            const taskDescription = document.createElement('span');
            taskDescription.innerText = result.value;
            task.appendChild(taskDescription);

            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Deletar';
            deleteButton.style.float = 'right';
            deleteButton.onclick = function(e) {
                e.stopPropagation();
                deleteTask(task);
            };
            task.appendChild(deleteButton);

            const column = document.getElementById(columnId);
            column.appendChild(task);
            saveTasksToLocalStorage();
        }
    })
}

function saveTasksToLocalStorage() {
    const columns = document.getElementsByClassName('kanban-column');
    const tasks = Array.from(columns).map(column => Array.from(column.getElementsByClassName('task')).map(task => task.firstChild.innerText));
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        const columns = document.getElementsByClassName('kanban-column');
        tasks.forEach((columnTasks, columnIndex) => {
            columnTasks.forEach(taskDescription => {
                const task = document.createElement('div');
                task.className = 'task';
                task.draggable = true;
                task.id = Math.random().toString(36).substring(2);
                task.ondragstart = drag;

                const taskDescriptionElement = document.createElement('span');
                taskDescriptionElement.innerText = taskDescription;
                task.appendChild(taskDescriptionElement);

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Deletar';
                deleteButton.style.float = 'right';
                deleteButton.onclick = function(e) {
                    e.stopPropagation();
                    deleteTask(task);
                };
                task.appendChild(deleteButton);

                columns[columnIndex].appendChild(task);
            });
        });
    }
}

loadTasksFromLocalStorage();