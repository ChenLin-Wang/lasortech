import {
  Dalx,
} from "https://raw.githubusercontent.com/jasouza-git/dalx/refs/heads/main/mod.ts";
import { TextField } from "./textfield.tsx";
import { Card } from "./card.tsx";

type Rules = {
  values: FieldParameter<string | number>[];
};

type FieldParameter<DataType> = {
  label: string;
  value: DataType;
};

export class Fields extends Dalx<Rules> {
  override content(_req: Request | null, _parent: Dalx): unknown {
    return (
      <Card>
        <table class="table-fixed w-full h-[10px] text-sm">
          {...this.attr.values.map((x) => (
            <tbody>
              <tr>
                <td class="w-32 text-end border-r border-gray-300 p-3">
                  {x.label}:
                </td>
                <td class="p-3">
                  <TextField
                    value="asdfasdf"
                    onSubmit={() => {
                      console.log("Clicked");
                    }}
                  />
                </td>
              </tr>
            </tbody>
          ))}
        </table>
      </Card>
    );
  }
}
