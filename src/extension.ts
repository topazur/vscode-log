import { commands, window, workspace } from 'vscode'

import {
  TextInsertor,
  getConfiguration,
  getSelectOptAfterInsert,
  getSelectTextBeforeInsert,
  insertText,
} from './helper'
import defaultOptions from './options.json'

import type { ExtensionContext } from 'vscode'

export function activate(context: ExtensionContext) {
  const textInsertor = new TextInsertor(defaultOptions)

  function updateConfiguration() {
    const { options } = getConfiguration()
    textInsertor.updateOptions(options)
  }

  /** 注册命令 */
  const insertLogStatement = commands.registerCommand('extension.insertLogStatement', async () => {
    const editor = window.activeTextEditor
    if (!editor) {
      window.showErrorMessage('Can\'t insert log because no document is open')
      return
    }

    const selectTexts = getSelectTextBeforeInsert()
    await commands.executeCommand('editor.action.insertLineAfter')
    const selectOpts = getSelectOptAfterInsert()
    const result = textInsertor.createLogStatement(selectOpts, selectTexts)
    insertText(result)
  })
  context.subscriptions.push(insertLogStatement)

  /** 监听配置文件的变化 */
  workspace.onDidChangeConfiguration(() => {
    updateConfiguration()
  })
  /** 首次加载时，获取配置文件 */
  updateConfiguration()
}

export function deactivate() {
  // nothing todo
}
