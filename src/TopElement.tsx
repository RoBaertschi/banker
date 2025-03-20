const TopElement = () => {
  return (
    <>
      <h1 hx-on:click="window.location.href='/'" className="cursor-pointer">
        <span>Banker</span>
        <span className="htmx-indicator" />
      </h1>
      <p>
        Build using <a href="https://htmx.org/">htmx</a>.
      </p>
    </>
  );
};

export default TopElement;
