#!/usr/bin/env -S deno run -A
import { contentType } from "https://deno.land/std@0.224.0/media_types/mod.ts";

/** # Embedded file */
export class File {
    name:string;
    type:string;
    data:Uint8Array;
    constructor(name:string, type:string, data:string) {
        this.name = name;
        this.type = type;
        this.data = Uint8Array.from(atob(data), c => c.charCodeAt(0));
    }
    serve(req:Request):Response|null {
        if (new URL(req.url).pathname != `/${this.name}`) return null;
        return new Response(this.data, {headers:{'content-type':this.type}});
    }
}

if (import.meta.main) {
    for (const file of Deno.args) {
        const name_var = (/([^\/.]+)\.[^\/.]+$/.exec(file)??['','unknown'])[1];
        const name_pth = (/([^\/]+)$/.exec(file)??['','unknown'])[1];
        console.log(`// ${file}\nexport const ${name_var} = new File('${name_pth}','${contentType(file)}','${btoa(String.fromCharCode(...(await Deno.readFile(file))))}');\n`);
    }
    Deno.exit();
}

/* ----- FILES ----- */
