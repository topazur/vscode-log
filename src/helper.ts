import { Range, window, workspace } from 'vscode'

interface SelectOpt {
  range?: Range
  lineNumber?: string
  text?: string
}

/**
 * @title 获取配置文件信息
 */
export function getConfiguration() {
  const options = workspace.getConfiguration('vscode-log').get<Record<string, string>>('options')
  return { options }
}

/*******************************************************************/
/*******************************************************************/

/**
 * @title 插入文本工具类
 * @desc 支持正则匹配编程语言
 */
export class TextInsertor {
  public options: Record<string, string>

  constructor(options: Record<string, string>) {
    this.options = options
  }

  /**
   * @title 更新配置文件后，更新 options
   */
  updateOptions(options?: Record<string, string>) {
    this.options = Object.assign(this.options, options)
  }

  /**
   * @title 生成 log 语句
   * @param languageId 当前文件的语言
   * @param fileName 当前文件的文件名
   * @param line 当前光标所在行
   * @param selection 当前选中的文本
   * @returns {string}
   */
  createLogStatement(selectOpts: SelectOpt[], selectTexts: SelectOpt[]): SelectOpt[] {
    const editor = window.activeTextEditor!
    const languageId = editor.document.languageId
    const fileName = editor.document.fileName.split('/').pop() ?? 'unknown'
    const extension = fileName.split('.').pop() ?? 'unknown'

    const results = selectOpts.map((selectOpt, i) => {
      const { text = '' } = selectTexts[i]
      const { range, lineNumber = '' } = selectOpt

      const format = this.options.format.replace('{fileName}', fileName).replace('{line}', lineNumber)

      // 优先匹配语言，其次匹配文件后缀
      let statement = ''
      for (const key in this.options) {
        if (key === 'format')
          continue
        const regexp = new RegExp(key.slice(1, -1))
        if (regexp.test(languageId) || regexp.test(extension)) {
          statement = this.options[key].replace('{format}', format).replace('{selection}', text)
          break
        }
      }

      return { range, text: statement }
    })

    return results
  }
}

/**
 * @title 在 'editor.action.insertLineAfter' 之前获取选中的文本
 * @api `const lineText = editor.selections` 选中的代码块 (可能同时选中多个代码块)
 * @api `const lineText = editor.document.lineAt(line).text` 获取某一行的文本
 * @api `selection.isSingleLine` 是否为单行选择
 */
export function getSelectTextBeforeInsert(): SelectOpt[] {
  const editor = window.activeTextEditor!

  const selections = editor.selections.map((selection) => {
    const text = editor.document.getText(selection).replaceAll('\n', ' ')
    return { text }
  })
  return selections
}

/**
 * @title 在 'editor.action.insertLineAfter' 之后获取光标
 */
export function getSelectOptAfterInsert(): SelectOpt[] {
  const editor = window.activeTextEditor!

  const selections = editor.selections.map((selection) => {
    const range = new Range(selection.start, selection.end)
    const lineNumber = (selection.end.line + 1).toString()
    return { range, lineNumber }
  })
  return selections
}

/**
 * @title 在 'editor.action.insertLineAfter' 之后获取光标，并插入 getSelectTextBeforeInsert 获取的文本
 */
export function insertText(result: SelectOpt[]) {
  const editor = window.activeTextEditor!

  editor.edit((editBuilder) => {
    for (let i = 0; i < result.length; i++) {
      const { range, text = '' } = result[i]
      editBuilder.replace(range!, text)
    }
  })
}

/*******************************************************************/
/*******************************************************************/

