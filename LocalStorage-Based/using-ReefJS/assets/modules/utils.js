// Utility functions Module

// Exported functions:

/**
 * Strips HTML tags from a user-submitted string. Not guaranteed to be secure.
 * @param {string} htmlString	The user-submitted string
 * @returns {string} 			The remaining non-HTML text
 */
function stripHTML(htmlString) {
	const STANDARD_HTML_ENTITIES = {		// If adding any update the final .replace() below
		nbsp: String.fromCharCode(160),
		amp: "&",
		quot: '"',
		apos: "'",
		lt: "<",
		gt: ">"
	}
	if (!htmlString) { return ''; }
	// This is just a simple RegEx version that works fairly well. DOM Tricks may lead to scripting attacks through.
	htmlString = htmlString.replace(/<style([\s\S]*?)<\/style>/gi, '')
		.replace(/<script([\s\S]*?)<\/script>/gi, '')
		.replace(/<\/div>/ig, '\n')
		.replace(/<\/li>/ig, '\n')
		.replace(/<li>/ig, '  *  ')
		.replace(/<\/ul>/ig, '\n')
		.replace(/<\/p>/ig, '\n')
		.replace(/<br\s*[\/]?>/gi, "\n")
		.replace(/<[^>]+>/ig, '')
		.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec) )
		.replace(/&(nbsp|amp|quot|apos|lt|gt);/g, (a, b) => STANDARD_HTML_ENTITIES[b] );
	return htmlString;
}

/**
 * Sanitize and encode all HTML in a user-submitted string (using the character code as in: &#xxxx;)
 * @see https://portswigger.net/web-security/cross-site-scripting/preventing
 * @param  {string} htmlString	The user-submitted string
 * @return {string}				The sanitized string
 */
function sanitizeHTML(htmlString) {
	if (!htmlString) { return ''; }
	return htmlString.replace(/[^\w. ]/gi,
		(c) => '&#' + c.charCodeAt(0) + ';'
	);
}

/** OLD VERSION (less secure):
	function sanitizeHTML(string) {
		// Returns the text with HTML converted quoted HTML - so includes the tags
		var dummyDiv = document.createElement('div')
		dummyDiv.textContent = string
		return dummyDiv.innerHTML;
	}
*/

/**
 * Replaces placeholders with real content, Requires get()
 * (c) 2019 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @see https://vanillajstoolkit.com/helpers/placeholders/
 * @tutorial https://gomakethings.com/a-vanilla-js-alternative-to-handlebarsjs-and-mustachejs/
 * @example
 * 	someElement.innerHTML = placeholders('<h1>Hello, {{name}}!</h1>', {name: 'World'});
 * @param {string} template The template string (or function that returns a string)
 * @param {object} data		An object where each {{property}} will be replaced in `template`, supports {{nested.objects}}
 * @returns {string}		The template with `data` placeholders replaced
 */
function placeholders(template, data) {
	'use strict';
	template = typeof (template) === 'function' ? template() : template;		// Check if the template is a string or a function
	if (['string', 'number'].indexOf(typeof template) === -1) throw 'PlaceholdersJS: please provide a valid template';
	if (!data) return template;						// If no data, return template as-is

	// Replace our curly braces with data
	template = template.replace(/\{\{([^}]+)\}\}/g, function (match) {
		match = match.slice(2, -2);					// Remove the wrapping curly braces
		let val = get(data, match.trim());			// Get the value
		if (!val) return '{{' + match + '}}';		// Replace
		return val;

	});
	return template;
}

// Internal functions:

/**
 * Get an object value from a specific path
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @see https://vanillajstoolkit.com/helpers/get/
 * @param  {Object}       obj  The object
 * @param  {String|Array} path The path
 * @param  {*}            def  A default value to return [optional]
 * @return {*}                 The value
 */
var get = function (obj, path, def) {

	/**
	 * If the path is a string, convert it to an array
	 * @param  {String|Array} path The path
	 * @return {Array}             The path array
	 */
	let stringToPath = function (path) {
		if (typeof path !== 'string') return path;		// If the path isn't a string, return it
		var output = [];								// Create new array

		path.split('.').forEach(function (item) {		// Split to an array with dot notation
			// Split to an array with bracket notation
			item.split(/\[([^}]+)\]/g).forEach(function (key) {
				if (key.length > 0) {					// Push to the new array
					output.push(key);
				}
			});
		});
		return output;
	};

	path = stringToPath(path);							// Get the path as an array
	let current = obj;									// Cache the current object
	// For each item in the path, dig into the object
	for (let i = 0; i < path.length; i++) {
		if (!current[path[i]]) return def;				// If the item isn't found, return the default (or null)
		current = current[path[i]];						// Otherwise, update the current  value
	}
	return current;
};

export { stripHTML, sanitizeHTML, placeholders }