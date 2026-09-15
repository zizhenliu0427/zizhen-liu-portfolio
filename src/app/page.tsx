export default function Home() {
  // A native refresh also works in the static export before JavaScript loads.
  return <>
    <meta httpEquiv="refresh" content="0;url=/rhine/index.html" />
    <noscript><a href="/rhine/index.html">Open Zizhen Liu&apos;s Rhine archive →</a></noscript>
  </>;
}
