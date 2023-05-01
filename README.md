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

