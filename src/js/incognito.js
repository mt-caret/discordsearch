var incognito = false;
chrome.storage.sync.get("incognito_search_results", function(items) {
	incognito = items["incognito_search_results"];
});

function open_link(e) {
	if(!incognito) return;

	e.preventDefault();
	chrome.runtime.sendMessage({
		"action": "open_in_incognito",
		"url": this.href
	});	
}

function load_listener() {
	var normal_results = document.getElementById("normal-results");
	if (normal_results === null) return;
	
	var results = normal_results.getElementsByTagName("a");
	for (var i = 0, all = results.length; i < all; i++) {
		results[i].addEventListener("click", open_link);
	}
}

load_listener();