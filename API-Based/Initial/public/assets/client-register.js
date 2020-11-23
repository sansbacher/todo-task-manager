// Client-Side Register code for the REST API
// Very similar to the Login code, could probably be combined into one...

// Initialization
const apiUrl = ''														// Blank will default to current host, if set make sure CORS is configured !!
const registerForm = document.querySelector('#register-form')
hookMessageTags()														// Three optional message display <P> tags

// Add Event Handlers
registerForm.addEventListener('submit', handleSubmitForm)				// Register new User form

// Event Handlers
async function handleSubmitForm(event) {
	// Combination Handler / Workflow function
	event.preventDefault()								// Stop Form's default submit/page refresh action
	clearMessages()										// Clear any existing messages if the user has interacted with the page
	const formData = getFormData(registerForm, true)	// The API trims leading/trailing spaces from passwords anyway
	let result = {message: ''}

	try {
		const response = await fetch(apiUrl + '/users', {			// No auth needed to register
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		})
		result = await response.json()			// Newly created user returned in .user, or an error message
		if (!response.ok) {
			throw `Failure creating new User! ${response.statusText} - ${response.status}`
		} 
		// The API will set an 'auth_token' Cookie automatically if successful
	} catch (err) {
		setCookie('auth_token', 'deleted', -1)			// Delete any existing auth cookies just in case
		message1.textContent = 'ERROR!'
		message2.textContent = err + " " + result.error
		message3.textContent = "Unable to POST new User request! Check name / email / password and try again!"
		throw message3.textContent
	}

	setCookie('task_manager_auth_token', result.token)				// Set session Cookie with the returned Token to submit with future requests via Headers
	window.location.href = "/"										// Redirect to the main page
}