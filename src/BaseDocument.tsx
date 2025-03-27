import { html } from "hono/html";
import { Child } from "hono/jsx";

interface SiteData {
  title: string;
  children?: Child;
}

function BaseDocument(props: SiteData) {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/static/style.css" />
        <script src="https://unpkg.com/htmx.org@2.0.4"></script>
        <title>${props.title}</title>
      </head>
      <body hx-boost="true">
        ${props.children}
        <div id="details"></div>
      </body>
    </html>
  `;
}

export default BaseDocument;
