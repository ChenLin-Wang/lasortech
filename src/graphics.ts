#!/usr/bin/env -S deno test -A
/** # Graphics Module
  * This module is responsible in generating graphical elements
  * @module
  */
import { xml } from './codelang.ts';

/** # Graphics Specializer for SVG or HTML Canvas */
export class Graphics {
    constructor(defaults:Partial<Graphics>={}) {
        // Set defaults
        Object.assign(this, defaults);
        this.render();
    }
    render() {
        // Reset
        this.gen.defs = '';

        // Process effects
        const effect_types:{[id:string]:'fill'|'filter'|'mask'} = {};
        let filter_tmp_id:number = 0;
        for (const name in this.effects) {
            const effect = this.effects[name];
            /** Current type */
            let type:''|'fill'|'filter'|'mask' = '';
            /** Temporary filter code */
            let filter = '';
            /** Generates Filter DEF code from `filter` */
            const to_filter = (tmp?:boolean) => {
                const id = tmp ? `t${this.prefix}${(filter_tmp_id++).toString(36)}` : `${this.prefix}${name}`;
                this.gen.defs += xml`<filter id="${id}">${filter}</filter>`;
                filter = '';
                return id;
            };
            // Generate type
            for (const step of effect) {
                // Linear Gradient
                if (step[''] === 'gradient' && !type && 'stops' in step && step.stops) {
                    type = 'fill';
                    this.gen.defs += xml`<linearGradient id="${this.prefix}${name}"${step.transform ? ` gradientTransform="${step.transform}"` : ''}>
                        ${step.stops.map((x,n,a)=>{
                            const offset = typeof x != 'string' ? x[1] : a.length != 1 ? 100*n/(a.length-1) : 0;
                            return xml`<stop offset="${offset}%" stop-color="${typeof x == 'string' ? x : x[0]}"/>`;
                        }).join('')}
                    </linearGradient>`;
                }
                // Mask
                else if (step[''] === 'mask' && 'from' in step && step.from) {
                    const add = xml`<mask id="${this.prefix}${name}">
                        <rect x="0" y="0" width="100%" height="100%" fill="${step.type == 'include' ? '#000' : '#fff'}"/>
                        <use href="#${this.prefix}${step.from}" fill="${step.type == 'include' ? '#fff' : '#000'}"${type == 'filter' ? ` filter="url(#${to_filter(true)})"`:''}/>
                    </mask>`;
                    this.gen.defs += add;
                    type = 'mask';
                }
                // SVG MERGE
                else if (step[''] === 'merge' && 'ins' in step && step.ins) {
                    filter += xml`<feMerge>
                        ${step.ins.map(x=>xml`<feMergeNode in="${x}"/>`).join('')}
                    </feMerge>`
                }
                // SVG FILTERS
                else if (!['gradient','mask'].includes(step[''])) {
                    filter += xml`<${[
                        // HTML Tag
                        `fe${step[''].slice(0,1).toUpperCase()}${step[''].slice(1)}`,
                        // Attributes
                        ...Object.keys(step).filter(x=>x.length).map(x=>{
                            // @ts-ignore: Regardless of type it will be string anyway
                            const val = step[x];
                            return `${x}="${String(val)}"`
                        })
                    ].join(' ')}/>`;
                    type = 'filter';
                }
                // Unknown
                else throw new Error('Unknown effect condition');
            }
            if (type == 'filter') to_filter();
            if (type != '') effect_types[name] = type;
            else throw new Error('Un-identified effect type');
        }
        if (this.debug) console.log('\x1b[1;32mDEFINES:\x1b[0m', this.gen.defs);

        // Get Frames (this.frames)
        if (!this.frames.length) {
            const get_frames = (start:number, end:number):number => {
                if (!this.frames.includes(start)) this.frames.push(start);
                if (!this.frames.includes(end)) this.frames.push(end);
                return 0;
            };
            this.shape(get_frames);
            this.frames.sort((a,b)=>a-b);
            if (!this.frames.length) this.frames.push(0);
        }
        if (this.debug) console.log('\x1b[1;32mFRAMES:\x1b[0m', this.frames.join(', '));

        // Render Paths
        const mul = (p:number[]) => [
            Math.floor(Math.pow(10,this.digits)*(this.width/2 +this.matrix[0]*p[0]+this.matrix[1]*p[1]+this.matrix[4]))/Math.pow(10,this.digits),
            Math.floor(Math.pow(10,this.digits)*(this.height/2-this.matrix[2]*p[0]-this.matrix[3]*p[1]-this.matrix[5]))/Math.pow(10,this.digits),
        ];
        // Generate all of the shape's path for each frames
        const fshapes = this.frames.map(f =>
            this.shape((a,b)=>(b-a)*(f<=a?0:f>=b?1:(f-a)/(b-a))).map(shape => {
                let flag = '';
                const sf = (val:string):string => {
                    const out = flag == val || flag == 'M' && val == 'L' ? '' : val;
                    flag = val;
                    return out;
                };
                return {
                    ...shape,
                    code: shape.path.map((x,n,a) =>
                        // Close/New Path
                        (n?'':sf('M'))+
                        // Empty
                        (x.length==0?sf('Z')+(n+1==a.length?'':sf('M')):'')+
                        // Line To
                        (x.length==2?sf('L')+mul(x).join(' '):'')+
                        // Bezier Curve To
                        (x.length==6?sf('C')+x.reduce((a,_,n)=>n%2?a:[...a,mul([x[n],x[n+1]])] as [number,number][],[] as [number,number][]).map(x=>`${x[0]} ${x[1]}`).join(' '):'')+
                        // Arc To
                        (x.length==7?sf('A')+`${this.matrix[0]*x[0]} ${this.matrix[3]*x[1]} ${x.slice(2,5).join(' ')} ${mul(x.slice(5,7)).join(' ')}`:'')
                    ).reduce((p,v)=>p+(!p.endsWith(' ')&&/^[\d-]/.test(v)?' ':'')+v, '')
                }
            })
        );
        // Generate all the shape's code
        const shapes = fshapes[0].map((shape, id) => {
            /** Animations */
            const animations = Object.keys(this.animations).length ? this.animations : {default:{start:this.frames[0], end:this.frames[this.frames.length-1]}}
            /** Attributes */
            const attr:{[name:string]:string} = {};
            /** Animation path values */
            const ani = (s:number, e:number) => [this.frames
                // Get only start to end frames
                .slice(this.frames.indexOf(s), this.frames.indexOf(e)+1)
                // Get paths and duration
                .map((frame,n,arr) => [fshapes[this.frames.indexOf(frame)][id].code, arr.length > 1 ? (frame-s)/(e-s) : 0])
                // Reduce repetitive values
                .reduce((p,v) => !p.length || p[p.length-1][0] != v[0] ? [...p,v] : [
                    ...p.slice(0,-1), v
                ], [] as (string | number)[][])
                // Convert it to SVG "values" and "keyTimes"
                ].map(v => ({path:v.map(x=>x[0]).join(';'),time:v.map(x=>x[1]).join(';')}))[0]
            ;
            let anis = '';
            // Fill
            if (shape.fill) attr['fill'] = shape.fill;
            // Stroke
            if (shape.stroke) attr['stroke'] = shape.stroke;
            // Effects
            if (shape.effect) for (const effect of shape.effect) {
                attr[effect_types[effect]] = `url(#${this.prefix}${effect})`;
            }
            // ID
            //if (shape.id) attr['id'] = this.prefix+shape.id;
            // Subtractive fill
            if (shape.code.split('z').length > 2) attr['fill-rule'] = 'evenodd';

            // Get animations
            let def_path = '';
            for (const name in animations) {
                const A = animations[name];
                const keys = typeof A == 'number' ? ani(A,A) : ani(A.start, A.end);
                console.log('\x1b[1;32mANIMATE:\x1b[0m', name, keys);
                // Not in scope, skip
                if (!keys.path.length) continue
                // Static path (Directly to path element)
                if (name == 'default' && keys.time.split(';').length == 1) {
                    def_path = attr['d'] = keys.path;
                }
                // Animate Path
                else if (keys.path != def_path) anis += xml`
                    <animate attributeName="d" values="${keys.path}" dur="${typeof A != 'number' && 'time' in A ? A.time! : 2}s" repeatCount="${typeof A != 'number' && 'repeat' in A ? A.repeat! : 'indefinite'}"${
                        (name == 'default' ? '' : ` begin="indefinite" class="${this.prefix}${name}"`)+
                        (typeof A != 'number' && A.reset ? '' : ' fill="freeze"')+
                        (typeof A != 'number' && A.equal ? '' : ` keyTimes="${keys.time}"`)
                    }/>
                `;
            }
            console.log('\x1b[1;32mANIMATIONS:\x1b[0m', anis);

            // Path Content
            const path_cont = anis.length ? `>${anis}</path` : '/';
            // Add to defs
            if (shape.id) this.gen.defs += xml`<path id="${this.prefix}${shape.id}"${attr.d ? ` d="${attr.d}"` : ''}${path_cont}>`;

            return [
                shape.id ? `<use href="#${this.prefix}${shape.id}"` : '<path',
                ...Object.keys(attr).filter(x=>!shape.id || x!='d').map(x=>`${x}="${attr[x]}"`),
            ].join(' ')+(shape.id ? '' : path_cont)+'>';
        }).join('');
        if (this.debug) console.log('\x1b[1;32mSHAPES:\x1b[0m', shapes);
        this.gen.cont = shapes;
    }
    /* ----- ASSIGNABLE ----- */
    /** Debugging Mode */
    debug:boolean = false;
    /** Matrix transformation of plotted area to actual area */
    matrix:number[] = [1,0,0,1,0,0];
    /** Width of screen */
    width:number = 100;
    /** Height of screen */
    height:number = 100;
    /** Generated shapes based on frame number */
    shape:(u:(a:number,b:number)=>number)=>{
        id?:string,
        fill?:string, stroke?:string,
        opacity?:number,
        effect?:string[],
        debug?:boolean,
        path:number[][],
    }[] = _=>[];
    /** Effects like Filters, Masking, Gradients, etc. */
    effects:{[id:string]:(
        // Gradient
        {'':'gradient', transform?:string, stops?:(string|[string,number])[]} |
        // Masking
        {'':'mask', type:'include'|'exclude', from:string} |
        // ----- SVG Filter ----- //
        ((
            // <feBlend>
            {'': 'blend', in2: string, mode: 'normal'|'multiply'|'screen'|'overlay'|'darken'|'lighten'|'color-dodge'|'color-burn'|'hard-light'|'soft-light'|'difference'|'exclusion'|'hue'|'saturation'|'color'|'luminosity'} |
            // <feColorMatrix>
            {'': 'colormatrix', type: 'matrix'|'saturate'|'hueRotate'|'luminanceToAlpha', values?: string} |
            // <feComponentTransfer>
            {'': 'componenttransfer'} |
            // <feComposite>
            {'': 'composite', in2: string, operator: 'over'|'in'|'out'|'atop'|'xor'|'lighter'|'arithmetic', k1?: number, k2?: number, k3?: number, k4?: number} |
            // <feConvolveMatrix>
            {'': 'convolvematrix', order?: number, kernelMatrix: string, divisor?: number, bias?: number, targetX?: number, targetY?: number, edgeMode?: 'duplicate'|'wrap'|'none', kernelUnitLength?: number, preserveAlpha?: 'true'|'false'} |
            // <feDiffuseLighting>
            {'': 'diffuselighting', surfaceScale: number, diffuseConstant: number, kernelUnitLength?: number, 'lighting-color'?: string} |
            // <feDisplacementMap>
            {'': 'displacementmap', in2: string, scale: number, xChannelSelector: 'R'|'G'|'B'|'A', yChannelSelector: 'R'|'G'|'B'|'A'} |
            // <feDropShadow>
            {'': 'dropshadow', dx: number, dy: number, stdDeviation: number, 'flood-color'?: string, 'flood-opacity'?: number} |
            // <feFlood>
            {'': 'flood', 'flood-color': string, 'flood-opacity'?: number} |
            // <feGaussianBlur>
            {'': 'gaussianblur', stdDeviation: number, edgeMode?: 'duplicate'|'wrap'|'none'} |
            // <feImage>
            {'': 'image', href: string, preserveAspectRatio?: string, crossorigin?: 'anonymous'|'use-credentials'} |
            // <feMerge>
            {'': 'merge', ins:string[]} |
            // <feMorphology>
            {'': 'morphology', operator: 'erode'|'dilate', radius: number} |
            // <feOffset>
            {'': 'offset', dx: number, dy: number} |
            // <feSpecularLighting>
            {'': 'specularlighting', surfaceScale: number, specularConstant: number, specularExponent: number, kernelUnitLength?: number, 'lighting-color'?: string} |
            // <feTile>
            {'': 'tile'} |
            // <feTurbulence>
            {'': 'turbulence', type: 'turbulence'|'fractalNoise', baseFrequency: number, numOctaves?: number, seed?: number, stitchTiles?: 'stitch'|'noStitch'}
        ) & { in?: string; result?: string })
    )[]} = {};
    /** Animations of graphics based on frames */
    animations:{[id:string]:number|{
        start:number,
        end:number,
        repeat?:number,
        reset?:boolean,
        time?:number,
        equal?:boolean
    }} = {};
    /** Number of preceeding digit precisions */
    digits:number = 2;
    /** Prefix to prevent HTML ID conflicts */
    prefix:string = Math.random().toString(36).slice(2, 6)+'_';
    /* ----- GENERATED ----- */
    /** Generated data */
    private gen = {
        defs: '',
        cont: ''
    };
    /** SVG Defineds */
    get defs():string { 
        return this.gen.defs;
    }
    /** Recognized Frames */
    private frames:number[] = [];
    /** SVG Content */
    svg(config:{defs?:boolean}={}):string {
        const conf = {defs:true, ...config};
        return xml`<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" viewBox="0 0 ${this.width} ${this.height}">
            ${conf.defs ? xml`<defs>${this.gen.defs}</defs>` : ''}
            ${this.gen.cont}
        </svg>`;
    }
    /** Data URL */
    get data():string {
        return 'data:image/svg+xml;base64,'+btoa(new TextEncoder().encode(this.svg()).reduce((acc, byte) => acc + String.fromCharCode(byte), ''));
    }
    /** Debug Hosting Individual */
    async host() {
        const server = Deno.serve(req => Graphics.host(req,this)??new Response('404', {status:404}));
        await server.finished;
    }
    /** Debug Hosting */
    static host(req:Request, ...guis:Graphics[]):Response|null {
        let path = Number(new URL(req.url).pathname.slice(1));
        if (guis.length > 1) {
            if (Number.isNaN(path) || path >= guis.length || path < 0) return null;
        } else path = 0;
        return new Response(xml`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Graphics Debugging #${path}</title>
                    <style>
                        body {
                            background: #111;
                        }
                        #list {
                            display: flex;
                            height: 30px;
                            margin-bottom: 10px;
                        }
                        #list button {
                            flex-grow: 1;
                            background: #333;
                            color: #fff;
                            border: 2px solid #444;
                            font-weight: bold;
                        }
                        #list button.opt {
                            flex-grow: 0;
                            flex-shrink: 0;
                            width: 50px;
                        }
                        #list button:hover {
                            background: #444;
                        }
                        svg {
                            width: 100%;
                            height: calc(100vh - 60px);
                            box-shadow: 0 0 10px #000;
                        }
                    </style>
                </head>
                <body>
                    <div id="list">${Object.keys(guis[path].animations).filter(x=>x!='default').length ? xml`
                        <button onclick="play()" class="opt">&#9658;</button>
                        <button onclick="pause()" class="opt">&#x23F8;</button>
                        <button onclick="stop()" class="opt">&#9632;</button>
                    `:''}${Object.keys(guis[path].animations).filter(x=>x!='default').map(x=>xml`
                        <button onclick="start('${x}')">${x}</button>
                    `).join('')}</div>

                    ${guis[path].svg()}
                    <script>
                        function start(name) {
                            Array.from(document.getElementsByClassName('${guis[path].prefix}'+name)).map(x=>x.beginElement());
                        }
                        function pause() {
                            document.getElementsByTagName('svg')[0].pauseAnimations();
                        }
                        function play() {
                            document.getElementsByTagName('svg')[0].unpauseAnimations();
                        }
                        function stop() {
                            const dom = document.getElementsByTagName('svg')[0];
                            const clone = dom.cloneNode(true);
                            dom.parentNode.replaceChild(clone, dom);
                            /*clone.beginElement();*/
                        }

                    </script>
                </body>
            </html>
        `, {status:200, headers:{'content-type':'text/html'}});
    }
}

Deno.test('Graphics Testing', async ()=>{
    await new Graphics({
        debug:true,
        effects: {
            'blur': [
                {'':'gaussianblur', in:'SourceGraphic', stdDeviation:1},
            ]
        },
        animations: {
            default: 0,
            rotating: {start:0, end:50, repeat:2},
            unused: {start:50, end:100, repeat:69},
        },
        shape: u => [
            // Static Rect
            {fill:'#aaa', path:[
                [0,0],
                [50,0],
                [50,50],
                [0,50],
                []
            ]},
            // Triangle
            {fill:'#f00', effect:['blur'], path:[
                [u(0,50),0],
                [50,u(0,50)],
                [0,50-u(0,50)],
                [],
            ]},
        ]
    }).host();
});