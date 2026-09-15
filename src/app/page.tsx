import Script from "next/script";

export default function Home() {
  // Mount the standalone Rhine app directly at the portfolio root. The
  // generated aliases keep the hashed Vite assets behind stable URLs.
  return <>
    <style>{'@import url("/rhine-root.css");'}</style>
    <main id="viewport"><div id="stage" /></main>
    <noscript><p>JavaScript is required to open the Rhine archive.</p></noscript>
    <Script src="/rhine-root.js" strategy="afterInteractive" type="module" />
  </>;
}
