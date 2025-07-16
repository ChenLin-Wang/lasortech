/** @jsx Dalx.jsx */
import { Dalx } from "https://raw.githubusercontent.com/jasouza-git/dalx/main/mod.ts";
import { Page } from "./page.tsx";

export class Sidebar extends Dalx {
  override content(req: Request | null) {
    const path = Page.focus(req);
    return (
      <div id="side">
        {Page.pages.map((x) => (
          <a data={x.id} href={'/'+x.id} class={path == x.id ? 'on' : ''}>
            {x.name}
          </a>
        ))}
      </div>
    );
  }
}
