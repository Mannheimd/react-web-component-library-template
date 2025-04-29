import r2wc from "@r2wc/react-to-web-component";

import { Counter } from "./src/";

const counterElement = r2wc(Counter, {
  props: { startCount: "number" },
});
customElements.define("counter-component", counterElement);
