/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Circular dependencies cause maintenance issues and make code harder for AI agents to understand',
      from: {},
      to: {
        circular: true
      }
    },
    {
      name: 'no-orphans',
      severity: 'warn',
      comment: 'Orphan modules are not imported anywhere and may be dead code',
      from: {
        orphan: true,
        pathNot: [
          '(^|/)\\.[^/]+\\.(js|cjs|mjs|ts)$',
          '\\.d\\.ts$',
          '(^|/)tsconfig\\.json$',
          '(^|/)(babel|webpack)\\.config\\.(js|cjs|mjs|ts)$',
          '\\.test\\.(js|ts)$',
          'src/index\\.js$'
        ]
      },
      to: {}
    },
    {
      name: 'no-deprecated-core',
      severity: 'warn',
      comment: 'Deprecated Node.js core modules should be avoided',
      from: {},
      to: {
        dependencyTypes: ['core'],
        path: [
          '^(v8/tools/codemap)$',
          '^(v8/tools/consarray)$',
          '^(v8/tools/csvparser)$',
          '^(v8/tools/logreader)$',
          '^(v8/tools/profile_view)$',
          '^(v8/tools/profile)$',
          '^(v8/tools/SourceMap)$',
          '^(v8/tools/splaytree)$',
          '^(v8/tools/tickprocessor-driver)$',
          '^(v8/tools/tickprocessor)$',
          '^(node-hierarchical-edit-distance)$',
          '^(sys)$',
          '^(_linklist)$',
          '^(_stream_wrap)$'
        ]
      }
    },
    {
      name: 'not-to-test',
      severity: 'error',
      comment: 'Production code should not depend on test code',
      from: {
        pathNot: '\\.test\\.js$'
      },
      to: {
        path: '\\.test\\.js$'
      }
    },
    {
      name: 'no-duplicate-dep-types',
      severity: 'warn',
      comment: 'Dependencies should not appear in both dependencies and devDependencies',
      from: {},
      to: {
        moreThanOneDependencyType: true,
        dependencyTypesNot: ['type-only']
      }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    exclude: {
      path: [
        'node_modules',
        'website',
        'api-docs',
        '\\.test\\.js$'
      ]
    },
    includeOnly: [
      '^src/',
      '^scripts/build\\.js$'
    ],
    tsPreCompilationDeps: false,
    combinedDependencies: true,
    moduleSystems: ['es6', 'cjs'],
    prefix: ''
  }
};
