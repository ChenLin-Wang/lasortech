import { Dalx } from 'https://raw.githubusercontent.com/jasouza-git/dalx/main/mod.ts';

export type PageAttr = {
    /** Name of Page */
    name:string
}

export class Page extends Dalx<PageAttr> {
    constructor(attr:PageAttr, chlds:unknown[]) {
        super(attr, chlds);
        this.name = this.attr.name;
        this.id = this.attr.name.toLowerCase().replace(/[^\w\s]/g,'').replace(/\s+/g,'-');
        Page.pages.push(this);
    }
    override content(req:Request|null) {
        const path = Page.focus(req);
        return <div data={this.id} class={path == this.id ? 'on' : ''}>
            {this.children}
        </div>
    }
    /** Name of Page */
    name:string = '';
    /** Id of Page */
    id:string = '';
    /** All pages */
    static pages:Page[] = [];
    static page:string|null = null;
    /** Get currently focused page */
    static focus(req:Request|null, set:boolean=true):string {
        const def = Page.page??Page.pages[0].name;
        const path = req == null ? def : new URL(req.url).pathname.split('/')[1]??def;
        if (set) Page.page = path;
        return path;
    }
}
export class Action extends Dalx<{name:string, icon:string, text:string}> {
    override content() {
        return <div>
            <h1>{this.attr.name}</h1>
            <icon>&#x{this.attr.icon}</icon>
            <h3>{this.attr.text}</h3>
        </div>
    }
}