// Client-Side Application - DOM Based (state saved in the DOM, ie, a refresh kills it)
// Modified to use Modules, pull the new List Item from an embedded HTML template (in the HTML file) and render with Mustache
// And now uses a modal dialog box for editing. Modified to use Bootstrap 4 CSS and Bootstrap Native JS

// Scripts loaded with type="module" (and all imported modules) are deferred by default and 'use strict'; by default
import { sanitizeHTML, stripHTML } from './modules/utils.js'		// If using local paths (not URLs) must use a web server, not local files
import Mustache from 'https://cdn.jsdelivr.net/npm/mustache@4.1.0/mustache.mjs'			// Web hosted version, ES Module type
import BSN from 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap.native/3.0.14/bootstrap-native.esm.min.js'

// Initialization
const editTodoModal = new BSN.Modal('#edit-todo-modal')
var handleEditTodo;																				// Will be the Edit Todo modal pop-up Form handler (must persist globally)

// Load Templates from within the HTML
const todoItemTemplate = document.getElementById('todo-item-template').innerHTML

// Add Event Handlers
document.querySelector('#input-form').addEventListener('submit', handleAddNewTodo)				// Submit new Task
document.querySelector('#todo-list').addEventListener('click', handleTodoListButtonClicks)		// Clicking on Done, Edit, or Delete
document.querySelector('#btn-clear-all').addEventListener('click', handleClearAll)				// Clear the whole list

// Event Handlers
function handleAddNewTodo(event) {
	event.preventDefault()			// Stop the usual Form Submit functions
	const $inputField = document.querySelector('#input-field')
	let inputValue = stripHTML($inputField.value).trim()			// or sanitizeHTML()
	if (inputValue != '') {
		addTodo(inputValue)
	}
	$inputField.value = ''				// Clear the form
}

function handleTodoListButtonClicks(event) {
	// Determine if user clicked on one of the buttons
	switch (event.target.name) {
		case 'btn-check':
			return checkTodo(event);
		case 'btn-edit':
			return displayEditTodoModal(event);
		case 'btn-delete':
			return deleteTodo(event);
		default:
			// User clicked somewhere else within the #todo-list
	}
}

function handleClearAll(event) {
	document.querySelector('#todo-list').innerHTML = '';
	document.querySelector('#btn-clear-all').classList.add('d-none')
	document.querySelector('#instructions').classList.remove('d-none')			// The Instructions are only shown if there's NO todo items
}

// Workflow functions
function addTodo(todo) {
	const $todoList = document.querySelector('#todo-list')		// using '$' prefix to signify a DOM element
	const html = Mustache.render(todoItemTemplate, { todo })
	$todoList.insertAdjacentHTML('beforeend', html)				// 'afterbegin' would insert new Todo items at the top of the list

	// Show/Hide the Clear All button and the Instructions (they end up being mutually exclusive)
	if ($todoList.children.length > 0) {
		document.querySelector('#btn-clear-all').classList.remove('d-none')
		document.querySelector('#instructions').classList.add('d-none')
	}
}

function checkTodo(event) {
	const $parentList = event.target.parentNode.parentNode		// The List Item is the grand-parent of the target that was clicked
	// Find the child <span> of the List Item with the actual text by name (can't use ID since all the same)
	const $textSpan = $parentList.querySelector('[data-name=todo-text]')

	// No need to add 'checked' to the button when using plain DOM
	$textSpan.classList.toggle('completed-todo')
}

function deleteTodo(event) {
	const $parentList = event.target.closest('li')				// Find closest parent List Item of what was clicked
	$parentList.remove()
	
	const $todoList = document.querySelector('#todo-list')
	console.log($todoList);
	if ($todoList.children.length == 0) {
		document.querySelector('#btn-clear-all').classList.add('d-none')
		document.querySelector('#instructions').classList.remove('d-none')
	}
	
}

function displayEditTodoModal(event) {
	// Just displays the Edit Todo modal popup and sets the initial value to the Todo current description
	// Then adds a Submit handler for the modal edit Form (locally as a closure) which actually updates the edited Todo
	const $editTodoForm = document.getElementById('edit-todo-form')
	const $editTodoDescField = document.getElementById('edit-todo-desc')
	const $parentList = event.target.closest('li')				// Find closest parent List Item of the thing clicked

	// Find the child <span> of the List Item with the actual text by name (can't use ID since all the same)
	const $textSpan = $parentList.querySelector('[data-name=todo-text]')		// More standard perhaps, works every
	
	$editTodoDescField.value = $textSpan.innerText
	editTodoModal.show()								// Display the modal dialogue popup box (the X and Cancel buttons close it)
	$editTodoDescField.focus()							// Must set focus after it's displayed

	$editTodoForm.removeEventListener('submit', handleEditTodo)			// Remove any existing Handler in case the user didn't click OK (would cause duplicate Edits)

	// The handler for the Edit Todo Form is defined within this function as a closure over the $textSpan so it can update it (and $newTodoDescField)
	// But the function is available globally (so it can be removed) - var is declared above
	handleEditTodo = function(event) {
		event.preventDefault()	

		// const $newTodoDescField = document.getElementById('new-todo-desc')
		const inputValue = stripHTML($editTodoDescField.value).trim()				// or sanitizeHTML()
		if (inputValue != '' && inputValue != $textSpan.innerText) {
			$textSpan.innerText = inputValue
		}
		editTodoModal.hide()						// Hide the modal dialogue popup box having clicked OK (could also use .toggle() )
	}

	// Add our local Event Handler to actually update the Todo Description, which is automatically removed after being called once
	$editTodoForm.addEventListener('submit', handleEditTodo, {once: true} )
}
