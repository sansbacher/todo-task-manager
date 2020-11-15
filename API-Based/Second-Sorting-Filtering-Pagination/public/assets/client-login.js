// Client-Side Login code for the REST API

// Initialization
const apiUrl = ''												// Blank will default to current host, if set make sure CORS is configured on the back-end!
const loginForm = document.querySelector('#login-form')
hookMessageTags()												// Three optional message display <P> tags

// Add Event Handlers
document.addEventListener('DOMContentLoaded', handlerDomLoaded)				// Initialization Handler for when DOM is complete
loginForm.addEventListener('submit', handleSubmitForm)						// Login form handler

// Event Handlers
 function handlerDomLoaded() {
	// Retrieve the saved email address for the login form
	const rememberedEmail = getCookie('task_manager_email')
	
	if (rememberedEmail != '') {
		document.querySelector('#email-field').value = rememberedEmail
		document.querySelector('#remember-checkbox').checked = true
	}
 }

async function handleSubmitForm(event) {
	// Combination Handler / Workflow function
	event.preventDefault()							// Stop Form's default submit/page refresh action
	clearMessages()									// Clear any existing messages if the user has interacted with the page
	const formData = getFormData(loginForm, true)	// The API trims leading/trailing spaces from passwords anyway
	let result;

	try {
		const response = await fetch(apiUrl + '/users/login', {			// No pre-existing Auth needed to login
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)			// Only email + password are needed, Any additional 'remember' field is ignored
		})
		if (response.ok) {
			// The API will set an 'auth_token' Cookie automatically
			result = await response.json()			// The logged in .user is returned
		} else {
			throw `Failure logging in! ${response.statusText} - ${response.status}`
		}
	} catch (err) {
		setCookie('auth_token', 'deleted', -1)						// Delete any existing auth cookies just in case
		setCookie('task_manager_auth_token', 'deleted', -1)
		message1.textContent = 'ERROR!'
		message2.textContent = err						// No .message is sent back
		message3.textContent = "Unable to POST Login request! Check email / password and try again!"
		throw message3.textContent
	}

	if (formData.remember) {
		setCookie('task_manager_email', result.user.email, 30)
	} else {
		setCookie('task_manager_email', 'deleted', -1)
	}
	
	setCookie('task_manager_auth_token', result.token)				// Set session Cookie with the returned Token to submit with future requests via Headers
	window.location.href = "/"										// Redirect to the main page
}