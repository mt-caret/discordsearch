(function() {
  "use strict";

  const search_engine_radio = () => { return $("input[name='search_engine']"); }
  const settings_checkboxes = () => { return $("input[name='settings']"); }

  const i18nize = (str) => { return chrome.i18n.getMessage(str); }
  const localize_html = () => {
    $("#search_text").prop("placeholder", i18nize("search_text"));
    $("#search_button").val(i18nize("search_button"));
    settings_checkboxes().each(function() {
      $(this).siblings("span").text(i18nize($(this).val() + "_setting"));
    });
  }

  const apply_settings = (items) => {
    settings = items;
    search_engine_radio().filter(function(e){
      return $(this).val() === settings["search_engine"];
    }).prop("checked", true);

    search_engine_radio().on("click", function(){
      settings["search_engine"] = $(this).val();
      chrome.storage.sync.set({ 'search_engine': settings["search_engine"] }, () => {});
    });

    settings_checkboxes().each(function() {
      $(this).prop("checked", settings[$(this).val()]);
    });
  }

  let settings = {};
  chrome.storage.sync.get({
      "search_from_omnibox": false,
      "incognito_search_results": false,
      "search_engine": "Google"
    }, apply_settings);

  $(function(){
    localize_html();

    const search_form = $("#search_form");
    search_form.on("submit", function(e) {
      e.preventDefault();
      const search_words = $(this).find("input[name='search_words']").val();
      if (search_words.trim() === "") return;

      chrome.runtime.sendMessage({
        "action": "search",
        "search_engine": settings["search_engine"],
        "query": encodeURIComponent(search_words)
      });
      window.close();
    });

    settings_checkboxes().on("change", function() {
      const setting_name = $(this).val();
      let obj = {};
      obj[setting_name] = settings[setting_name] = $(this).prop("checked");
      chrome.storage.sync.set(obj, function(){});
    });
  });
})();
