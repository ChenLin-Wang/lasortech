/** # LasorTech POS System
  * @module
  */
import { factory } from './element.ts';
import { App, Route } from './program.tsx';
import font from '../assets/LeagueSpartan.ttf' with { type:'bytes' };
import logo from '../assets/logo.jpg' with { type:'bytes' };

<App name="LasorTech">
    <Route path="/LeagueSpartan.ttf" data={font} />
    <Route path="/logo.jpg" data={logo} />
    <h1>Hello LasorTech</h1>
</App>
