// Client-Side Application - LocalStorage Based (state saved in LocalStorage, ie: persists across sessions)
// Modified to use Modules and Reef, a lightweight reactive framework which updates the DOM when the data updates

// Scripts loaded with type="module" (and all imported modules) are deferred by default and 'use strict'; by default
import { sanitizeHTML, stripHTML } from './modules/utils.js'		// If using local paths (not URLs) must use a web server, not local files
// https://reefjs.com is: A lightweight library for creating reactive, state-based components and UI.
import Reef from 'https://cdn.jsdelivr.net/npm/reefjs/dist/reef.es.min.js'			// Web Based
// import Reef from './modules/reef.es.min.js'												// Local allows VSCode to get Type info

// Initialization
const localStorageKey = 'TaskManagerTodoItems'			// LocalStorage is Key:Value pairs, where Value is a String
const $todoList = document.getElementById('todo-list')	// The main Todo List div element (using $ to signify a DOM element)

// Add Event Handlers - many are very short now and can be written inline
document.querySelector('#input-form').addEventListener('submit', handleSubmitForm)				// Submit new Task form
$todoList.addEventListener('click', handleTodoListButtonClicks)									// Click handler for the whole List (Done, Edit, or Delete buttons)
$todoList.addEventListener('todoListShowHide', handleShowHideElements)							// Custom emitted Reef event to hide/display the Instructions/Clear All button

$todoList.addEventListener('render', () => {													// Reef 'render' event triggered when updating the DOM
		localStorage.setItem(localStorageKey, JSON.stringify(todoApp.data.todoItems)) 		// Preserve state by saving todoItems to LocalStorage
})

document.getElementById('btn-clear-all').addEventListener('click', () => {						// Clear the whole List button
	todoApp.data.todoItems = []
})

document.addEventListener('DOMContentLoaded', () => {											// Initialization Handler for when DOM is complete
	// Retrieve existing todoItems from LocalStorage once the Document has loaded
	const existingContent = localStorage.getItem(localStorageKey)
	if (existingContent) {
		todoApp.data.todoItems = JSON.parse(existingContent)			// LocalStorage can only save String data
	}
	todoApp.render()													// Not strictly needed, Reef now automatically renders
})

// Setup the Reef reactive app targeting the todo-list element
let todoApp = new Reef($todoList, {					// Can also pass '#todo-list' and Reef will select it
	data: {											// A Reef's data object holds the main array for the todo list
		todoItems: []
	},
	template: function (props) {
		// Dynamically update the DOM based on the data/store [passed as props]
		// Returns the HTML string to be injected into the element, Reef diffs against the DOM to only update what has changed
		if (props.todoItems.length === 0) {
			Reef.emit($todoList, 'todoListShowHide', { emptyTodoList: true })		// Custom emitted Reef event with an event.detail payload
			return '';
		}

		const listItems = props.todoItems.map( (todo) => {
			let btnChecked = ''
			let classStrikeThrough = ''
			if (todo.completed) {
				btnChecked = 'checked="checked"'
				classStrikeThrough = 'w3-text-grey sa-text-line-through'
			}
			return `<li class="w3-container" id="item-${todo.id}">
				<input type="checkbox" name="btn-check" class="w3-check w3-margin-right w3-padding-small w3-large" ${btnChecked}>
				<span name="todo-text" class="${classStrikeThrough}">${todo.description}</span>
				<button name="btn-delete" class="w3-right w3-margin-left w3-padding-small sa-no-focus-outline w3-hover-theme w3-border-0 w3-large w3-hover-border-theme"><i class="fa fa-trash-o sa-no-pointer-events"></i></button>
				<button name="btn-edit" class="w3-right w3-margin-left w3-padding-small sa-no-focus-outline w3-hover-theme w3-border-0 w3-large w3-hover-border-theme"><i class="fa fa-pencil sa-no-pointer-events"></i></button>
			</li>`;
		})
		
		Reef.emit($todoList, 'todoListShowHide', { emptyTodoList: false })
		return '<ul class="w3-ul w3-padding-16 w3-rest">' + listItems.join('') + '</ul>';
	}
})

// Event Handlers
function handleSubmitForm(event) {
	event.preventDefault()		// Stop Form's default submit/page refresh action
	const input = document.querySelector('#input-field')
	const inputValue = stripHTML(input.value).trim()			// NO need for sanitizeHTML() as Reef automatically sanitizes HTML, but I'd prefer to strip it off

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

function handleShowHideElements(event) {
	// Triggered by the custom event emitted by Reef on DOM updates, custom event.detail payload passed
	// Show/Hide the Clear All button and the Instructions (they end up being mutually exclusive)
	if (event.detail.emptyTodoList) {
		document.querySelector('#instructions').classList.remove('w3-hide')		
		document.querySelector('#btn-clear-all').classList.add('w3-hide')		// Safe, can't add class more than once
	} else {
		document.querySelector('#instructions').classList.add('w3-hide')		// The Instructions are only shown if there's NO todo items
		document.querySelector('#btn-clear-all').classList.remove('w3-hide')	// Only show Clear All if there's something to clear
	}
}

// Workflow functions
function addTodo(text) {
	const todo = {
		description: text,
		completed: false,
		id: Date.now()			// Returns number of ms since Jan 1, 1970. Eg: 1599966102691
	}

	todoApp.data.todoItems.push(todo)
}

function checkTodo(id) {
	const index = todoApp.data.todoItems.findIndex( (item) => item.id == id )

	todoApp.data.todoItems[index].completed = !todoApp.data.todoItems[index].completed			// toggle the completed property
}

function deleteTodo(id) {
	todoApp.data.todoItems = todoApp.data.todoItems.filter( (item) => item.id != id )			// Remove it from the main array
}

function editTodo(id) {
	const index = todoApp.data.todoItems.findIndex( (item) => item.id == id )

	let input = window.prompt("Edit Todo item", todoApp.data.todoItems[index].description)
	let inputValue = input ? stripHTML(input).trim() : ''			// NO need for sanitizeHTML() as Reef sanitizes HTML, but I'd rather strip it off
	if (inputValue != '' && inputValue != todoApp.data.todoItems[index].description) {
		todoApp.data.todoItems[index].description = inputValue
	}
}
