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

//  This array will store all the tasks along with their associated data, including title, due date, and description. 
// This storage will enable you to keep track of tasks, display them on the page, and save them to localStorage.
// const taskData = [
  
// ]
const taskData = JSON.parse(localStorage.getItem("data")) ||[];

// This variable will be used to track the state when editing and discarding tasks.
let currentTask = {}

// The first function can be used to add the input values to taskData
// while the second function can be responsible for adding the tasks to the DOM.
const addOrUpdateTask =( )=>{

  const dataArrIndex = taskData.findIndex((item) => item.id === currentTask.id);
  const taskObj = {
    id: `${titleInput.value.toLowerCase().split(" ").join("-")}-${Date.now()}`,
    title: titleInput.value,
    date: dateInput.value,
    description: descriptionInput.value,
 };
  if (dataArrIndex === -1) {
   taskData.unshift(taskObj);
  }else{
    taskData[dataArrIndex] = taskObj
  }

  // save task items to localStorage when user add,update, or remove
  localStorage.setItem('data', JSON.stringify(taskData))

  updateTaskContainer()
  reset()
}


const updateTaskContainer = () =>{
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
          `)
        }
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

// clear input fields
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

// get value from input fields, save them into taskData array, display them on page
taskForm.addEventListener("submit",(e)=>{
    e.preventDefault()

    addOrUpdateTask();

    // determines if task being add to taskData array already exist
    // If not, this will add it to array
    // If it does, array will be updated
    // findIndex() array method finds & returns index of 1st element in array that meets criteria
    // const dataArrIndex = taskData.findIndex((item)=> item.id === currentTask.id)

    // saves created task to object
    // const taskObj = {
    //     // toLowerCase turns all inputs to lower
    //     // split(" ") turns strings  into array of words, (" ") creates space between words
    //     // join method turns result back into a string
    //     // Date.now() returns the number of milliseconds elapsed since January 1, 1970 00:00:00 UTC.
    //     id: `${titleInput.value.toLowerCase().split().join("-")}-${Date.now()}`,

    //     title: titleInput.value,
    //     date: dateInput.value,
    //     description: descriptionInput.value,
    // }

    // if(dataArrIndex === -1){
    //     // array method used to add one or more elements to beginning of array
    //     taskData.unshift(taskObj)
    // }

    // // display task on page by looping through it
    // taskData.forEach(({id,title,date,description})=>{
    //     tasksContainer.innerHTML += `
    //         <div class="task" id="${id}" >
    //         <p><strong>Title:</strong>${title}</p>
    //         <p><strong>Date:</strong>${date}</p> 
    //         <p><strong>Description:</strong>${description}</p> 
    //         <button type="button" class="btn">Edit</button>
    //         <button type="button" class="btn">Delete</button>
    //         </div>
    //     `
    // })    

    // close form modal to view the task
    // taskForm.classList.toggle("hidden");
    // reset()

})




// // example of To Do List items
// const myTaskArr = [
//   { task: "Walk the Dog", date: "22-04-2022" },
//   { task: "Read some books", date: "02-11-2023" },
//   { task: "Watch football", date: "10-08-2021" },
// ];

// // localStorage offers methods for saving, retrieving, and deleting items.
// // the setItem() method is used to save an item, getItem() method retrieves item. To delete removeItem() method, to delete all clear().
// // JSON.stringify() converts to string format
// localStorage.setItem("data", JSON.stringify(myTaskArr));

// // retrieve data items of TO DO List
// const getTaskArr = localStorage.getItem("data")
// console.log(getTaskArr)

// // To view it in its original form before saving, you need to use JSON.parse()
// const getTaskArrObj = JSON.parse(localStorage.getItem('data'))
// console.log(getTaskArrObj)