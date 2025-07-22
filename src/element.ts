/** # Element Module
  * This element allows TSX/JSX Elements
  * @module
  */
/** # General Element Class
  */
export interface Props {
    children?: unknown;
    [key:string]: unknown;
}
export abstract class Element {
    constructor() {}

    /** Children of Element */
    children:unknown[] = [];
    /** To extract the content to be stringified */
    content(_req:Request|null):unknown {
        // Just returns all children
        return this.children;
    }
    /** Compiles the whole element *(Dont Override)*
      * `render(req, replace)`
      */
    render(req:Request|null=null):string|Response {
        let out = '';
        const content = this.content(req);
        for (const cont of (Array.isArray(content) ? content : [content])) {
            if (typeof cont == 'string') out += cont;
            else if (cont instanceof Response) return cont;
            else if (cont instanceof Element) {
                const rendered = cont.render(req);
                if (typeof rendered == 'string') out += rendered;
                else return rendered;
            }
        }
        return out;
    }
}
/** HTML Element */
export class HTMLElement extends Element {
    tag:string;
    attr:{[name:string]:unknown};
    constructor(tag:string, attr:{[name:string]:unknown}, children:unknown[]) {
        super();
        this.tag = tag;
        this.attr = attr;
        this.children = children;
    }
    override content():unknown {
        return [`<${
                // Element Tag
                this.tag
            }${
                // Element Attributes
                Object.keys(this.attr).map(x=>` ${x}="${String(this.attr[x])}"`).join('')
            }${
                // Element Ending
                this.children.length ? '>' : '/>'
            }`,
            // Element children
            ...(this.children.length  ? [...this.children, `</${this.tag}>`] : [])
        ];
    }
}
export type ClassTag<T extends Element> = new (attr:{[name:string]:unknown},children:unknown[]) => T;
export function factory<T extends Element>(
    tag: ClassTag<T> | keyof JSX.IntrinsicElements,
    attr: {[name:string]:unknown},
    ...children: unknown[]
): T | HTMLElement {
    if (typeof tag === 'string') return new HTMLElement(tag, attr??{}, children);
    return new (tag as ClassTag<T>)(attr, children);
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            [tag: string]: unknown;
        }
        /*interface ElementClass {
            toString():string;
        }*/
    }
}