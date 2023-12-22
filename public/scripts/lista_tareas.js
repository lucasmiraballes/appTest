const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const editModal = document.getElementById('editModal');
const editTaskNameInput = document.getElementById('edit-task-name');
const editTaskDateInput = document.getElementById('edit-task-date');
const editTaskTimeInput = document.getElementById('edit-task-time');
let tasks = [];
let currentEditingTask;

// Función para formatear la fecha a dd/mm/aaaa
function formatDate(inputDate) {
    console.log('Fecha original:', inputDate);

    if (!inputDate) {
        console.error('Fecha inválida: Valor nulo o vacío');
        return 'Sin fecha';
    }

    // Intentamos dividir la fecha por "/" o "-"
    const dateParts = inputDate.split(/[/ -]/);

    if (dateParts.length === 3) {
        const [year, month, day] = dateParts.map(part => parseInt(part, 10));
    
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
            const meses = [
                'Enero', 'Febrero', 'Marzo', 'Abril',
                'Mayo', 'Junio', 'Julio', 'Agosto',
                'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
            ];
    
            // Corregimos el formato de salida
            console.log('Fecha procesada:', day, month, year);
            return `${day.toString().padStart(2, '0')}/${meses[month - 1]}/${year}`;
        }
    }
    
    console.error('Fecha inválida: Formato incorrecto o componentes de fecha no válidos');
    return 'Fecha inválida';
}

function addTask() {
    const taskName = document.getElementById('task-name').value;
    const taskDate = document.getElementById('task-date').value;

    // Validación 
    if (taskName === '' || taskDate === '') {
        alert('Por favor, ingrese un nombre de tarea y una fecha válidos.');
        return; // Detener la función si la validación falla
    }

    const taskTime = document.getElementById('task-time').value;
    const taskDescription = document.getElementById('task-description').value;

    const task = {
        name: taskName,
        date: taskDate,
        time: taskTime,
        description: taskDescription,
    };

    tasks.push(task);

    renderTasks();

    // Limpiar el formulario
    document.getElementById('task-name').value = '';
    document.getElementById('task-date').value = '';
    document.getElementById('task-time').value = '';
    document.getElementById('task-description').value = '';
}

function sortAndGroupTasks(tasks) {
    const sortedTasks = sortTasks(tasks);

    const groupedTasks = {};

    sortedTasks.forEach(task => {
        const key = `${task.date}`;
        if (!groupedTasks[key]) {
            groupedTasks[key] = [];
        }
        groupedTasks[key].push(task);
    });

    for (const key in groupedTasks) {
        groupedTasks[key] = sortTasks(groupedTasks[key]);
    }

    const finalSortedTasks = Object.values(groupedTasks).flat();
    return finalSortedTasks;
}

function sortTasks(tasks) {
    return tasks.sort((a, b) => {
        const dateA = parseDateWithTimeZone(`${a.date} ${a.time || '00:00'}`, 'America/Montevideo');
        const dateB = parseDateWithTimeZone(`${b.date} ${b.time || '00:00'}`, 'America/Montevideo');
        return dateA - dateB;
    });
}

function parseDateWithTimeZone(dateTimeString, timeZone) {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone };
    const date = new Date(dateTimeString);
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const offset = date.getTime() - utcDate.getTime();
    return new Date(date.getTime() - offset);
}

function showEditMenu(index) {
    currentEditingTask = index;
    editTaskNameInput.value = tasks[index].name;
    editTaskDateInput.value = tasks[index].date;
    editTaskTimeInput.value = tasks[index].time;
    document.getElementById('edit-task-description').value = tasks[index].description;

    editModal.style.display = 'block';
}

function closeModalWithoutSaving() {
    editModal.style.display = 'none';
}

function closeModal() {
    editModal.style.display = 'none';
}

function saveChanges() {
    const newTaskName = editTaskNameInput.value;
    const newTaskDate = editTaskDateInput.value;
    const newTaskTime = editTaskTimeInput.value;
    const newTaskDescription = document.getElementById('edit-task-description').value;

    // Verifica que el nuevo nombre y la nueva fecha sean válidos
    if (newTaskName !== '' && newTaskDate !== '') {
        tasks[currentEditingTask] = {
            name: newTaskName,
            date: newTaskDate,
            time: newTaskTime,
            description: newTaskDescription
        };
        tasks = sortAndGroupTasks(tasks);
        renderTasks();
        closeModal();
    } else {
        alert('Por favor, ingrese un nombre de tarea y una fecha válidos.');
    }
}

function renderTasks() {
    taskList.innerHTML = '';

    let currentDayElement = null;
    let alternateColor = false;

    tasks = sortAndGroupTasks(tasks);

    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        const taskDate = new Date(task.date);
        const currentDay = taskDate.getDate();

        if (!currentDayElement || currentDay !== currentDayElement.day) {
            currentDayElement = getOrCreateDayElement(currentDay, alternateColor);
            taskList.appendChild(currentDayElement.div);
            alternateColor = !alternateColor;
        }

        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.classList.add('task-line');

        // Div para mostrar el nombre de la tarea
        const taskNameDiv = document.createElement('div');
        taskNameDiv.classList.add('task-name');
        taskNameDiv.innerHTML = `<strong>Tarea: </strong> ${task.name ? task.name : 'Sin nombre'}`;
        
        // Div para mostrar la fecha y hora
        const taskHeader = document.createElement('div');
        taskHeader.classList.add('task-header');

        taskHeader.innerHTML = `<strong>Fecha: </strong> ${task.date ? formatDate(task.date) : 'Sin fecha'}` + `<br>` +
                              `<strong>Hora: </strong> ${task.time ? task.time : ''}</span>`;

        const taskDescription = document.createElement('p');
        taskDescription.textContent = `Descripción:  ${task.description ? task.description : 'Sin descripción'}`;

        const taskActions = document.createElement('div');
        taskActions.classList.add('task-actions');

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Borrar';
        deleteButton.onclick = () => deleteTask(i);

        const editButton = document.createElement('button');
        editButton.innerText = 'Editar';
        editButton.onclick = () => showEditMenu(i);

        taskActions.appendChild(deleteButton);
        taskActions.appendChild(editButton);

        taskElement.appendChild(taskNameDiv); // Agregar el div del nombre de la tarea
        taskElement.appendChild(taskHeader);
        taskElement.appendChild(taskDescription);
        taskElement.appendChild(taskActions);

        currentDayElement.div.appendChild(taskElement);
    }
}

function getOrCreateDayElement(day, alternateColor) {
    const existingDayElements = document.querySelectorAll('.day-container');
    
    for (const existingDayElement of existingDayElements) {
        if (existingDayElement.dataset.day === String(day)) {
            return { div: existingDayElement, line: existingDayElement.querySelector('hr') };
        }
    }

    const dayElement = document.createElement('div');
    dayElement.classList.add('day-container');
    dayElement.dataset.day = day;
    // dayElement.style.backgroundColor = '#3498db'

    const line = document.createElement('hr');
    dayElement.appendChild(line);

    return { div: dayElement, line: line };
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Llamada inicial para renderizar las tareas al cargar la página
renderTasks();

   
    const closeModalButton = document.getElementById('closeModal');
    const saveChangesButton = document.getElementById('saveChanges'); 
   
   
  
