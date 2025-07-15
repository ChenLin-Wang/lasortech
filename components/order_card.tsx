import {
  Dalx,
} from "https://raw.githubusercontent.com/jasouza-git/dalx/refs/heads/main/mod.ts";
import { ItemTable } from "./item_table.tsx";
import { StateSign } from "./state_sign.tsx";
import { Card } from "./card.tsx";

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

export class OrderCard extends Dalx {
  constructor(attrs: {
    id: string;
    updateAt: string;
    createAt: string;
    items: Item[];
    description?: string;
    customer: Customer;
    state: State;
    rma: string;
  }, child: unknown[]) {
    super(attrs, child);
    this.items = attrs.items;
    this.customer = attrs.customer;
    this.state = attrs.state;
  }

  items: Item[];
  customer: Customer;
  state: State;

  override content(_req: Request | null, _parent: Dalx): unknown {
    return (
      <Card>
        <div class="grid grid-cols-[auto_280px] overflow-x-auto whitespace-nowrap scrollbar-hide">
          <div class="p-2 border-r border-gray-300">
            <div class="flex justify-between items-baseline gap-2">
              <p class="font-bold text-2xl flex-shrink-0 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {this.attr.id}
              </p>
              <p class="text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
                {this.attr.updateAt} / {this.attr.createAt}
              </p>
            </div>

            <div class="h-[110px] overflow-y-auto mt-3 scrollbar-hide">
              <ItemTable
                titles={["Name", "Brand", "Mode", "Serial"]}
                items={this.items.map(
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
            <p class="font-bold text-2xl w-full overflow-x-auto whitespace-nowrap scrollbar-hide">
              {this.customer.name}
            </p>
            <p class="text-sm text-end mt-4 font-semibold overflow-x-auto whitespace-nowrap scrollbar-hide">
              {this.customer.contactNumber}
            </p>
            <p class="text-sm text-end font-semibold overflow-x-auto whitespace-nowrap scrollbar-hide">
              {this.customer.email}
            </p>
            <p class="text-sm text-end font-semibold overflow-x-auto whitespace-nowrap scrollbar-hide">
              {this.customer.messenger}
            </p>
            <p class="mt-1 mb-1 font-semibold text-sm">Summary:</p>
            <div class="text-sm h-[7em] bg-gray-100 rounded leading-[1.5em] overflow-y-auto break-words p-1">
              {this.customer.description}
            </div>
          </div>
        </div>
        <div class="p-2 border-t border-gray-300">
          <div class="flex items-center w-full gap-2 flex-row divide-x divide-gray-300">
            <StateSign
              state={this.state.name}
            />
            <div class="flex-grow overflow-x-auto whitespace-nowrap scrollbar-hide">
              <p class="text-sm">
                {this.state.description}
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
