# e2e

## For development

For development you need a [node.js](https://nodejs.org).

To launch the development environment, follow these steps:

1.  open console from the project root
2.  run the command `npm install`
3.  run the command `npm run start`
4.  enjoy the development.

## Important

The usePluginUrls hook is used to load plugins. In production mode, it downloads a json object at /plugin-urls.json. 
In dev mode, it accesses the devModePaths object and takes links to plugins from it. Object keys must contain the name of the plugin (as on the backend), the value is the address from which the plugin code is downloaded  

