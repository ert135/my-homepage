import Three from "./Three.js";

const canvas =
  document.querySelector(
    "#battle-background",
  );

if (!canvas) {
  throw new Error(
    "Could not find #battle-background canvas",
  );
}

new Three(canvas);