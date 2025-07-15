import { Dalx, state_type } from "https://raw.githubusercontent.com/jasouza-git/dalx/refs/heads/main/mod.ts";
import { KeyboardEvent } from "https://raw.githubusercontent.com/jasouza-git/dalx/refs/heads/main/type.ts";

export class TextField<T extends string> extends Dalx {
  value: T;
  onSubmit?: (value: T) => void;

  constructor(attrs: { 
    value: T; onSubmit?: (value: T) => void,
    placeHolder?: string
    }, child: unknown[]) {
    super(attrs, child);
    this.value = attrs.value;
    this.onSubmit = attrs.onSubmit;
  }

  override content(_req: Request | null, _parent: Dalx): unknown {
    return (
      <input
        type="text"
        class="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
        placeholder={ this.attr.placeHolder ?? "Value" }
        value={this.value}
        onkeydown={(c: state_type, e: KeyboardEvent) => {
            console.log("YES");

        //   const target = e.target as HTMLInputElement;
        //   if (e.key === 'Enter' && this.onSubmit) {
        //     this.onSubmit(target.value as T);
        //   }
        }}
      />
    );
  }
}