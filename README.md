## vscode-log

> Visual Studio Code extension to outputting of log statements in various language files.

## Installing

This extension is available for free in the [Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=odinlin.vscode-log)

## Usage

With selection (<b style="color: red;">single or multiple selections</b>):
* Highlight a variable (or really any text)
* Press Cmd+Shift+L
* The output (on a new line) will be: console.log('{format}', variable);

Without selection:
* Press Cmd+Shift+L
* The output (on the same line) will be: console.log('{format}', );

## Configuration

- pr

> If you want to add log statements for your commonly used language, please modify both `options.ts` and `README.md` files at the same time.

```json
{
  /** variables: {fileName}, {line} */
  "format": "[vscode-log] {fileName}@Line {line}: ",

  /**
   * language files
   * NOTICE: 必须对特殊符号进行转义，eg: 引号、换行符等
   */
  "/javascript|typescript|vue|html|svelte/": "console.log(\"{format}\", {selection});",
  "/go/": "fmt.Printf(\"{format}%#v\\n\", {selection})"
}
```

- local

> Assigning `vscode-log.options` in `{User}/settings.json` can override `defaultOptions`.

```json
{
  "vscode-log.options": {
    "/go/": "fmt.Printf(\"{format}%#v\\n\", {selection})"
  }
}
```

## License
[MIT License](LICENSE)
