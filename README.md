# homework-scripts
I don't wanna do homework please

Sooo now that I have to pay a bunch of money for homework portals I figured it'd be a good idea to get the least value for my money imaginable by skipping as much of the homework as I physically can. Ideally this repository is just gonna contain a bunch of bookmarks that you can copy and paste into your bookmarks and then do all your homework for you

That being said, **do not use this** unless you really really trust me. I can't stress enough how bad of an idea it is to execute someone else's javascript. I could theoretically change these scripts to be some kinda keylogger at any point and then I would kinda just have your passwords. Unless you know me in real life and could (hypothetically) come up to me in person and (hypothetically) kick me in the shins, you really shouldn't use this at all. Now I'm not going to do that, so if you really trust me that's fine, but you could also just self-host it or put it into a greasemonekey script or really anything that doesn't execute remote javascript.

Also this is all totally theoretical, just as one would make a really shady crypto miner and open source it just for testing purposes. I definitely haven't used this myself because I'm too academically dignified. You also should not use this yourself because you're also academically dignified.

**Add this bookmark for any of the pages**
```js
javascript:fetch("https://raw.githubusercontent.com/andOrlando/homework-scripts/main/main.js").then(a=>a.text()).then(eval)
```

**zyBooks**
 - solves everything but the challenge sections
 - if you let it keep going it can do literally all your homework
 - you don't even have to press buttons, just let it do its thing and when you come back you'll have a finished zybooks
 - if you wanna let it solve everything you have to type `finisheverything="yes"` in the console before you run the script
 - otherwise it'll just solve the page
 
**Perusall**
 - only scrolls through to generate you some base points
 
**MyMathLab**
 - currently kinda broken according to my linear friends
 - can't be bothered to fix it because I'm no longer taking linear
 - adds a console
 - console literally just evaluates javascript strings but also adds a matrix object
 - said object can calc a bunch of stuff about matrices
 - can also rip matrices from the screen, hence why it's actually useful for mymathlab in the first place
 - object methods (all return new objects, no need to worry about mutability):
   - `getMatrix()`: 2D array representing the values of the matrix
   - `getRow(n)`: nth row as array
   - `getCol(n)`: nth column as array
   - `add(other)`: sum of matrix and the other matrix
   - `multiply(other)`: product of this matrix and the other matrix or scalar
   - `append(other)`: adds columns of other onto the right of this matrix
   - `copy()`: copies pasteable stuff into mymathlab
   - `copylatex()`: same thing but for wolfram
   - `toString()`: turns to string
 - object properties--these are read-only or it might break stuff. If you want a mutable copy, use getter syntax like `getMatrix` or `getInverse` for anything other than entries.
   - `m`: rows
   - `n`: cols
   - `entries`: entries as a list
   - `matrix`: entries as a 2D array
   - `rref`: rref matrix
   - `solution`: solution
   - `kernel`: kernel
   - `image`: image
   - `determinant`: determinant
   - `minors`: matrix of minors
   - `cofactors`: matrix of cofactors
   - `adjugate`: adjugate
   - `inverse`: inverse
   - `transpose`: transpose
 - static methods:
    - `identity(n)` create identity matrix in R^nxn
 - non-javascript-commands:
   - `toggle`: hide all but the console window or show it
   - `compile`: rip matrices from screen and put them into global variables **this one's actually important** this is like the only command that matters
   - `clear`: clears screen
   
**webassign**
 - Adds buttons to all equations that let you copy the latex of the equation. This can *theoretically* be pasted into wolfram alpha but none of us would do that because we're academically honest
 - This was made as part of Hack UMass 2022 with Marshall, Elijah, Aditi and Cynthia but was folded into this since we're not really continuing that project

**kendall hunt content**
 - When used on a results page, commits all questions and answers to a local database.
 - When used on a quiz page, the check button solves the current question if it has an answer in the database and the double check solves all questions it knows the answer to
 - copy button selects raw json data (so you can copy and paste it into some external place or share it or something)
 - print button selects a prettier version of json data, ordered by question number
 - keyboard button allows you to input json data or, if prepended with a +, add on to your current database.
   - if you overwrite your data accidentally, you can recover your old data with localStorage.getItem("olddata")

**classquestion**
 - Automatically picks A so you can get that free ~77.5% without actually going to class or constantly glancing over at your computer
 - That's literally it
 - It's like 6 lines

**TODO:**
 - [ ] make double/triple integrals wihtout expressions work correctly (webassign sees them as a single integral)
 - [ ] make sin/cos work correctly by parsing parenthesis but that'd be a lot of work so idk
 - [x] make alternate perusall script that clicks on and off the assignment to generate more points
 - [ ] make zybooks script better so its easier to finish everything in one go
