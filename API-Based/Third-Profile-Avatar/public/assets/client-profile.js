// Client-Side Profile code for the REST API

// Initialization
const apiUrl = ''															// Blank will default to current host, if set make sure CORS is configured on the back-end!
const authToken = 'Bearer ' + (getCookie('auth_token') || getCookie('task_manager_auth_token'))		// Grab the Token from either the back-end set Cookie or one we've set
const profileForm = document.querySelector('#profile-form')
const diagForm = document.querySelector('#diag-form')						// Strictly for testing / diagnostics (not actually useful in the real world) Injects fake Tasks
const avatarForm = document.querySelector('#avatar-form')					// Avatar logo upload From
const logoProfilePic = document.querySelector('#profile-pic')				// The logo / profile (avatar) picture
const originalLogoUrl = logoProfilePic.src									// To save the original logo picture URL
var userProfile = {}														// Will hold the current User's Profile
hookMessageTags()															// Three optional message display <P> tags

// Add Event Handlers
document.addEventListener('DOMContentLoaded', handlerDomLoaded)									// Initialization Handler for when DOM is complete
profileForm.addEventListener('submit', handleSubmitProfileForm)									// Profile form handler
diagForm.addEventListener('submit', handleInjectTasks)											// Diag/Test form to inject dummy tasks
document.querySelector('#btn-del-profile').addEventListener('click', handleDeleteProfile)		// Delete Profile button
document.querySelector('#btn-logout-all').addEventListener('click', handleLogoutAll)			// Logout All Sessions button
avatarForm.addEventListener('submit', handleSubmitAvatarForm)									// Avatar Profile Pic upload Form
document.querySelector('#btn-del-avatar').addEventListener('click', handleDeleteAvatar)			// Delete Profile button

// Event Handlers
async function handlerDomLoaded() {
	// Retrieve User's Profile from the API once the Document has loaded
	try {
		let response = await fetch(apiUrl + '/users/me', {			// GET is the default Fetch method
			credentials: 'include',
			headers: { Authorization: authToken }
		})
		if (response.ok) {
			userProfile = await response.json()						// Parse the returned JSON from the returned Body
			
			// Check if there's a Profile Pic / Avatar we can use
			response = await fetch(apiUrl + `/users/${userProfile._id}/avatar`)			// Authentication is not needed to GET avatar pics
			if (response.ok) {					// We just need to know IF it exists; using HEAD or including a .hasAvatar Property on the User model would be even better
				logoProfilePic.src = response.url				// No auth required, URL will return the actual PNG image
				logoProfilePic.classList.add('sa-avatar-img')
			} else {
				console.log('Expected 404 - no Avatar picture found')		// Not shown to the user, but browsers log the failed fetch() request...
			}
		} else {
			throw `Failed to retrieve Profile data! ${response.statusText} - ${response.status} for ${response.url}`
		}
	} catch (err) {
		message1.textContent = 'ERROR!'
		message2.textContent = err
		message3.textContent = "Unable to GET User Profile! Logout and Login then try again!"
		throw message3.textContent
	}

	if (Object.keys(userProfile).length > 0) {
		document.querySelector('#name-field').value = userProfile.name
		document.querySelector('#email-field').value = userProfile.email
		if (userProfile.age && userProfile.age != 0) { document.querySelector('#age-field').value = userProfile.age.toString() }		// Default is 0, and if set to 0 will clear it
	}
 }

async function handleSubmitProfileForm(event) {
	// Combination Handler / Workflow function
	event.preventDefault()							// Stop Form's default submit/page refresh action
	clearMessages()									// Clear any existing messages if the user has interacted with the page
	let formData = getFormData(profileForm, true)	// The API trims leading/trailing spaces from passwords anyway
	let result;

	removeEmptyProperties(formData)
	let updateEmailCookie = getCookie('task_manager_email') == userProfile.email ? true : false;

	try {
		// Update the User's profile
		const response = await fetch(apiUrl + '/users/me', {
			credentials: 'include',
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: authToken
			},
			body: JSON.stringify(formData)
		})
		result = await response.json()			// The Updated user is returned
		if (!response.ok) {
			throw `Failure Updating User Profile! ${response.statusText} - ${response.status}`
		}
	} catch (err) {
		message1.textContent = 'ERROR!'
		message2.textContent = err + " " + result.message
		message3.textContent = "Unable to PATCH User Profile! Check name, email, password, or age and try again!"
		throw message3.textContent
	}

	message1.textContent = 'SUCCESS!'
	message2.textContent = 'Updated your User Profile'
	if (updateEmailCookie) { setCookie('task_manager_email', result.email) }

}

async function handleLogoutAll(event) {
	// Combination Handler/Workflow
	clearMessages()
	try {
		const response = await fetch(apiUrl + '/users/logoutAll', {
			credentials: 'include',
			method: 'POST',
			headers: { Authorization: authToken }
		})
		if (!response.ok) {
			throw `Failed to logout all Sessions! ${response.statusText} - ${response.status}`
		}
		message1.textContent = 'SUCCESS!'
		message2.textContent = 'All your Sessions have been logged out'
		message3.textContent = 'You will be returned to the login page in 3 seconds'
		setCookie('task_manager_auth_token', 'deleted', -1)				// Our Cookie so we must remove it
		setTimeout( () => {
			window.location.href = "login.html"
		}, 3000)
	} catch (err) {
		// User can try again perhaps
		message1.textContent = 'ERROR!'
		message2.textContent = err
		message3.textContent = 'Unable to POST logout all Sessions!'
		throw message3.textContent
	}
}

async function handleDeleteProfile(event) {
	// Combination Handler/Workflow
	clearMessages()

	let confirm = window.confirm("Click OK to delete your Profile")
	if (!confirm) { return; }

	try {
		const response = await fetch(apiUrl + '/users/me', {
			credentials: 'include',
			method: 'DELETE',
			headers: { Authorization: authToken }
		})
		if (!response.ok) {
			throw `Failed to delete Profile! ${response.statusText} - ${response.status}`
		} 
		setCookie('task_manager_auth_token', 'deleted', -1)				// Our Cookie so we must remove it
		setCookie('auth_token', 'deleted', -1)							// Remove just in case
		message1.textContent = 'SUCCESS!'
		message2.textContent = 'Your Profile has been deleted'
		message3.textContent = 'You will be returned to the main page in 3 seconds'
		setTimeout( () => {
			window.location.href = "login.html"
		}, 3000)
	} catch (err) {
		// User can try again perhaps
		message1.textContent = 'ERROR!'
		message2.textContent = err
		message3.textContent = 'Unable to DELETE Profile!'
		throw message3.textContent
	}
}

async function handleInjectTasks(event) {
	// Testing / Diagnostics form: asks the user if they want to inject a bunch of dummy tasks
	event.preventDefault()
	clearMessages()

	let input = window.prompt("How many dummy tasks do you want to Add? (max 50)", '10')
	let inputValue = input ? parseInt(input) : 0
	if (isNaN(inputValue) || inputValue <= 0) { return; }
	if (inputValue > 50) { inputValue = 50 }

	let fakeTasks = []
	for (let i = 1; i <= inputValue; i++) {
		fakeTasks.push({
			description: generateMadLibTask(),
			completed: Math.floor(Math.random() * 3) ? false : true				// Task is not completed more often than it is
		})
	}

	try {
		const allPosts = fakeTasks.map( item => fetch(apiUrl + '/tasks/', {		// An array of Promises
				credentials: 'include',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: authToken
				},
				body: JSON.stringify(item)
			})
		)
		const allResponses = await Promise.all(allPosts)						// Promise.allSettled() does not exist/work in Legacy Edge
		if ( !allResponses.every( response => response.ok ) ) {
			allResponses.forEach( response => { 
				if (!response.ok) { console.log('Failed to add dummy Task: ' + response.url) } 
			})
			throw "Unable to add at least one dummy Task!"
		}
	} catch (err) {
		message1.textContent = 'ERROR!'
		message2.textContent = err
		message3.textContent = "Unable to POST all Dummy Tasks!"
		throw message3.textContent
	}
	// We don't care about the actual responses since there's no DOM on this page to update
	message1.textContent = 'SUCCESS!'
	message2.textContent = `Added ${inputValue} dummy Tasks`
	message3.textContent = "Click 'Home' to see them."
}

async function handleDeleteAvatar(event) {
	// Remove a Profile Picture
	event.preventDefault()
	clearMessages()				// Though there is currently no "success/failure" returned

	try {
		const response = await fetch(apiUrl + '/users/me/avatar', {
			credentials: 'include',
			method: 'DELETE',
			headers: {
				Authorization: authToken
			}
		})
		if (!response.ok) {
			throw "Unable to remove Avatar!"		// May never get here, right now API always sends a 200 response
		}
	} catch (err) {
		message1.textContent = 'ERROR!'
		message2.textContent = err
		message3.textContent = "Unable to DELETE avatar picture!"
		console.log(message3.textContent)
	}

	// No 'SUCCESS' message, we'll just change the picture back to the logo either way
	logoProfilePic.src = originalLogoUrl
	logoProfilePic.classList.remove('sa-avatar-img')
}

async function handleSubmitAvatarForm(event) {
	// Combination Handler / Workflow function
	event.preventDefault()							// Stop Form's default submit/page refresh action
	clearMessages()									// Clear any existing messages if the user has interacted with the page
	const formData = new FormData(avatarForm)
	
	try {
		if (formData.get('avatar').name == '') {
			throw "Please select a max 1MB image file in JPG or PNG format before Uploading!"
		}

		const response = await fetch(apiUrl + '/users/me/avatar', {
			credentials: 'include',
			method: 'POST',
			headers: {
				Authorization: authToken
			},
			body: formData
		})
		if (response.ok) {
			logoProfilePic.src = apiUrl + `/users/${userProfile._id}/avatar?refresh=${new Date().getTime()}`			// Force browser to refresh the image in case we're changing not adding (same URL)
			logoProfilePic.classList.add('sa-avatar-img')
		} else {
			const result = await response.json()
			throw `Unable to upload avatar picture - ${result.error}`
		}
	} catch (err) {
		message1.textContent = 'ERROR!'
		message2.textContent = err
		message3.textContent = "Unable to POST avatar picture!"
		throw message3.textContent
	}
}

// Local Utility functions
function getRandItem(list) {
	// Returns a random element from an array
	return list[Math.floor(Math.random() * list.length)];
}

function generateMadLibTask() {
	// Generates a random Mad-Lib style Task name like: Quickly eat 14 smelly sandwiches!
	const adverbs = ['Angrily', 'Awkwardly', 'Boastfully', 'Boldly', 'Bravely', 'Cheerfully', 'Dramatically', 'Eagerly', 'Elegantly', 'Foolishly',
		'Gleefully', 'Gracefully', 'Hopelessly', 'Jealously', 'Merrily', 'Nervously', 'Politely', 'Poorly', 'Quickly', 'Rapidly',
		'Rudely', 'Safely', 'Selfishly', 'Silently', 'Slowly', 'Solemnly', 'Sternly', 'Tediously', 'Vivaciously', 'Wearily']
	const verbs = ['act like', 'approve', 'arrange', 'break', 'build', 'buy', 'coach', 'colour', 'create', 'cry over', 'dance like',
		'describe', 'draw', 'drink', 'eat', 'imitate', 'invent', 'jump over', 'laugh at', 'listen to', 'paint', 'plan for', 'play with',
		'read to', 'replace', 'run from', 'scream at', 'shop for', 'shout at', 'sing for', 'study', 'teach', 'touch', 'write', 'whistle for', 'zip up']
	const adjectives = ['adorable', 'angry', 'awful', 'beautiful', 'busy', 'cheerful', 'clumsy', 'cowardly', 'crabby', 'cranky', 'crazy',
		'crispy', 'deep', 'dull', 'excited', 'foul', 'friendly', 'fussy', 'fuzzy', 'gloomy', 'glowing', 'grimy', 'happy', 'hardworking',
		'heavy', 'huge', 'joyful', 'lazy', 'long', 'lumpy', 'messy', 'mighty', 'nimble', 'plump', 'plush', 'rusty', 'scared', 'shining',
		'silly', 'slimy', 'sloppy', 'small', 'smelly', 'smooth', 'sparkling', 'spiky', 'stinky', 'sturdy', 'tiny', 'wild', 'worried', 'wrinkly']
	const pluralNouns = ['aircraft', 'babies', 'balls', 'bananas', 'boats', 'boxes', 'brooms', 'buses', 'cacti', 'Canadians', 'cars',
		'cats', 'children', 'cities', 'corn cobs', 'daisies', 'deer', 'dogs', 'dragons', 'elves', 'feet', 'fish', 'geese', 'goats', 'houses',
		'knives', 'leaves', 'lives', 'loaves', 'mice', 'oxen', 'people', 'pirates', 'potatoes', 'rivers', 'sandwiches', 'sheep', 'spies', 'tanks',
		'teeth', 'theses', 'toasters', 'tomatoes', 'whiskers']
	const quantity = Math.floor(Math.random() * (Math.floor(25) - 2)) + 2		// Random number from 2 - 24 (inclusive)
	const ending = Math.floor(Math.random() * 3) ? '!' : '.'					// ! more often than .

	return `${getRandItem(adverbs)} ${getRandItem(verbs)} ${quantity} ${getRandItem(adjectives)} ${getRandItem(pluralNouns)}${ending}`;
}
