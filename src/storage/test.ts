#! /usr/bin/env -S deno run -A

import { Storage } from './storage.ts'

const storage = new Storage()

await storage.do()

storage.close()