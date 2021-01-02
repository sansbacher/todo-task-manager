// Client-Side Application - LocalStorage Based (state saved in LocalStorage, ie: persists across sessions)
// Modified to use Modules and Reef, a lightweight reactive framework which updates the DOM when the data updates and a Mustache-like Placeholders function
// using embedded HTML templates (in the HTML file).
// Further modified to be more of a MVC type app:
//  The Reef Data Store holds the data Model
//  The Reef App renders the View of the data
//  The JS Handler Functions Control when the App renders the Data

// Scripts loaded with type="module" (and all imported modules) are deferred by default and 'use strict'; by default
import { placeholders } from './modules/utils.js'			// If using local paths (not URLs) must use a web server, not local files
// https://reefjs.com is: A lightweight library for creating reactive, state-based components and UI.
import Reef from 'https://cdn.jsdelivr.net/npm/reefjs/dist/reef.es.min.js'			// Web Based
// import Reef from './modules/reef.es.min.js'										// Local allows VSCode to get Type info

// Initialization
const localStorageKey = 'TaskManagerTodoItems'				// LocalStorage is Key:Value pairs, where Value is a String
const $todoList = document.getElementById('todo-list')		// The main Todo List div element (using $ to signify a DOM element)

// Load Templates from within the HTML
const todoCompleteTemplate = document.getElementById('todo-complete-template').innerHTML
const todoIncompleteTemplate = document.getElementById('todo-incomplete-template').innerHTML

// Setup the Reef Data Store, with getters and setters, which make it the Data Model (it manages all access to the data)
let todoStore = new Reef.Store({							// A Reef data store holds the main array for the todo list
	data: {
		todoItems: []
	},
	// Even with getters you can still access todoStore.data.todoItems, but can encapsulate data-specific functions
	// But could create more specific 'read' getters (like a 'length') - however they don't accept additional params (so no: 'getOne', id)
	getters: {
		export: function(props) {							// Call as: todoStore.get('export') to retrieve all todo items as a JSON string
			return JSON.stringify(props.todoItems);
		}
	},
	// If there are setters defined then you CAN'T just update todoStore.data.todoItems (data.* returns an immutable copy of the data)
	// So setters act as a sort of API: all data changes MUST go through a setter and define the ONLY ways to Change/Delete/Add data
	setters: {
		import: function(props, jsonString) {				// Call as: todoStore.do('import', someJsonStringData) to load in a JSON string of new todo Items
			props.todoItems = JSON.parse(jsonString)
		},
		checkTodo: function(props, id) {					// Call as: todoStore.do('checkTodo', idNumber)
			const index = props.todoItems.findIndex( (item) => item.id === id )
			props.todoItems[index].completed = !props.todoItems[index].completed				// toggle the completed property
		},
		editTodo: function(props, id, text) {
			const index = props.todoItems.findIndex( (item) => item.id === id )
			props.todoItems[index].description = text											// Reef automatically sanitizes input if it contains HTML
		},
		deleteTodo: function(props, id) {
			props.todoItems = props.todoItems.filter( (item) => item.id !== id )				// Remove it from the main array
		},
		deleteAll: function(props) {
			props.todoItems = []
		},
		addTodo: function(props, text ) {
			props.todoItems.push({
				description: text,
				completed: false,
				id: Date.now()			// Returns number of ms since Jan 1, 1970. Eg: 1599966102691
			})
		}
	}
})

// Add Event Handlers - which Control when/how the data is updated
document.querySelector('#input-form').addEventListener('submit', handleSubmitForm)				// Submit new Task form
$todoList.addEventListener('click', handleTodoListButtonClicks)									// Click handler for the whole List (Done, Edit, or Delete buttons)
$todoList.addEventListener('todoListShowHide', handleShowHideElements)							// Custom emitted Reef event to hide/display the Instructions/Clear All button

$todoList.addEventListener('render', () => {													// Reef 'render' event triggered when updating the DOM
		localStorage.setItem(localStorageKey, todoStore.get('export')) 							// Preserve state by saving todoItems to LocalStorage (export JSON string data)
})

document.getElementById('btn-clear-all').addEventListener('click', () => {						// Clear the whole List button
	todoStore.do('deleteAll')
})

document.addEventListener('DOMContentLoaded', () => {											// Initialization Handler for when DOM is complete
	// Retrieve existing todoItems from LocalStorage once the Document has loaded
	const existingContent = localStorage.getItem(localStorageKey)
	if (existingContent) {
		todoStore.do('import', existingContent)							// LocalStorage only stores/returns string data, import converts to an array of objects
	}
	todoApp.render()													// Not strictly needed, Reef now automatically renders
})

// Setup the Reef reactive App targeting the todo-list element, which renders the View of the Data whenever it is updated
let todoApp = new Reef($todoList, {					// Can also pass '#todo-list' and Reef will select it
	store: todoStore,								// The data Store
	template: function(props) {
		// Dynamically update the DOM based on the data/store [passed as props]
		// Returns the HTML string to be injected into the element, Reef diffs against the DOM to only update what has changed
		if (props.todoItems.length === 0) {
			Reef.emit($todoList, 'todoListShowHide', { emptyTodoList: true })		// Custom emitted Reef event with an event.detail payload
			return '';
		}

		// Generate the List Item HTML for each Todo Item
		const listItems = props.todoItems.map( (todo) => {
			if (todo.completed) {
				return placeholders(todoCompleteTemplate, todo);
			} else {
				return placeholders(todoIncompleteTemplate, todo);
			}
		})
		
		Reef.emit($todoList, 'todoListShowHide', { emptyTodoList: false })
		return '<ul class="w3-ul w3-padding-16 w3-rest">' + listItems.join('') + '</ul>';
	}
})

// Event Handlers
function handleSubmitForm(event) {
	event.preventDefault()		// Stop Form's default submit/page refresh action
	const input = document.querySelector('#input-field')
	const inputValue = input.value ? input.value.trim() : ''

	if (inputValue !== '') {
		todoStore.do('addTodo', inputValue)
	}
	input.focus()
	input.value = ''			// Clear the form
}

function handleTodoListButtonClicks(event) {
	const parentItemId = Number( event.target.parentElement.id.replace('item-','') )			// ID of the Parent of the button that was clicked (ie. the ListItem)

	// Determine if user clicked on one of the buttons
	switch (event.target.name) {
		case 'btn-check':
			return todoStore.do('checkTodo', parentItemId);
		case 'btn-edit':
			return editTodo(parentItemId);
		case 'btn-delete':
			return todoStore.do('deleteTodo', parentItemId);
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
function editTodo(id) {
	// Prompts the user for a new Description
	const todo = todoStore.data.todoItems.find( (item) => item.id === id )

	let input = window.prompt("Edit Todo item", todo.description)
	let inputValue = input ? input.trim() : ''
	if (inputValue !== '' && inputValue !== todo.description) {
		todoStore.do('editTodo', id, inputValue)
	}
}
