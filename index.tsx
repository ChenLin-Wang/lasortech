#!/usr/bin/env -S deno run --unstable-raw-imports -A --watch
import { Dalx, App } from "https://raw.githubusercontent.com/jasouza-git/dalx/refs/heads/main/mod.ts";
import style from "./assets/style.css" with { type: "text" }
import { OrderCard } from "./components/order_card.tsx";
import { Fields } from "./components/fields.tsx";

Dalx.run(x=>eval(x));

<App host addon="twc" style={ style }>
  <OrderCard 
    id="04871239712852"
    updateAt="06-20-2025"
    createAt="05-19-2025"
    items={[
      {
        name: "Macbook Pro",
        brand: "Apple",
        mode: "2021-M2",
        serial: "UYOIU-SUAEE-DJAHD-QWSAE"
      }, {
        name: "Macbook Pro",
        brand: "Apple",
        mode: "2021-M2",
        serial: "UYOIU-SUAEE-DJAHD-QWSAE"
      }, {
        name: "Macbook Pro",
        brand: "Apple",
        mode: "2021-M2",
        serial: "UYOIU-SUAEE-DJAHD-QWSAE"
      }, {
        name: "Macbook Pro",
        brand: "Apple",
        mode: "2021-M2",
        serial: "UYOIU-SUAEE-DJAHD-QWSAE"
      }
    ]}
    description="Check system integrity pls."
    customer={{
      name: "ChenLin Wang",
      contactNumber: "09274553340",
      email: "wangchenlin2001@gmail.com",
      messenger: "ChenLin Wang",
      description: "Computer Engineer"
    }}
    state={{
      name: "waitting",
      description: "This order is still waitting accept from employees."
    }}
    rma="IASFA-UIHEK-AIAUY-KLJCL-IYTEQ-DKLAE"
  />
  
  <Fields
    values={[
      { label:"testing", value: "asdfasdf" },
      { label:"testing", value: "asdfasdf" },
      { label:"testing", value: "asdfasdf" },
      { label:"testing", value: "asdfasdf" },
      { label:"testing", value: "asdfasdf" },
    ]}
  />
</App>