// Utility functions Module

function stripHTML(html) {
	// In a browser, can use DOM tricks. In Node can find one of several HTML to Text packages
	// This is just a simple RegEx version that works fairly well. DOM Tricks may lead to scripting attacks through.
	if (!html) { return '' }
	const STANDARD_HTML_ENTITIES = {		// If adding any update the final .replace() below
		nbsp: String.fromCharCode(160),
		amp: "&",
		quot: '"',
		apos: "'",
		lt: "<",
		gt: ">"
	};
	html = html.replace(/<style([\s\S]*?)<\/style>/gi, '')
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

	return html
}

function sanitizeHTML(string) {
	// Returns the text with HTML converted quoted HTML - so includes the tags
	var dummyDiv = document.createElement('div')
	dummyDiv.textContent = string
	return dummyDiv.innerHTML
}

export { stripHTML, sanitizeHTML }