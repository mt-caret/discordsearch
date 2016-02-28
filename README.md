# Discord Search

![Screenshot](screenshot.png)

A better [Disconnect Search](https://www.disconnect.me/search) browser extension.

## Why not the [official extension](https://github.com/disconnectme/search)?

A quick look at the code showed some suspicious stuff;
the extension phoning home with statistics, way too many unused permissions,
and weird "adblock" dead code, just to name a few.

I also feel that privacy and security related code should be kept as readable
and concise as possible, so I rewrote (almost) everything from scratch.

## Differences from the original

- old version of jQuery -> newest version of Zepto.js
- bloated -> minimum permissions
- Firefox & Chrome -> Chrome only (help needed here too!)

## Additional Features

- i18n support

The only supported languages right now are English and Japanese, so PRs are
welcome.

- compatibility with IMEs

Pressing the enter key to confirm conversions will not trigger searches!

## TODO

- publish to Chrome Web Store
- add comments + refactor for readability
- investigate search form hijacking
- license
- [add shortcut to open browser
  action](https://developer.chrome.com/apps/commands)

## Stuff To Be Aware Of

- This extension is a work in progress, so **do NOT trust this as a secure/private
alternate** to the original extension (yet). Expect breakages as well.

- The original extension blocked various forms of search term leakage regardless
of settings, and broke a few of Google's services (like Inbox search). Discord
Search only blocks when the "search from the address bar" option is set and is
much more conservative in terms of blocking. This means more possible leakage,
but not necessarily no breakage, so beware!

- As DuckDuckGo is a [privacy oriented search engine](https://duckduckgo.com/privacy), search queries
go directly to them unlike other search engines which are proxied through Disconnect.

- While the author is not affiliated in any way with Disconnect, they are the ones
who make private searches possible, so please
[support them](https://disconnect.me/disconnect/welcome/premium/search)!
