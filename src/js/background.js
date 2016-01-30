var settings = {};
chrome.storage.sync.get({
    "search_from_omnibox": false,
    "incognito_search_results": false,
    "search_engine": "Google"
  }, function(items) { settings = items; });

function build_search_url(query, search_engine) {
  return 'https://search.disconnect.me/searchTerms/search?query=' + query + '&ses=' + search_engine;
}

function get_hostname(url) {
  var l = window.document.createElement("a");
  l.href = url;
  return l.hostname;
}

String.prototype.contains = function(it) { return this.indexOf(it) != -1; };

function hijack_omnibox_search(details) {
  var url = details.url;
  var google = get_hostname(url).contains(".google.")

  //Attempt to block search term leakage only when search from omnibox is set
  //as it kills Google Instant search functionality. Assumes default search
  //provider is Google.
  if (!settings["search_from_omnibox"] || !google) { return { cancel: false }; }

  //Block Google Instant search term leakage.
  var block = url.contains("/s?") || url.contains("/complete/search?") || url.contains("sourceid=chrome-instant");
  if(block) {
    console.log("Blocked: " + url);
    return { cancel: true };
  }

  //If query is found, extract and proxy search to Disconnect.
  var match = /[?|&]q=(.*?)(&|$)/.exec(url);
  var query_found = match !== null && match.length > 1 && match[1].trim() !== "";
  var search_from_omnibox = url.contains("es_sm=");
  if (query_found && search_from_omnibox) {
    var search_url = build_search_url(match[1].trim(), settings["search_engine"]);
    console.log("Redirected: " + url + " -> " + search_url);
    return { redirectUrl:  search_url };
  }

  return { cancel: false };
}

function handle_message(request, sender, sendResponse) {
  console.log("Message recieved: " + request.action);
  switch (request.action) {
    case "search":
      chrome.tabs.create({ url: build_search_url(request.query, request.search_engine) });
      break;
    case "open_in_incognito":
      chrome.windows.create({ url: request.url, incognito: true });
      break;
  }
}

function load_events() {
  chrome.runtime.onInstalled.addListener(function(details) {
    if(details.reason == "install") {
      chrome.tabs.create({ url: "https://github.com/mt-caret/discordsearch#stuff-to-be-aware-of" });
    } else if (details.reason == "update") {
      var thisVersion = chrome.runtime.getManifest().version;
      console.log("Update detected: " + details.previousVersion + " -> " + thisVersion + "!");
    }
  });
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (key in changes) { settings[key] = changes[key].newValue; }
  });
  chrome.webRequest.onBeforeRequest.addListener(
    hijack_omnibox_search,
    { urls: [ "http://*/*", "https://*/*" ] },
    ['blocking']);
  chrome.runtime.onMessage.addListener(handle_message);
}

function initialize() {
  load_events();
}

initialize();
