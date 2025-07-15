import {
  Dalx,
} from "https://raw.githubusercontent.com/jasouza-git/dalx/refs/heads/main/mod.ts";

enum ButtonType {
  button = "button",
  submit = "submit",
  reset = "reset",
}

type Rules = {
  label: string;
  type?: string;
};

export class Button extends Dalx<Rules> {
  override content(_req: Request | null, _parent: Dalx): unknown {
    return (
      <button
        class="px-4 py-1 rounded-md border border-gray-300 bg-white shadow-sm text-gray-700 text-sm
            hover:bg-gray-100 active:bg-blue-500 active:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-400
            transition-colors"
        type={this.attr.type ?? ButtonType.button}
      >
        { this.attr.label }
      </button>
    );
  }
}
