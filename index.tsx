#!/usr/bin/env -S deno run --unstable-raw-imports -A --watch
/** Dalx */
import {
  App,
  Dalx,
  Route,
} from "https://raw.githubusercontent.com/jasouza-git/dalx/main/mod.ts";

/** Components */
import { Page, Action } from "./components/page.tsx";
import { Sidebar } from './components/sidebar.tsx';

/** Assets */
import logo from "./assets/logo.xml" with { type: "text" };
import style from "./assets/style.css" with { type: "text" };
import leaguespartan from "./assets/LeagueSpartan.ttf" with { type: "bytes" };
import fontawesome from "./assets/fa-solid.ttf" with { type: "bytes" };
import icon from "./assets/logo.ico" with { type: "bytes" };

/** Main */
Dalx.run((x) => eval(x));

const app: App = (
  <App name="LasorTech" host style={style}>
    {/* ----- Assets ----- */}
    <Route path="/favicon.ico" data={icon} />
    <Route path="/assets/LeagueSpartan.ttf" data={leaguespartan} />
    <Route path="/assets/fa-solid.ttf" data={fontawesome} />

    {/* ---- Sidebar ----- */}
    {logo}
    <Sidebar />

    {/* ----- Pages ----- */}
    <Page name="Dashboard">
      <Action name="Start New Return" icon="e4c7" text="Sumbit a return request on a recent purchase"/>
    </Page>
    <Page name="New Return">
    </Page>
    <Page name="Track RMA">
    </Page>
    <Page name="Confirm Return (Admin)">
    </Page>
    <Page name="Refund/Replace"></Page>
    <Page name="Return Issue"></Page>
    <Page name="Settings"></Page>
  </App>
);
