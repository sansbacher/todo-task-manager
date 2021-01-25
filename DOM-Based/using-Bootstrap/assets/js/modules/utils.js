// Utility functions Module

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

export { stripHTML, sanitizeHTML }