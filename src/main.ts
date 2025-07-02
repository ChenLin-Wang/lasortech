#!/usr/bin/env -S deno run -A
/** # LasorTech POS System
  * @module
  */
import { xml } from './xml.ts';
import { Program } from './program.ts';


const _window = await new Program(xml`
    <h1>Hello World</h1>
`).init();

