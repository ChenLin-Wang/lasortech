import { Dalx } from "https://raw.githubusercontent.com/jasouza-git/dalx/refs/heads/main/mod.ts";

export class ItemTable extends Dalx {
  constructor(attrs: {
    titles: string[];
    items: (string|undefined)[][];
  }, child: unknown[]) {
    super(attrs, child);
    this.titles = attrs.titles;
    this.items = attrs.items;
  }

  titles: string[];
  items: (string|undefined)[][];

  override content(_req: Request | null, _parent: Dalx): unknown {
    return (
      <table class="w-full h-[10px] text-sm">
        <thead class="bg-gray-100 text-gray-500 sticky top-[-1px]">
          <tr>
            {...this.titles.map((title) => (
              <th class="text-start border border-gray-300 px-2 py-[5px]">
                {title}
              </th>
            ))}
          </tr>
        </thead>
        {...this.items.map((x) => (
          <tbody>
            <tr>
              {...this.titles.map((_, n) => (
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
