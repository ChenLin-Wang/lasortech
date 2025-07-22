import { factory, Element } from './element.ts';
import { App } from './program.tsx';
const app:Element = <App name="My App">
    <h1>Hello World</h1>
</App>

console.log('APP:', app.render());