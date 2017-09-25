<!--
TODO: update repo description and URL, get pages turned on. index for pages? GIF
TODO: replace docs/ URLs with GH pages links
Todo: cmd-e type issues
tabb out, shift tab out
// - down:f, down:Alt, up:alt -> bug
cmd-tab*N back to Chrome
-->

# active-keys

Know and listen for which keys the user is currently holding down using standard [KeyboardEvent#key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) values.

`npm install --save active-keys`

- Even handles multiple of the same key held down (e.g. down right Alt, then down left Alt, and then up left Alt - will still indicate Alt down).
- Includes React helper.
- Requires support for [KeyboardEvent#key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key). 
- Will err on the side of indicating that a key is inactive.

[Live Example](docs/index.html)

[API Docs and Example Code](docs/api/)
