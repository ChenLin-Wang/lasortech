#!/usr/bin/env -S deno test -A --watch
import * as wcws from "jsr:@svefro/win-console-window-state";
import { Webview } from "jsr:@webview/webview";
import sass from 'https://deno.land/x/denosass@1.0.6/mod.ts';
import { xml } from './codelang.ts';
import { serveFile } from "https://deno.land/std@0.224.0/http/file_server.ts";

/** ## Program
  * This class is responsible in rendering the graphical interface 
  */
export class Program {
    constructor() { }

    /** HTTP Server */
    server:Deno.HttpServer|null = null;
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
        $u: ${this.unit}px;
        $padd: ${0.5*this.unit}px;

        body,html {
            height: 100%;
        }
        body {
            display: grid;
            grid-template: ${0.5*this.unit}px 1fr ${0.5*this.unit}px / ${0.5*this.unit}px 8*$u 1fr ${0.5*this.unit}px;
            background-color: #111;
            margin: 0;

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
                box-shadow: inset 0 0 $u #1115;
                z-index: -1;
            }
            &::after {
                content: '';
                grid-area: 2 / 3;
                background-color: #fffa;
                z-index: 1;
                border-radius: 0.5*$padd;
            }
        }
        #task {
            display: flex;
            flex-direction: column;
            grid-area: 2 / 2;
            margin: $u 0;
            button {
                height: 1.5*$u;
                border: 0;
                background: none;
                font-size: 0.5*$u;
                color: #fff;
            }
            svg {
                width: $u;
                margin: 0.5*$u auto;
                path {
                    fill: #fff;
                }
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
                <div id="task">
                    ${[
                        'Dashboard',
                        'New Return',
                        'Track RMA',
                        'Confirm Return (Admin)',
                        'Refund/Replace',
                        'Return Issue'
                    ].map(x=>xml`<button>${x}</button>`).join('')}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
                </div>
            </body>
        </html>
    `;

    /** Opens a graphical window */
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

    /** Hosts the graphical interface */
    async host(port:number=8080, host:string='0.0.0.0') {
        // If server already started
        if (this.server) throw new Error('Server is already started');
        // Create server
        this.server = Deno.serve({
            hostname:host, port:port
        }, (req) => {
            const path = new URL(req.url).pathname;
            if (path == 'font.ttf') serveFile(req, 'assets/LeagueSpartan.ttf');
            return new Response(this.page, {
                status: 200,
                headers: { 'content-type': 'text/html' }
            });
        });
        // Wait for server to finish hosting
        await this.server.finished;
    }

    /** Closes HTTP Server */
    async close() {
        // If server is already started
        if (!this.server) throw new Error('Server did not start yet');
        // Close server
        await this.server.shutdown();
    }
}

Deno.test('Interface testing', async (t) => {
    const app = new Program();

    if (false) await t.step('Window Interface', async () => {
        await app.gui();
    });
    await t.step('Hosting Interface', async () => {
        app.host();
        const buf = new Uint8Array(1);
        Deno.stdin.setRaw(true);
        await Deno.stdin.read(buf);
        Deno.stdin.setRaw(false);
        await app.close();
        if (new TextDecoder().decode(buf).toLowerCase() != 'y')
            throw new Error('Not accepted');
    });
});

