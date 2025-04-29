# React Web Component Library with r2wc

This library is a baseline setup for creating React web components that can be consumed on any webpage, prioritising simplicity and developer convenience. Components are built in React and exposed using `react-to-web-component`. The components can then be added to any HTML page using their custom html tag.

The components in this library are functionally stand-alone and don't depend on logic from the consuming app, other than properties passed to the component on initialisation. The library doesn't provide CSS though, so the consuming app is responsible for styling (unless you add css into this library).

Be mindful of what packages you install. Everything, including React, is bundled into the output. The output could get excessively large, and could contain vulnerable packages that shouldn't be exposed in a browser.

Consuming the library is simple:

```html
<!-- Load the library -->
<script src=".../web-components.umd.js"></script>

<!-- Render the "Counter" component - the "start-count" attribute is passed as a prop into the component -->
<counter-component start-count="20"></counter-component>
```

## Developing

After cloning, don't forget to run `npm i`

Get started:

1. `npm run dev`
2. Open the Vite-hosted site
3. Make some components

Link into your external HTML file:

1. `npm run dev`
2. Point your external site at `./dist/web-components.umd.js`
3. Make some components
4. Hard reload (ctrl+shift+r) your webpage to see any changes

The app's main build output is the `./dist/web-components.umd.js` file. You can point your consuming site to this to use your custom components.
This doesn't give you hot-reload though, you have to do a hard reload to see any changes, so we also have a page in the library that lets you view and work on components.

In `package.json` you'll notice that the "dev" script uses `concurrently` to launch two processes: `"dev": "concurrently \"vite build --watch\" \"vite\""`

`vite build` builds the library into the `./dist` folder, and `--watch` means it will rebuild on any file change. That's as far as it goes though, it can't tell anything outside of this library that the file has changed which is why you have to hard-reload anything that's consuming them to see any changes.

`vite` does the normal thing of building the solution and hosting a server to run it as a web app, with all the normal hot-reload goodies.

`concurrently` runs them both in parallel, and you'll see them both printing messages into your terminal from builds or the browser console. This allows you to work on components easily with hot-reload, then seamlessly move over to testing them when embedded into your consuming site where you've got a little less quality of life.

The root `index.html` is different to a normal React app; there is no root element, and we don't directly call React to render our components. Within `index.html` you'll see the script tag `<script type="module" src="./web-components.ts"></script>` which initialises the solution, same as you would normally have, but the components are loaded using their custom html tag the same as they would be in the consuming app. They still behave as they would otherwise when developing, but now you can see how they will behave when rendered via r2wc.

## How it works

The React part is pretty standard, just create a component and export it like you normally would. There's nothing unusual there.

What's unusual is we're exposing our components as custom HTML elements using `react-to-web-component`: https://github.com/bitovi/react-to-web-component

As an example, this will expose our Counter component:

```ts
import r2wc from "@r2wc/react-to-web-component";
import { Counter } from "./src/";

// Creates a `CustomElementConstructor` for `Counter`, and configures the props that will be passed to it.
const counterElement = r2wc(Counter, {
  props: { startCount: "number" },
});

// Ties the element constructor to a custom element name
customElements.define("counter-component", counterElement);
```

The entry point for the library is `./web-components.ts`, head in and look for the custom element definitions. From there you'll have an understanding of how it's all plumbed together.

## Note on the single-file build output

This solution builds everything into one file because the custom config approach doesn't easily allow us to have auto-rebuild of the library file, and it's quite nice to be able to develop using hot-reload and also consume the library from an external page without having to switch build modes. We're choosing convenience over compartmentalisation, assuming that the library won't be that big.

If you need to start splitting your output up, look toward the end of this article for info on how to write a custom config: https://www.bitovi.com/blog/react-everywhere-with-vite-and-react-to-webcomponent.

There's also a really good example implementation here, which I took a lot of inspiration from: https://github.com/nicholasstparker/minimal-react-web-component/blob/main/vite-build.mjs

## Gotchas

### No Strict Mode

Because the web components aren't setting up using the normal React root, we don't have anywhere to add `<StrictMode>` on them.

See React's documentation about why this is important. You will probably miss a lot of avoidable bugs, and could even end up with a security hole:
https://react.dev/reference/react/StrictMode

You may want to configure your dev app to display two versions of your component - one with normal React rendering and `<StrictMode>` tags, and one using the custom element.

### Custom Element Naming

HTML has rules about valid names for custom elements. r2wc does tell you when you have invalid names, but it doesn't elaborate. See the rules here:
https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define#valid_custom_element_names

### Prop Naming

HTML attributes are `snake-cased`, but typescript props are `camelCased`. r2wc handles the conversion.

Prop in typescript is camel case:

```ts
export interface counterProps {
  startCount: number;
}
```

But the HTML attribute is snake case:

```html
<counter-component start-count="20"></counter-component>
```

### No prop validation

r2wc doesn't validate props, so you should handle null/undefined props on your components. If the consumer gets edgy and does something like passing a string instead of a number, you might have some issues.
