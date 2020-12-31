// Client-Side Application - LocalStorage Based (state saved in LocalStorage, ie: persists across sessions)

// Initialization
const localStorageKey = 'TaskManagerTodoItems'		// LocalStorage is Key:Value pairs, where Value is a String
var todoItems = []									// Main array for the todo list

// Add Event Handlers
document.addEventListener('DOMContentLoaded', handlerDomLoaded)									// Initialization Handler for when DOM is complete
document.querySelector('#input-form').addEventListener('submit', handleSubmitForm)				// Submit new Task form
document.querySelector('#todo-list').addEventListener('click', handleTodoListButtonClicks)		// Click handler for the whole List (Done, Edit, or Delete buttons)
document.querySelector('#btn-clear-all').addEventListener('click', handleClearAll);				// Clear the whole List button !!

// Event Handlers
function handlerDomLoaded() {
	// Retrieve existing todoItems from LocalStorage once the Document has loaded
	const existingContent = localStorage.getItem(localStorageKey)

	if (existingContent) {
		todoItems = JSON.parse(existingContent)				// LocalStorage can only save String data
		todoItems.forEach( item => updatePageDom(item) )
	} 
}

function handleSubmitForm(event) {
	event.preventDefault()		// Stop Form's default submit/page refresh action
	const input = document.querySelector('#input-field')
	const inputValue = stripHTML(input.value).trim()			// or sanitizeHTML()

	if (inputValue != '') {
		addTodo(inputValue)
	}
	input.focus()
	input.value = ''				// Clear the form
}

function handleTodoListButtonClicks(event) {
	const parentItemId = Number( event.target.parentElement.id.replace('item-','') )			// ID of the Parent of the button that was clicked (ie. the ListItem)

	// Determine if user clicked on one of the buttons
	switch (event.target.name) {
		case 'btn-check':
			return checkTodo(parentItemId)
		case 'btn-edit':
			return editTodo(parentItemId)
		case 'btn-delete':
			return deleteTodo(parentItemId)
		default:
			// User clicked somewhere else within the #todo-list
	}
}

function handleClearAll(event) {
	/* Alternate method:
		const allIds = todoItems.map( item => item.id)		// We can't directly delete every item as deleteTodo() changes todoItems
		allIds.forEach( id => deleteTodo(id) ) */
	let todoList = document.querySelector('#todo-list')

	todoList.innerHTML = ''
	document.querySelector('#instructions').classList.remove('w3-hide')		
	document.querySelector('#btn-clear-all').classList.add('w3-hide')
	todoItems = []
	localStorage.setItem(localStorageKey, JSON.stringify(todoItems))
}

// Workflow functions
function addTodo(text) {
	const todo = {
		description: text,
		completed: false,
		id: Date.now()			// Returns number of ms since Jan 1, 1970. Eg: 1599966102691
	}

	todoItems.push(todo)
	localStorage.setItem(localStorageKey, JSON.stringify(todoItems))		// Preserve state by saving todoItems to LocalStorage
	updatePageDom(todo)
}

function updatePageDom(todo) {
	// Updates the Page's DOM by adding, removing, or updating one Todo List Item
	let todoList = document.querySelector('#todo-list')
	const existingItem = todoList.querySelector(`#item-${todo.id}`)

	// Show/Hide the Clear All button and the Instructions (they end up being mutually exclusive)
	if (todoItems.length > 0) {
		document.querySelector('#instructions').classList.add('w3-hide')		// The Instructions are only shown if there's NO todo items
		document.querySelector('#btn-clear-all').classList.remove('w3-hide')	// Only show Clear All if there's something to clear
	} else {
		document.querySelector('#instructions').classList.remove('w3-hide')		
		document.querySelector('#btn-clear-all').classList.add('w3-hide')		// Safe, can't add class more than once
	}

	if (todo.deleted) {															// Added by deleteTodo() to signal removal
		return existingItem.remove();
	}

	let newListItem = document.createElement('li')
	newListItem.id = `item-${todo.id}`											// ID of the new List Item = item-<todo.id Number>
	newListItem.classList.add('w3-container')
	newListItem.innerHTML = `<input type="checkbox" name="btn-check" class="w3-check w3-margin-right w3-padding-small w3-large">
		<span name="todo-text">${todo.description}</span>
		<button name="btn-delete" class="w3-right w3-margin-left w3-padding-small sa-no-focus-outline w3-hover-theme w3-border-0 w3-large w3-hover-border-theme"><i class="fa fa-trash-o sa-no-pointer-events"></i></button>
		<button name="btn-edit" class="w3-right w3-margin-left w3-padding-small sa-no-focus-outline w3-hover-theme w3-border-0 w3-large w3-hover-border-theme"><i class="fa fa-pencil sa-no-pointer-events"></i></button>
	`;

	if (todo.completed) {
		newListItem.children['btn-check'].checked = true
		let todoText = newListItem.querySelector(`span`)			// There's only one span (could use .nextElementSibling but we might change the order later)
		todoText.classList.toggle('w3-text-grey')
		todoText.classList.toggle('sa-text-line-through')
	}

	if (existingItem) {
		todoList.replaceChild(newListItem, existingItem)
	} else {
		todoList.append(newListItem)
	}
}

function checkTodo(id) {
	const index = todoItems.findIndex( (item) => item.id == id )

	todoItems[index].completed = !todoItems[index].completed			// toggle the completed property
	localStorage.setItem(localStorageKey, JSON.stringify(todoItems))
	updatePageDom(todoItems[index])
}

function deleteTodo(id) {
	let todo = todoItems.find( (item) => item.id == id )

	todo.deleted = true												// Signal to updatePageDom() that this item is to be removed
	todoItems = todoItems.filter( (item) => item.id != id )			// Remove it from the main array
	localStorage.setItem(localStorageKey, JSON.stringify(todoItems))
	updatePageDom(todo)
}

function editTodo(id) {
	const index = todoItems.findIndex( (item) => item.id == id )

	let input = window.prompt("Edit Todo item", todoItems[index].description)
	let inputValue = input ? stripHTML(input).trim() : ''			// or sanitizeHTML()
	if (inputValue != '' && inputValue != todoItems[index].description) {
		todoItems[index].description = inputValue
		localStorage.setItem(localStorageKey, JSON.stringify(todoItems))
		updatePageDom(todoItems[index])
	}
}
