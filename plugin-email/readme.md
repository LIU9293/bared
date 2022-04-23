
## Plugin System for Bared CMS

A plugin should define following exports 


```JavaScript

// optional, if a plugin wants to add extra columns/attributes to user data type
extendUserAttributes: (userAttributes) => { return extendedAttrbutes },

// data types defined by this plugin
schemas: [
  { tableName: 'email_provider', displayName: 'Email Provider', attributes: [] },
  { tableName: 'email_template', ... }
],

// routes defined by this plugin, same as general routes
routes: [],

// services will be added to global bared.services object
services: []

```