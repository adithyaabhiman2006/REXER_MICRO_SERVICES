#!/usr/bin/env bash
set -euo pipefail

slug="${1:-}"
if [[ ! "$slug" =~ ^[a-z0-9]+(-[a-z0-9]+)*$ ]]; then
  echo "Usage: ./gen-tool.sh my-new-tool"
  echo "The slug must use lowercase kebab-case."
  exit 1
fi

name="$(printf '%s' "$slug" | awk -F- '{ for (i=1; i<=NF; i++) printf toupper(substr($i,1,1)) substr($i,2) }')"
target="components/tools/${name}.tsx"

if [[ -e "$target" ]]; then
  echo "$target already exists; nothing changed."
  exit 1
fi

cat > "$target" <<EOF
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { OutputField } from "@/components/tools/_shared";

export default function ${name}() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  return (
    <div className="space-y-4">
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Enter input…" />
      <Button variant="gradient" onClick={() => setOutput(input.trim())} disabled={!input.trim()}>
        Run tool
      </Button>
      {output && <OutputField value={output} />}
    </div>
  );
}
EOF

echo "Created $target"
echo "Next: add \"$slug\" to components/tools/index.ts and lib/registry/tools.ts."
