import {
  Dalx,
} from "https://raw.githubusercontent.com/jasouza-git/dalx/refs/heads/main/mod.ts";
import { TextField } from "./textfield.tsx";

type FieldParameter<DataType> = {
  label: string;
  value: DataType;
};

export class Fields extends Dalx {
  constructor(attrs: {
    values: FieldParameter<string | number>[];
  }, child: unknown[]) {
    super(attrs, child);
    this.values = attrs.values;
  }

  values: FieldParameter<string | number>[];

  override content(_req: Request | null, _parent: Dalx): unknown {
    return (
      <table class="table-fixed w-full h-[10px] text-sm">
        {...this.values.map((x) => (
          <tbody>
            <tr>
              <td class="w-32 text-end border-r border-gray-300 p-3">
                {x.label}:
              </td>
              <td class="p-3">
                <TextField
                  value="asdfasdf"
                  // onSubmit={() => {
                  //   console.log("Clicked")
                  // }}
                />
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    );
  }
}
