#!/usr/bin/env -S deno test -A
/** # CodeLang Module
  * This module serves no actual purpose aside from minifing and color coding other embedded programming languages
  * @module 
  */
/** XML minifier */
export function xml(strings:TemplateStringsArray, ...values:(string|number)[]):string {
    return strings.reduce((out:string, str:string, n:number) => out + str.split('\n').map(x=>x.trim()).join('') + (values[n] ?? ''), '');
}
/** CSS minifier */
export function css(strings:TemplateStringsArray, ...values:(string|number)[]):string {
    return strings.reduce((out:string, str:string, n:number) => out + str.split('\n').map(x=>x/*.trim()*/).join('') + (values[n] ?? ''), '');
}
