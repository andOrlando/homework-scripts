# homework-scripts
I don't wanna do homework please

Sooo now that I have to pay a bunch of money for homework portals I figured it'd be a good idea to get the least value for my money imaginable by skipping as much of the homework as I physically can. Ideally this repository is just gonna contain a bunch of bookmarks that you can copy and paste into your bookmarks and then do all your homework for you

That being said, **do not use this** unless you really really trust me. I can't stress enough how bad of an idea it is to execute someone else's javascript. I could theoretically change these scripts to be some kinda keylogger at any point and then I would kinda just have your passwords. Unless you know me in real life and could (hypothetically) come up to me in person and (hypothetically) smack me, you really shouldn't use this at all. Now I'm not going to do that, so if you really trust me that's fine, but you could also just self-host it or put it into a greasemonekey script or really anything that doesn't execute remote javascript.

**MyMathLab Bookmark**
```js
javascript:fetch("https://raw.githubusercontent.com/andOrlando/homework-scripts/main/mymathlab.js").then(a=>a.text()).then(eval)
```

**zyBooks Bookmark**
```js
javascript:fetch("https://raw.githubusercontent.com/andOrlando/homework-scripts/main/zybooks.js").then(a=>a.text()).then(eval)
```

**Perusall Bookmark**
```js
javascript:fetch("https://raw.githubusercontent.com/andOrlando/homework-scripts/main/perusall.js").then(a=>a.text()).then(eval)
```

- [X] zyBooks
  - solves all non-challenge and non-draggy bits
  - if you let it keep going it can do literally all your homework
- [X] Perusall
  - only scrolls through to generate you some base points
- [X] MyMathLab
  - adds a console
  - console literally just evaluates javascript strings but also adds a matrix object
  - said object can calc a bunch of stuff about matrices
  - can also rip matrices from the screen, hence why it's actually useful for mymathlab in the first place
