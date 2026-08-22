import { TOOLS_REGISTRY } from "../lib/tools/registry";
import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content", "tools");

if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

function generateFrontmatter(tool: any) {
  return `---
title: "${tool.title}"
description: "${tool.description}"
keywords: ${JSON.stringify(tool.keywords)}
---

`;
}

function generateValueProp(tool: any) {
  return `## Why Use the Cluster Tools ${tool.name}?

The **${tool.name}** is built to be the fastest, most private, and easiest-to-use tool of its kind on the internet. Whether you are a professional, a student, or just someone trying to get things done quickly, our tool provides immediate value without any of the typical drawbacks of online utilities.

Most traditional online ${tool.category} tools require you to upload your files or data to a remote server. This process is inherently slow, consumes your internet bandwidth, and critically, exposes your personal or sensitive data to third parties.

**Our tool is different:**
- **100% Private Processing:** Your data never leaves your device. All processing happens entirely within your own browser.
- **Lightning Fast:** Because there is zero upload or download time, the ${tool.name} operates almost instantly.
- **No Limits or Paywalls:** We believe in free access to essential utilities. There are no hidden fees or strict usage limits.
- **Cross-Platform:** Works perfectly on Windows, Mac, Linux, iOS, and Android without needing to install any apps.
`;
}

function generateWhatIs(tool: any) {
  let content = `## What is a ${tool.name}?\n\n`;
  
  if (tool.toolType === "converter") {
    content += `A ${tool.toolType} is designed to seamlessly translate files or data from one format into another. In today's digital landscape, different applications, platforms, and devices require specific formats to function correctly. A ${tool.name} bridges this gap, allowing you to convert your files quickly and accurately without losing quality.\n`;
  } else if (tool.toolType === "calculator") {
    content += `Calculators aren't just for basic math anymore. A ${tool.name} is a specialized utility designed to instantly solve complex ${tool.category} equations, saving you from manual calculations and potential human error. It's built for precision and speed.\n`;
  } else if (tool.toolType === "compressor") {
    content += `File size optimization is crucial for web performance, email attachments, and storage management. A ${tool.name} uses advanced algorithms to reduce the overall byte size of your file while aiming to preserve as much of the original quality as possible.\n`;
  } else if (tool.toolType === "formatter") {
    content += `Code and data can often become messy, minified, or unreadable. A ${tool.name} takes unstructured or tightly packed data and reconstructs it with proper indentation, line breaks, and spacing, making it human-readable and much easier to debug.\n`;
  } else {
    content += `The ${tool.name} is an essential utility for anyone working with ${tool.category} files. It streamlines your workflow by providing exactly what you need in a simple, intuitive interface, eliminating the need for bulky desktop software.\n`;
  }
  return content;
}

function generateHowTo(tool: any) {
  if (tool.howTo && tool.howTo.length > 0) {
    let content = `## How to use the ${tool.shortName}\n\n`;
    tool.howTo.forEach((step: any, index: number) => {
      content += `${index + 1}. **${step.name}:** ${step.text}\n`;
    });
    return content + "\n";
  }

  // Generic How To
  return `## How to use the ${tool.shortName}

1. **Input Your Data:** Simply paste your text, enter your numbers, or drag and drop your files into the designated input area.
2. **Adjust Settings:** (If applicable) Configure any specific options, such as quality sliders, target formats, or calculation variables.
3. **Process & Copy:** The tool will instantly process your input. You can then copy the result to your clipboard or download the generated file directly to your device.
`;
}

function generateFAQ(tool: any) {
  if (tool.faqs && tool.faqs.length > 0) {
    let content = `## Frequently Asked Questions (FAQ)\n\n`;
    tool.faqs.forEach((faq: any) => {
      content += `**${faq.question}**\n${faq.answer}\n\n`;
    });
    return content;
  }

  // Generic FAQ
  return `## Frequently Asked Questions (FAQ)

**Is the ${tool.name} completely free to use?**
Yes! Cluster Tools provides this tool completely free of charge, with no hidden limits or premium paywalls.

**Is my data safe and private?**
Absolutely. The ${tool.name} processes everything locally in your browser. Your files, text, or data are never uploaded to any external servers.

**Do I need to install any software?**
No installation is required. This tool functions entirely online and is compatible with all modern web browsers including Chrome, Firefox, Safari, and Edge.

**Can I use this tool on my mobile device?**
Yes, the interface is fully responsive and optimized for mobile devices, tablets, and desktops alike.
`;
}

let generated = 0;

for (const tool of TOOLS_REGISTRY) {
  const filePath = path.join(CONTENT_DIR, `${tool.slug}.mdx`);
  
  // Skip if we already hand-wrote it (like image-compressor)
  if (fs.existsSync(filePath)) {
    console.log(`Skipping ${tool.slug} (already exists)`);
    continue;
  }

  const content = [
    generateFrontmatter(tool),
    generateValueProp(tool),
    generateWhatIs(tool),
    generateHowTo(tool),
    generateFAQ(tool)
  ].join("\n");

  fs.writeFileSync(filePath, content);
  generated++;
}

console.log(`Successfully generated ${generated} MDX files.`);
