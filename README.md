> "What a terrible name."
>
> ~ Everybody

# faviconoclast

You know those little icons in your browser tabs? It gets those, basically. Pass it the URL to a webpage and it'll give you the URL to an icon for that page.

You can install faviconoclast for use in your nodejs project:

```
npm i faviconoclast --save
```

Or globally, to use on the command line:

```bash
npm i faviconoclast -g
```

## Usage

All you need to do is pass in a page URL. You can include the protocol if you like, but it's not required.

### As a module

```js
const faviconoclast = require('faviconoclast');

faviconoclast('cnn.com', (err, iconUrl) => {
  // http://i.cdn.turner.com/cnn/.e/img/3.0/global/misc/apple-touch-icon.png
  console.log(iconUrl);
});
```

### On the command line

```shell
$ faviconoclast cnn.com

# http://i.cdn.turner.com/cnn/.e/img/3.0/global/misc/apple-touch-icon.png
```
