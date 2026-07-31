/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    /* -------------------------------------------------------------------------
       RULE 1: No Cross-App Imports
       Apps should be fully isolated. The Student Portal should never import 
       code directly from the Admin Portal.
       ------------------------------------------------------------------------- */
    {
      name: 'no-cross-app-imports',
      comment: 'An app cannot import code from another app. Move shared logic to /libs.',
      severity: 'error',
      from: { path: "^apps/([^/]+)/" },
      to: { 
        path: "^apps/([^/]+)/",
        pathNot: "^apps/$1/" // Disallow importing from any app that isn't itself
      }
    },

    /* -------------------------------------------------------------------------
       RULE 2: Protect Admin-Only Libraries
       Ensure that public-facing portals (like Student or Library) cannot 
       import from sensitive administration libraries.
       ------------------------------------------------------------------------- */
    {
      name: 'no-admin-logic-in-public-portals',
      comment: 'Student and Library portals must not import administration or finance SDKs.',
      severity: 'error',
      from: { path: "^apps/(student-portal|library-portal|lms-web)/" },
      to: { path: "^libs/api-clients/(administration|governance)/" }
    },

    /* -------------------------------------------------------------------------
       RULE 3: Enforce UI Kit Usage
       Prevent apps from creating their own isolated UI components if they 
       should be using the central UI Kit.
       ------------------------------------------------------------------------- */
    {
      name: 'enforce-ui-kit',
      comment: 'Do not import core React DOM elements directly for styling; use @university-erp/ui-kit.',
      severity: 'warn', // Set to warn initially so it doesn't break existing builds
      from: { path: "^apps/" },
      to: { path: "styled-components|emotion" } // Example: block unauthorized styling libs
    },

    /* -------------------------------------------------------------------------
       RULE 4: Prevent Circular Dependencies
       Circular dependencies cause memory leaks and unpredictable behavior.
       ------------------------------------------------------------------------- */
    {
      name: 'no-circular-dependencies',
      comment: 'This project must not contain circular dependencies.',
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
    }
  }
};
