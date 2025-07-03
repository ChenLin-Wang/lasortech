/** # XML minifier */
export function xml(strings:TemplateStringsArray, ...values:(string|number)[]):string {
    return strings.reduce((out:string, str:string, n:number) => out + str.split('\n').map(x=>x.trim()).join('') + (values[n] ?? ''), '');
}
