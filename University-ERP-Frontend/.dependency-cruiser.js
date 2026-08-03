/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-cross-app-imports',
      comment: 'An app cannot import code from another app. Move shared logic to /libs.',
      severity: 'error',
      from: { path: '^apps/([^/]+)/' },
      to: {
        path: '^apps/([^/]+)/',
        pathNot: '^apps/$1/'
      }
    },
    {
      name: 'no-admin-logic-in-public-portals',
      comment: 'Student, LMS, and Library portals must not import administration or governance clients.',
      severity: 'error',
      from: { path: '^apps/(student-portal|library-portal|lms-web)/' },
      to: { path: '^libs/api-clients/(administration|governance)/' }
    },
    {
      name: 'no-circular-dependencies',
      comment: 'Circular dependencies cause memory leaks and runtime issues.',
      severity: 'error',
      from: {},
      to: { circular: true }
    }
  ],
  options: {
    doNotFollow: {
      path: 'node_modules'
    },
    tsConfig: {
      fileName: 'tsconfig.json'
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default']
    }
  }
};