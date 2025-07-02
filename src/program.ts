import * as wcws from "jsr:@svefro/win-console-window-state";
import { Webview } from "jsr:@webview/webview";

/** ## Program
  * This class is responsible in rendering the graphical interface 
  */
export class Program {
    page:string;
    constructor(code:string) {
        this.page = code;
    }
    async init() {
        /* Set a unique console title and then find it to hide (SW_HIDE = 0) */
        await wcws.setCurrentConsoleWindowTitleIncludingDelay('DenoWebviewApp');
        wcws.findNamedConsoleWindowAndSetWindowState('DenoWebviewApp', 0);

        /* Create window */
        const view = new Webview();
        view.navigate(`data:text/html,${encodeURIComponent(this.page)}`);
        view.run();
    }
}