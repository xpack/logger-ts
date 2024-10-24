# Website

This website is built using [Docusaurus](https://docusaurus.io/),
a modern static website generator.

The folder was created with:

```sh
npx create-docusaurus website classic --typescript
```

## TypeDoc (docusaurus-plugin-typedoc)

The plugin generates the markdown pages in `doc/api`.

- https://typedoc-plugin-markdown.org/plugins/docusaurus

```sh
cd website
npm install typedoc typedoc-plugin-markdown docusaurus-plugin-typedoc --save-dev
```

