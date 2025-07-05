#!/usr/bin/env -S deno test -A
/** # CodeLang Module
  * This module serves no actual purpose aside from minifing and color coding other embedded programming languages
  * @module 
  */
export function line_timmer(strings:TemplateStringsArray, ...values:(string|number)[]):string {
    return strings.reduce((out:string, str:string, n:number) => out + str + (values[n] ?? ''), '').split('\n').map(x=>x.trim()).join('');
}
/** XML minifier */
export const xml = line_timmer;
/** CSS minifier */
export const css = line_timmer;
