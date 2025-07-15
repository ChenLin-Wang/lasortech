import { Dalx } from "https://raw.githubusercontent.com/jasouza-git/dalx/refs/heads/main/mod.ts";

type Rules = {
  state: string;
};

export class StateSign extends Dalx<Rules> {
  override content(_req: Request | null, _parent: Dalx): unknown {
    return (
      <div class="w-3 h-3 bg-red-500 rounded-full shadow-sm flex-shrink-0"> </div>
    );
  }
}
