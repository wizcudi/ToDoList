const taskForm = document.getElementById("task-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openTaskFormBtn = document.getElementById("open-task-form-btn");
const closeTaskFormBtn = document.getElementById("close-task-form-btn");
const addOrUpdateTaskBtn = document.getElementById("add-or-update-task-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const tasksContainer = document.getElementById("tasks-container");
const titleInput = document.getElementById("title-input");
const dateInput = document.getElementById("date-input");
const descriptionInput = document.getElementById("description-input");

// stores all tasks along with their associated data
// const taskData = []

// EXAMPLE of To Do List items
// const myTaskArr = [
//   { task: "Walk the Dog", date: "22-04-2022" },
//   { task: "Read some books", date: "02-11-2023" },
//   { task: "Watch football", date: "10-08-2021" },
// ];

// localStorage offers methods for saving, retrieving, and deleting items
// setItem() method saves an item
// getItem() method retrieves item 
// removeItem() method deletes item 
// clear() method deletes All items
// JSON.stringify() converts to string format
// localStorage.setItem("data", JSON.stringify(myTaskArr)); // EXAMPLE OF LOCAL STORAGE IN USE

// EXAMPLE of retrieving data items from myTaskArr array
// const getTaskArr = localStorage.getItem("data")
// console.log(getTaskArr) // printing result to console

// JSON.parse() returns data back into an object
// const getTaskArrObj = JSON.parse(localStorage.getItem('data'))
// console.log(getTaskArrObj) // printing result to console

// This storage will enable you to keep track of tasks, display them on the page, and save them to localStorage.
const taskData = JSON.parse(localStorage.getItem("data")) ||[];

// This variable will be used to track the state when editing and discarding tasks.
let currentTask = {}

const addOrUpdateTask =( )=>{
  // The first function can be used to add the input values to taskData
  // while the second function can be responsible for adding the tasks to the DOM.

  // finds index of task object in array with same ID as current being edited or added
  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);

  // creates new task object with properties based on values entered in HTML inputs
  const taskObj = {
    // connects to HTML tag with .title-input 
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    // connects to HTML tag with .date-input
    date: dateInput.value,
    // connects to HTML tag with .description-input
    description: descriptionInput.value,
 };

 // if its '-1', the task is new and will be added
 // if its NOT '-1',nthe task already exist and will be updated
  if (dataArrIndex === -1) {
   taskData.unshift(taskObj);
  }else{
    taskData[dataArrIndex] = taskObj
  }

  // save task items to localStorage when user add or update
  localStorage.setItem('data', JSON.stringify(taskData))

  updateTaskContainer()
  reset()
}

const updateTaskContainer = () =>{
  // connects to HTML tag with .task-container input
  // it clears the html tag
  tasksContainer.innerHTML = "";

  // display task on page by looping through it
  taskData.forEach(({ id, title, date, description }) => {
    (tasksContainer.innerHTML += `
      <div class="task" id="${id}">
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Description:</strong> ${description}</p>
      <button onclick="editTask(this)" type="button" class="btn">Edit</button>
      <button onclick="deleteTask(this)" type="button" class="btn">Delete</button>
      </div>
    `)}
  );
}

const deleteTask = (buttonEl) => {
  const taskId = buttonEl.parentElement.id; // Get the ID of the task to be deleted
  const dataArrIndex = taskData.findIndex((item) => item.id === taskId); // Find the index of the task in taskData

  // Remove the task from the DOM
  buttonEl.parentElement.remove();

  // If the task is found in taskData, remove it from the array using splice()
  if (dataArrIndex !== -1) {
    taskData.splice(dataArrIndex, 1); // Remove 1 element at the index found
  }

  // deletes task from local storage
  localStorage.setItem('data', JSON.stringify(taskData))
}

const editTask = (buttonEl) => {
  const dataArrIndex = taskData.findIndex((item) => item.id === buttonEl.parentElement.id);

  // using square bracket notation to retrieve task to be edited
  currentTask = taskData[dataArrIndex]

  titleInput.value = currentTask.title
  dateInput.value = currentTask.date
  descriptionInput.value = currentTask.description

  addOrUpdateTaskBtn.innerText = "Update Task";

  // Show the task form modal by toggleing the 'hidden' class
  taskForm.classList.toggle("hidden");

}

const reset =()=>{
  addOrUpdateTaskBtn.innerText = "Add Task"
  titleInput.value ="";
  dateInput.value="";
  descriptionInput.value="";
  taskForm.classList.toggle("hidden");
  currentTask={}
}

// The toggle method will add the class if it is not present on the element, and remove the class if it is present on the element.
openTaskFormBtn.addEventListener("click",()=>taskForm.classList.toggle("hidden"));

// The HTML dialog element has a showModal() method that can be used to display a modal dialog box on a web page.
closeTaskFormBtn.addEventListener("click",()=> {

    // Displays buttons only if some text in input fields
    const formInputsContainValues =titleInput.value || dateInput.value || descriptionInput.value;

    // check if user made changes while trying to edit a task by verifying
    const formInputValuesUpdated = titleInput.value !== currentTask.title || dateInput.value !== currentTask.date ||descriptionInput.value !== currentTask.description

    // && formInputValuesUpdated makes sure Cancel/Discard btns in modal wont display
    if(formInputsContainValues && formInputValuesUpdated){
        confirmCloseDialog.showModal()
      }else{reset()}
      confirmCloseDialog.showModal();


});

// If the user clicks the Cancel button, you want to cancel the process and close the modal so the user can continue editing.
// The HTML dialog element has a close() method that can be used to close a modal dialog box on a web page.
cancelBtn.addEventListener("click",()=>confirmCloseDialog.close())

// If the user clicks the Discard button, you want to close the modal showing the Cancel and Discard buttons, then hide the form modal.
discardBtn.addEventListener("click", () => {
  confirmCloseDialog.close();

  // taskForm.classList.toggle("hidden");
  reset()
});

taskForm.addEventListener("submit",(e)=>{
  e.preventDefault()
  addOrUpdateTask();    
})



