(function() {
  "use strict";

  let settings = {};
  chrome.storage.sync.get({
      "incognito_search_results": false,
      "search_engine": "Google"
    }, (items) => { settings = items; });

  const build_search_url = (query, search_engine) => {
    return 'https://search.disconnect.me/searchTerms/search?query=' + query + '&ses=' + search_engine;
  }

  const get_hostname = (url) => {
    const l = window.document.createElement("a");
    l.href = url;
    return l.hostname;
  }

  const hijack_omnibox_search = (details) => {
    const url = details.url;

    //If search is conducted through omnibox, hijack query and add search
    //engine choice. (This assumes that the user has added Disconnect Search as
    //a search engine through the Chrome Settings as per README.md)
    const r = /^https:\/\/search\.disconnect\.me\/searchTerms\/search\?query=(.*?)&ses=dummy$/;
    const match = r.exec(url);
    const query_found = match !== null && match.length > 1 && match[1].trim() !== "";

    if (!query_found) return { cancel: false };

    const search_url = build_search_url(match[1].trim(), settings["search_engine"]);
    console.log("Search engine set: " + url + " -> " + search_url);
    return { redirectUrl:  search_url };
  }

  const handle_message = (request, sender, sendResponse) => {
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

  const load_events = () => {
    chrome.runtime.onInstalled.addListener((details) => {
      if(details.reason == "install") {
        chrome.tabs.create({ url: "https://github.com/mt-caret/discordsearch#stuff-to-be-aware-of" });
      } else if (details.reason == "update") {
        const thisVersion = chrome.runtime.getManifest().version;
        console.log("Update detected: " + details.previousVersion + " -> " + thisVersion + "!");
      }
    });
    chrome.storage.onChanged.addListener((changes, namespace) => {
      Object.keys(changes).forEach((key) => {
        settings[key] = changes[key].newValue;
      });
    });
    chrome.webRequest.onBeforeRequest.addListener(
      hijack_omnibox_search,
      { urls: [ "http://*/*", "https://*/*" ] },
      ['blocking']);
    chrome.runtime.onMessage.addListener(handle_message);
  }

  load_events();
})();
