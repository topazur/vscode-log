module.exports = {
  extends: '@antfu/eslint-config-ts',
  rules: {
    'sort-imports': ['error', {
      ignoreCase: false,
      // 忽略导入声明语句的排序。
      ignoreDeclarationSort: true,
      // 忽略多成员导入声明中的成员排序
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      // 导入声明语句后的空行、注释行或任何其他语句将重置导入声明语句的排序
      allowSeparatedGroups: true,
    }],
    // [import/order](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md)
    'import/order': ['error',
      {
        'groups': ['builtin', 'external', ['internal', 'parent', 'sibling', 'index'], 'unknown', 'object', 'type'],
        'newlines-between': 'always',
        'pathGroupsExcludedImportTypes': [],
        'warnOnUnassignedImports': false,
      },
    ],
  },
}
