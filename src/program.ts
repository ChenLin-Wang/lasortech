import * as wcws from "jsr:@svefro/win-console-window-state";
import { Webview } from "jsr:@webview/webview";
import sass from 'https://deno.land/x/denosass@1.0.6/mod.ts';
import { xml } from './codelang.ts';

/** ## Program
  * This class is responsible in rendering the graphical interface 
  */
export class Program {
    constructor() { }

    /** Size of a single unit in pixels */
    unit:number = 50;
    grainy:string = 'data:image/svg+xml;base64,'+btoa(new TextEncoder().encode(xml`
        <svg xmlns="http://www.w3.org/2000/svg" width="500" height="500">
            <filter id="noise" x="0" y="0">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
                <feBlend in2="SourceGraphic" mode="screen"/>
            </filter>
            <rect width="500" height="500" filter="url(#noise)" opacity="0.5"/>
        </svg>
    `).reduce((acc, byte) => acc + String.fromCharCode(byte), ''));
    /** Page style (SCSS) */
    style:string = /*css*/`
        body {
            background-color: #111;
            &::before {
                content: '';
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                filter: contrast(170%) brightness(50%);
                opacity: 0.5;
                background-image:url(${this.grainy});
                background-position: 0 0;
                background-repeat: repeat;
                background-size: 300px 300px;
                background-color:#11111f;
                box-shadow: inset 0 0 ${this.unit}px #1115;
            }
        }
    `;
    /** Page content (HTML) */
    page:string = xml`
        <!DOCTYPE html>
        <html>
            <head>
                <title>LasorTech</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, inital-scale=1.0">
                <style>${sass(this.style).to_string() as string}</style>
            </head>
            <body>
                
            </body>
        </html>
    `;


    async gui() {
        /* Set a unique console title and then find it to hide (SW_HIDE = 0) */
        await wcws.setCurrentConsoleWindowTitleIncludingDelay('DenoWebviewApp');
        wcws.findNamedConsoleWindowAndSetWindowState('DenoWebviewApp', 0);

        /* Create window */
        const view = new Webview();
        view.title = 'Lasortech';
        view.navigate(`data:text/html,${encodeURIComponent(this.page)}`);
        view.run();
    }
}