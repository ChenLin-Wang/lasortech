#!/usr/bin/env -S deno run -A --watch
/** # LasorTech POS System
  * @module
  */
import { Program } from './program.ts';


const app = new Program();
await app.gui();

