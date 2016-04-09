(function() {
  "use strict";

  let incognito = false;
  chrome.storage.sync.get("incognito_search_results", (items) => {
    incognito = items["incognito_search_results"];
  });

  const open_link = function(e) {
    if(!incognito) return;

    e.preventDefault();
    chrome.runtime.sendMessage({
      "action": "open_in_incognito",
      "url": this.href
    });
  }

  const load_listener = function() {
    const normal_results = document.getElementById("normal-results");
    if (normal_results === null) return;

    let results = normal_results.getElementsByTagName("a");
    for (let i = 0, all = results.length; i < all; i++) {
      results[i].addEventListener("click", open_link);
    }
  }

  load_listener();
})();
