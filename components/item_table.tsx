import { Dalx } from "https://raw.githubusercontent.com/jasouza-git/dalx/refs/heads/main/mod.ts";

type Rules = {
  titles: string[];
  items: (string | undefined)[][];
};

export class ItemTable extends Dalx<Rules> {
  override content(_req: Request | null, _parent: Dalx): unknown {
    return (
      <table class="w-full h-[10px] text-sm">
        <thead class="bg-gray-100 text-gray-500 sticky top-[-1px]">
          <tr>
            {...this.attr.titles.map((title) => (
              <th class="text-start border border-gray-300 px-2 py-[5px]">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        {...this.attr.items.map((x) => (
          <tbody>
            <tr>
              {...this.attr.titles.map((_, n) => (
                <td class="border border-gray-300 px-2 py-[5px] w-[200px] max-w-[200px]">
                  <div class="w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
                    {x[n]}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        ))}
      </table>
    );
  }
}
