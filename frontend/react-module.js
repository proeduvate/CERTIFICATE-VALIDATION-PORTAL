import React from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";

const mountNode = document.getElementById("reactModuleRoot");

if (mountNode) {
  function HeaderWidget() {
    const [now, setNow] = React.useState(() => new Date());

    React.useEffect(() => {
      const timerId = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(timerId);
    }, []);

    return React.createElement(
      "div",
      { className: "react-module-card" },
      React.createElement("span", { className: "react-module-tag" }, "React Module"),
      React.createElement("strong", null, "React is now mounted in this page"),
      React.createElement("p", null, `Live time: ${now.toLocaleTimeString()}`)
    );
  }

  const root = createRoot(mountNode);
  root.render(
    React.createElement(
      React.StrictMode,
      null,
      React.createElement(HeaderWidget)
    )
  );
}
