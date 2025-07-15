import {
  Dalx,
} from "https://raw.githubusercontent.com/jasouza-git/dalx/refs/heads/main/mod.ts";
import { HTMLInputElement } from "https://raw.githubusercontent.com/jasouza-git/dalx/refs/heads/main/type.ts";

type Rules = {
  label?: string;
  state?: boolean;
  onChange?: (checked: boolean) => void;
};

export class CheckBox extends Dalx<Rules> {
  override content(_req: Request | null, _parent: Dalx): unknown {
    return (
      <label class="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          class="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-400"
          checked={this.attr.state ?? false}
          onchange={(e: Event) => {
            console.log("yes")
            const target = e.target as HTMLInputElement;
            this.attr.state = target.checked;
            this.attr.onChange?.(target.checked);
          }}
        />
        <span class="text-sm text-gray-700 select-none">
          {this.attr.label ?? ""}
        </span>
      </label>
    );
  }
}