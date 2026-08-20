import { TOOLS_REGISTRY } from "../lib/tools/registry";
import fs from "fs";

const data = TOOLS_REGISTRY.map(t => ({ id: t.id, slug: t.slug, name: t.name, category: t.category, toolType: t.toolType, hasHowTo: !!t.howTo, hasFaqs: !!t.faqs }));
fs.writeFileSync("tools-dump.json", JSON.stringify(data, null, 2));
console.log(`Dumped ${data.length} tools`);
