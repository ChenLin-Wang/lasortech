import {
  Dalx,
} from "https://raw.githubusercontent.com/jasouza-git/dalx/refs/heads/main/mod.ts";
import { ItemTable } from "./item_table.tsx";
import { StateSign } from "./state_sign.tsx";
import { Card } from "./card.tsx";

type Rules = {
  id: string;
  updateAt: string;
  createAt: string;
  items: Item[];
  description?: string;
  customer: Customer;
  state: State;
  rma: string;
};

export type Item = {
  name: string;
  serial: string;
  brand?: string;
  mode?: string;
};

export type Customer = {
  name: string;
  contactNumber: string;
  email: string;
  messenger?: string;
  description?: string;
};

export type State = {
  name: string;
  description?: string;
};

export class OrderCard extends Dalx<Rules> {
  override content(_req: Request | null, _parent: Dalx): unknown {
    return (
      <Card>
        <div class="grid grid-cols-[auto_280px] scrollable">
          <div class="p-2 border-r border-gray-300">
            <div class="flex justify-between items-baseline gap-2">
              <p class="font-bold text-2xl flex-shrink-0 scrollable">
                {this.attr.id}
              </p>
              <p class="text-sm scrollable">
                {this.attr.updateAt} / {this.attr.createAt}
              </p>
            </div>

            <div class="h-[110px] overflow-y-auto mt-3 scrollbar-hide">
              <ItemTable
                titles={["Name", "Brand", "Mode", "Serial"]}
                items={this.attr.items.map(
                  (item) => [item.name, item.brand, item.mode, item.serial],
                )}
              />
            </div>

            <p class="mt-2 mb-1 font-semibold text-sm">Problem:</p>
            <div class="text-sm h-[3.5em] bg-gray-100 rounded leading-[1.5em] overflow-y-auto break-words p-1">
              {this.attr.description}
            </div>
          </div>
          <div class="p-2">
            <p class="font-bold text-2xl w-full scrollable">
              {this.attr.customer.name}
            </p>
            <p class="text-sm text-end mt-4 font-semibold scrollable">
              {this.attr.customer.contactNumber}
            </p>
            <p class="text-sm text-end font-semibold scrollable">
              {this.attr.customer.email}
            </p>
            <p class="text-sm text-end font-semibold scrollable">
              {this.attr.customer.messenger}
            </p>
            <p class="mt-1 mb-1 font-semibold text-sm">Summary:</p>
            <div class="text-sm h-[7em] bg-gray-100 rounded leading-[1.5em] overflow-y-auto break-words p-1">
              {this.attr.customer.description}
            </div>
          </div>
        </div>
        <div class="p-2 border-t border-gray-300">
          <div class="flex items-center w-full gap-2 flex-row divide-x divide-gray-300">
            <StateSign
              state={this.attr.state.name}
            />
            <div class="flex-grow scrollable">
              <p class="text-sm">
                {this.attr.state.description}
              </p>
            </div>
            <div class="flex-shrink-0 text-sm ml-auto font-semibold">
              {this.attr.rma}
            </div>
          </div>
        </div>
      </Card>
    );
  }
}
