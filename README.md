yt-links-parser
===============

jquery plugin - converts youtube movie links within html document into embedded iframes or images (from movie) that are replaced with iframes with movie (with autoplay option on) after click

## Installation

Download files and include script *after* the jQuery library (unless you are packaging scripts somehow else):

```html
<script src="/path/to/yt-links-parser.js"></script>
```

If you want use ytLinksParseToImage methos you should also include css file:
```html
<link rel="stylesheet" type="text/css" href="/path/to/yt-links-parser.css">
```

**Probably you will like to change path to play image (yt_play.png) in css file.**

## Usage

To replace all occurrences of youtube links with actual youtube movies (iframe code):
```javascript
$("#container").ytLinksParse();
```

To replace all occurrences of youtube links with images from movie (autoplay after click):
```javascript
$("#container").ytLinksParseToImage();
```

If you want to change width and height of the movie you can pass an object containing width and height properties:
```javascript
$("#container").ytLinksParse({width:640, height:390});
```

**Both methods support object param.**