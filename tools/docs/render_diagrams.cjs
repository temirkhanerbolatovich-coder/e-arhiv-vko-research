// Parse the proposal and render local technical diagrams; no data is uploaded.
const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '../..');
const toolArg = process.argv.indexOf('--tool-dir');
const toolDir = toolArg >= 0 ? path.resolve(process.argv[toolArg + 1]) : __dirname;
const fromTools = createRequire(path.join(toolDir, 'package.json'));
const { Parser } = fromTools('@dbml/core');
const model = Parser.parse(fs.readFileSync(path.join(root, 'docs/database/schema.dbml'), 'utf8'), 'dbmlv2');
console.log(`DBML validated: ${model.schemas.reduce((n, s) => n + s.tables.length, 0)} tables`);
const cli = path.join(toolDir, 'node_modules/@mermaid-js/mermaid-cli/src/cli.js');
const directory = path.join(root, 'docs/database/diagrams');
for (const name of fs.readdirSync(directory).filter(x => x.endsWith('.mmd')).sort()) {
  for (const format of ['svg', 'png']) {
    const output = path.join(directory, name.replace(/\.mmd$/, `.${format}`));
    const result = spawnSync(process.execPath, [cli, '-i', path.join(directory, name), '-o', output,
      '-c', path.join(__dirname, 'mermaid-config.json'), '-b', 'white', '--size', '2800', '-s', '1.5'],
      { encoding: 'utf8', timeout: 120000 });
    if (result.error || result.status !== 0) {
      console.error(result.error?.message || result.stderr || result.stdout);
      process.exit(1);
    }
    console.log(`Rendered ${path.basename(output)}`);
  }
}
