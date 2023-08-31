# Drill4J Admin UI

Env variables:

```ini
# Required; Specify URLs to load test2code-ui module from. Use the example string below to use test2code-ui@0.8.0-78
UI_PLUGINS_URLS="test2code#https://cdn.jsdelivr.net/npm/@drill4j/test2code-ui@0.8.0-78/dist/Drill4J-test-to-code.js"

# Required; Address to ping Drill4J Admin Backend before launching Admin UI
WAIT_HOSTS="drill-admin:8090"

# Optional; Customize nginx port to bind to, default is 8080
NGINX_PORT="8080"
```

## For development

For development you need a [node.js](https://nodejs.org).

Current versions
```
$ node --version
v16.17.0

$ npm --version
8.15.0
```

To launch the development environment, follow these steps:

1. open console from the project root
2. run the command `npm install`
3. run the command `npm run start`
4. enjoy the development.

## Ui-kit

### For development

1. clone [ui-kit repo](https://github.com/Drill4J/ui-kit)
2. run the command `npm install`
3. run the command `npm run start:standalone`
4. copy url from terminal and paste it to `index.ejs` file in first script tag with contain `imports` key object with key is `@drill4j/ui-kit` and value is url. Example

``
"imports": {
    "@drill4j/ui-kit": "http://localhost:8000/drill4j-ui-kit.js"
}
``

