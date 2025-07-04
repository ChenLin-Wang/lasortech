#!/usr/bin/env -S deno run -A --watch
/** # LasorTech POS System
  * @module
  */
import { Program } from './program.ts';


const app = new Program();
for (const arg of Deno.args) {
    if (arg == 'host') {
        app.host();
    }
}
if (!app.server) await app.gui();

