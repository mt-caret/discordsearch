# Discord Search

A [Disconnect Search](https://www.disconnect.me/search) browser extension.

## Why not the [official extension](https://github.com/disconnectme/search)?

A quick look at the code showed some susupicious stuff;
the extension phoning home with statistics, way too many unused permissions,
and weird "adblock" dead code, just to name a few.

I also feel that privacy and security related code should be kept as readable
and concise as possible, so I rewrote (almost) everything from scratch.

## Differences from the original

- old version of jQuery -> newest version of Zepto.js
- bloated -> minimum permissions
- Firefox & Chrome -> Chrome only (help needed here too!)

## TODO

- fix search engine hijacking functionality, or get rid of it
- publish to Chrome Web Store
- toggle Google Instant Search blocking off when options are not selected
- 18n & l10n
- add comments + refactor for readability
- Google Closure Compiler
- investigate search form hijacking

## Stuff To Be Aware Of

- This extension is a work in progress, so **do NOT trust this as a secure/private
alternate** to the original extension (yet). Expect breakages as well.

- The original extension does a reasonable job blocking search term leakage to
Google, but also breaks a few of Googles' services (like Inbox search).
Discord Search is conservative in terms of blocking, but that means more possible
leakage, and not necessarily no breakage, so beware!

- As DuckDuckGo is a [privacy oriented search engine](https://duckduckgo.com/privacy), search queries
go directly to them, unlike other search engines which are proxied through Disconnect.

- All requests to Disconnect have a ```discord=true``` parameter attached to the URL.
If you don't like that, change ```extension_identifier``` to something else in ```background.js```.

- While the author is not affiliated in any way with Disconnect, they are the ones
who make private searches possible, so please
[support them](https://disconnect.me/disconnect/welcome/premium/search)!
