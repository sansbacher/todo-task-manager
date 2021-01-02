// Client-Side Application - DOM Based (state saved in the DOM, ie, a refresh kills it)

// Add Event Handlers
document.querySelector('#input-form').addEventListener('submit', handleSubmitForm);				// Submit new Task
document.querySelector('#todo-list').addEventListener('click', handleTodoListButtonClicks);		// Clicking on Done, Edit, or Delete
document.querySelector('#btn-clear-all').addEventListener('click', handleClearAll);				// Clear the whole list

// Event Handlers
function handleSubmitForm(event) {
	event.preventDefault()			// Stop the usual Form Submit functions
	let input = document.querySelector('#input-field')
	let inputValue = stripHTML(input.value).trim()			// or sanitizeHTML()
	if (inputValue != '') {
		addTodo(inputValue)
	}
	input.value = ''				// Clear the form
}

function handleTodoListButtonClicks(event) {
	// Determine if user clicked on one of the buttons
	switch (event.target.name) {
		case 'btn-check':
			return checkTodo(event);
		case 'btn-edit':
			return editTodo(event);
		case 'btn-delete':
			return deleteTodo(event);
		default:
			// User clicked somewhere else within the #todo-list
	}
}

function handleClearAll(event) {
	document.querySelector('#todo-list').innerHTML = '';
	document.querySelector('#btn-clear-all').classList.add('w3-hide')
	document.querySelector('#instructions').classList.remove('w3-hide')			// The Instructions are only shown if there's NO todo items
}

// Workflow functions
function addTodo(todo) {
	let todoList = document.querySelector('#todo-list')
	let newListItem = document.createElement('li')

	newListItem.classList.add('w3-container')
	// Very long CSS class lists as not using custom CSS, all W3.CSS
	newListItem.innerHTML = `<input type="checkbox" name="btn-check" class="w3-check w3-margin-right w3-padding-small w3-large">
		<span name="todo-text" data-name="todo-text">${todo}</span>
		<button name="btn-delete" class="w3-right w3-margin-left w3-padding-small sa-no-focus-outline w3-hover-theme w3-border-0 w3-large w3-hover-border-theme"><i class="fa fa-trash-o sa-no-pointer-events"></i></button>
		<button name="btn-edit" class="w3-right w3-margin-left w3-padding-small sa-no-focus-outline w3-hover-theme w3-border-0 w3-large w3-hover-border-theme"><i class="fa fa-pencil sa-no-pointer-events"></i></button>`;
	todoList.append(newListItem)

	// Show/Hide the Clear All button and the Instructions (they end up being mutually exclusive)
	if (todoList.children.length > 0) {
		document.querySelector('#btn-clear-all').classList.remove('w3-hide')
		document.querySelector('#instructions').classList.add('w3-hide')
	}
}

function checkTodo(event) {
	let checkButton = event.target
	let todoText = checkButton.nextElementSibling		// The todo-text span is the next element from the check button

	// No need to add 'checked' to the button when using plain DOM
	todoText.classList.toggle('w3-text-grey')
	todoText.classList.toggle('sa-text-line-through')
}

function deleteTodo(event) {
	let parentList = event.target.parentNode			// Parent of the button clicked is the 'list-item' containing the button
	parentList.remove()
	
	let todoList = document.querySelector('#todo-list')
	if (todoList.children.length == 0) {
		document.querySelector('#btn-clear-all').classList.add('w3-hide')
		document.querySelector('#instructions').classList.remove('w3-hide')
	}
	
}

function editTodo(event) {
	let parentList = event.target.parentNode			// The List Item is the parent of the target that was clicked
	// Find the child <span> of the List Item with the actual text by name (can't use ID since all the same)
	let textSpan = parentList.children['todo-text']		// Works in Chrome, but seems non-standard (span's have no name?)
	if (!textSpan) { textSpan = parentList.querySelector('[data-name=todo-text]') }		// Works in Edge (more standard?)
	
	let input = window.prompt("Edit Todo item", textSpan.innerText)				// Be nicer to do this with a modal pop-up container
	let inputValue = stripHTML(input).trim()		// or sanitizeHTML()
	if (inputValue != '' && inputValue != textSpan.innerText) {
		textSpan.innerText = inputValue
	}
}
