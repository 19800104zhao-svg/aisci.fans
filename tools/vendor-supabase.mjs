import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const source = join(root, "node_modules/@supabase/supabase-js/dist/umd/supabase.js");
const target = join(root, "vendor/supabase.js");

await mkdir(dirname(target), { recursive: true });
await copyFile(source, target);
const content = await readFile(target, "utf8");
await writeFile(target, content.replace(/[ \t]+$/gm, ""));
