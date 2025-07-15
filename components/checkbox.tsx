import {
  Dalx,
} from "https://raw.githubusercontent.com/jasouza-git/dalx/refs/heads/main/mod.ts";

export class CheckBox extends Dalx {

    constructor(attrs: {
        state: boolean
    }, child: unknown[]) {
        super(attrs, child)
    }

    override content(_req: Request | null, _parent: Dalx): unknown {
      return (
        <div class="rounded-xl shadow-md border border-gray-300 p-3">
            { this.children }
        </div>
      )
    }
}