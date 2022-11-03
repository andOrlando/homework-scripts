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
  - object methods (all return new objects, no need to worry about mutability):
    - `getMatrix()`: 2D array representing the values of the matrix
    - `getRow(n)`: nth row as array
    - `getCol(n)`: nth column as array
    - `add(other)`: sum of matrix and the other matrix
    - `multiply(other)`: product of this matrix and the other matrix
    - `scalarMultiply(scalar)`: product of the scalar and this matrix
    - `concatenateRows(other)`: adds columns of other onto the right of this matrix
    - `copyToClipboard()`: TODO
    - `getRref()`: matrix that's the rref of this matrix
    - `getSolutions()`: assumes last col is b, solves Ax=b, returning [x_h, x_p] where x_p is a matrix and x_h a list of matrices
    - `getKernel()`: returns array of matrices which span kernel
    - `getDeterminant()`: calcs determinant
    - `getInverse()`: TODO
    - `getTranspose()`: returns transpose
    - `toString()`: turns to string
  - object properties (these are read-only or you might mess something up) (if you can't tell, for most of the properties I just cache the function calls because matrices are supposed to be immutable):
    - `m`: rows
    - `n`: cols
    - `entries`: entries as a list
    - `matrix`: entries as a 2D array
    - `rref`: rref matrix
    - `solution`: solution
    - `kernel`: kernel
    - `image`: image
    - `determinant`: determinant
    - `inverse`: inverse
    - `transpose`: transpose
  - non-javascript-commands:
    - `toggle`: hide all but the console window or show it
    - `compile`: rip matrices from screen and put them into global variables
    - `clear`: clears screen
