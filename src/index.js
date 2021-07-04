import Prism from "prismjs";
console.log(window.Prism, Prism);
import Main from "views/Main.svelte";

import "styles/main.scss";

const app = new Main({
  target: document.body,
  props: {
    name: "Svelte Webpack Base"
  }
});

export default app;
