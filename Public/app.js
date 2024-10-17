let taskToUpdateId = null;

document.getElementById('task').addEventListener('submit', async function() {

  const task = document.getElementById('task-input').value;
  const status = document.getElementById('status-input').value;
  const date = document.getElementById('date-input').value;

  const response = await fetch('/add-task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date: date, task: task , status: status })
  });

  const result = await response.json();
  console.log(result.message);


  document.getElementById('task-input').value = '';
  document.getElementById('status-input').value = '';
  document.getElementById('date-input').value = '';
  
  fetchTasks();
});


async function fetchTasks() {
  const response = await fetch('/get-tasks');
  const tasks = await response.json();

  const taskList = document.getElementById('task-list');
  taskList.innerHTML = ''; 

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerText = task.task + ` \n ${task.status} \n ${task.date}`;
    


    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';

  
    deleteButton.addEventListener('click', async () => {
      await deleteTask(task._id); 
      fetchTasks();  
    });

  
    const updateButton = document.createElement('button');
    updateButton.innerText = 'Update';

    
    updateButton.addEventListener('click', () => {
      document.getElementById('update-input').value = task.task;
      document.getElementById('update-date-input').value = task.date;
      document.getElementById('update-stt-input').value = task.status;

      taskToUpdateId = task._id; 
      document.getElementById('update-btn').disabled = false;
    });

    li.appendChild(deleteButton);  
    li.appendChild(updateButton);  
    taskList.appendChild(li);      
  });
}


async function deleteTask(taskId) {
  const response = await fetch(`/delete-task/${taskId}`, {
    method: 'DELETE',
  });
  const result = await response.json();
  console.log(result.message);
}


document.getElementById('search-btn').addEventListener('click', async function() {
  const searchQuery = document.getElementById('search-input').value;

  const response = await fetch(`/search-task?name=${searchQuery}`);
  const tasks = await response.json();

  
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';  

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerText = task.task + ` \n ${task.status} \n ${task.date}`;
    

    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'Delete';

  
    deleteButton.addEventListener('click', async () => {
      await deleteTask(task._id);  
      fetchTasks();  
    });

    
    const updateButton = document.createElement('button');
    updateButton.innerText = 'Update';

  
    updateButton.addEventListener('click', () => {
      document.getElementById('update-input').value = task.task;
      document.getElementById('update-date-input').value = task.date;
      document.getElementById('update-stt-input').value = task.status;

      taskToUpdateId = task._id; 
      
      document.getElementById('update-btn').disabled = false;
    });

    li.appendChild(deleteButton);  
    li.appendChild(updateButton); 
    
    taskList.appendChild(li);
  });
});


document.getElementById('update-btn').addEventListener('click', async function() {
  const updatedTask = document.getElementById('update-input').value;

  if (taskToUpdateId) {
  
    const response = await fetch(`/update-task/${taskToUpdateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ task: updatedTask }),
    });

    const result = await response.json();
    console.log(result.message);

  
    document.getElementById('update-input').value = '';
    document.getElementById('update-btn').disabled = true;
    taskToUpdateId = null;

    fetchTasks();
  }
});

document.getElementById('update-btn').addEventListener('click', async function() {
  const updateDay = document.getElementById('update-date-input').value;

  if (taskToUpdateId) {
  
    const response = await fetch(`/update-date/${taskToUpdateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date: updateDay }),
    });

    const result = await response.json();
    console.log(result.message);

  
    document.getElementById('update-date-input').value = '';
    document.getElementById('update-btn').disabled = true;
    taskToUpdateId = null;

    fetchTasks();
  }
});


document.getElementById('update-btn').addEventListener('click', async function() {
  const updateSTT = document.getElementById('update-stt-input').value;

  if (taskToUpdateId) {
  
    const response = await fetch(`/update-status/${taskToUpdateId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: updateSTT }),
    });

    const result = await response.json();
    console.log(result.message);

  
    document.getElementById('update-stt-input').value = '';
    document.getElementById('update-btn').disabled = true;
    taskToUpdateId = null;

    fetchTasks();
  }
});

fetchTasks();


