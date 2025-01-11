# Vim: insert the same characters across multiple lines
Sometimes I want to edit a certain visual block of text across multiple lines.

For example, I would take a text that looks like this:

```
name
comment
phone
email
```

And make it look like this

```
vendor_name
vendor_comment
vendor_phone
vendor_email
```

Currently the way I would do it now is...

<ol>
<li>Select all 4 row lines of a block by pressing <kbd>V</kbd> and then <kbd>j</kbd> four times.</li>
<li>Indent with <kbd>></kbd>.</li>
<li>Go back one letter with <kbd>h</kbd>.</li>
<li>Go to block visual mode with <kbd>Ctrl</kbd><kbd>v</kbd>.</li>
<li>Select down four rows by pressing <kbd>j</kbd> four times. At this point you have selected a 4x1 visual blocks of whitespace (four rows and one column).</li>
<li>Press <kbd>C</kbd>. Notice this pretty much indented to the left by one column.</li>
<li>Type out a **" vendor_"** without the quote. Notice the extra space we had to put back.</li>
<li>Press <kbd>Esc</kbd>. This is one of the very few times I use <kbd>Esc</kbd> to get out of insert mode. <kbd>Ctrl</kbd><kbd>c</kbd> would only edit the first line.</li>
<li>Repeat step 1.</li>
<li>Indent the other way with <kbd>&lt;</kbd>.</li>
</ol>

I don't need to indent if there is at least one column of whitespace before the words. I wouldn't need the whitespace if I didn't have to clear the visual block with <kbd>c</kbd>.

But if I have to clear, then is there a way to do what I performed above without creating the needed whitespace with indentation?

Also why does editing multiple lines at once only work by exiting out of insert mode with <kbd>Esc</kbd> over <kbd>Ctrl</kbd><kbd>c</kbd>?

<hr/>

Here is a more complicated example:

```
name    = models.CharField( max_length = 135 )
comment = models.TextField( blank = True )
phone   = models.CharField( max_length = 135, blank = True )
email   = models.EmailField( blank = True )
```

to

```
name    = models.whatever.CharField( max_length = 135 )
comment = models.whatever.TextField( blank = True )
phone   = models.whatever.CharField( max_length = 135, blank = True )
email   = models.whatever.EmailField( blank = True )
```

In this example I would perform the vertical visual block over the **.**, and then reinsert it back during insert mode, i.e., type **.whatever.**. Hopefully now you can see the drawback to this method. I am limited to only selecting a column of text <strong>that are all the same in a vertical position</strong>.
## Answer 1
you can do with replace with new line (except first line)
```
name
comment
phone
email
```
with
```
%s/\n/\rvendor_/g
```
and its replace every new line with new line + vendor_ string so seems like this
```
name
vendor_comment
vendor_phone
vendor_email
```
you can edit first line manuel
## Answer 2
An alternative that can be more flexible:
Example: To enter the text XYZ at the beginning of the line
```
:%norm IXYZ
```
What's happening here?
<ul>
<li>**%** == Execute on every line</li>
<li>**norm** == Execute the following keys in normal mode (short for **normal**)</li>
<li>**I** == Insert at beginning of line</li>
<li>**XYZ** == The text you want to enter</li>
</ul>
Then you hit <kbd>Enter</kbd>, and it executes.
Specific to your request:
```
:%norm Ivendor_
```
You can also choose a particular range:
```
:2,4norm Ivendor_
```
Or execute over a selected visual range:
```
:'&lt;,'&gt;norm Ivendor_
```
Or execute for each line that matches a 'target' regex:
```
:%g/target/norm Ivendor_
```

# How do I repeat an edit on multiple lines in Vim?
I'm aware that in Vim I can often repeat a command by simply adding a number in front of it. For example, one can delete 5 lines by:

```
5dd
```

It's also often possible to specify a range of lines to apply a command to, for example

```
:10,20s:hello:goodbye:gc
```

How can I perform a 'vertical edit'? I'd like to, for example, insert a particular symbol, say a comma, at the beggining (skipping whitespace, i.e. what you'd get if you type a comma after Shift-I in command mode) of every line in a given range. How can this be achieved (without resorting to down-period-down-period-down-period)?
## Answer 1
With your edit already saved in the **.** operator, do the following:

<ol>
<li>Select text you want to apply the operator to using visual mode</li>
<li>Then run the command **:norm .**</li>
</ol>
## Answer 2
**:10,20s/^/,/**

Or use a macro, record with:

**q a i , ESC j h q**

use with:

**@ a**

Explanation: **q a** starts recording a macro to register **a**, **q** ends recording. There are registers **a** to **z** available for this.

# Vim multiline editing like in sublimetext?
I started to use gvim, and I can't quite understand how the multiline edit works in gvim.

For example:

Original text:

```
asd asd asd asd asd;
asd asd asd asd asd;
asd asd asd asd asd;
asd asd asd asd asd;
asd asd asd asd asd;
asd asd asd asd asd;
asd asd asd asd asd;
```

ctrl+q, jjjjjj , $
everything is selected, then i press I to do a multiline insert.

My intention is to insert quotes like in the first line, and then to press Esc:

```
asd "asd asd" asd asd;
asd asd asd asd asd;
asd asd asd asd asd;
asd asd asd asd asd;
asd asd asd asd asd;
asd asd asd asd asd;
asd asd asd asd asd;
```

What happened? I expected a behavior similar to sublimetext's one:

<img src="https://i.sstatic.net/nJ0sC.gif" alt="enter image description here">

If you don't know how that works, it just repeats the actions for every line. How can achieve that? And what is vim doing here?
## Answer 1
If you use the &quot;global&quot; command you can repeat what you would do on one line on any number of lines.
```
:g/&lt;search&gt;/.&lt;your ex command&gt;
```
For example:
```
:g/foo/.s/bar/baz/g
```
The above command finds all lines that have foo and replaces all occurrences of bar on that line with baz.
```
:g/.*/
```
will execute on every line
## Answer 2
There are several ways to accomplish that in Vim. I don't know which are most
similar to Sublime Text's though.
<hr />
The first one would be via <em>multiline insert mode</em>. Put your cursor to the
second &quot;a&quot; in the first line, press <kbd>Ctrl-V</kbd>, select all lines, then press <kbd>I</kbd>(capital i), and
put in a doublequote. Pressing <kbd>Escape</kbd> will repeat the operation on every line.
<hr />
The second one is via macros. Put the cursor on the first character, and start
recording a macro with **qa**.
Go the your right with **llll**, enter insert mode with
**a**, put down a doublequote, exit insert mode, and go back to the beginning of
your row with **&lt;home&gt;** (or equivalent). Press **j** to move down one row.
Stop recording with **q**.
And then replay the macro with **@a**. Several times.
<hr />
Does any of the above approaches work for you?

# How to insert text at beginning of a multi-line selection in vi/Vim
In <a href="http://en.wikipedia.org/wiki/Vim_%28text_editor%29" rel="noreferrer">Vim</a>, how do I  insert characters at the beginning of each line in a selection?

For instance,  I want to comment out a block of code by prepending **//** at the beginning of each line assuming my language's comment system doesn't allow block commenting like **/* */**.  How would I do this?
## Answer 1
Here’s another way, which I use often due to its advantages.
<ol>
<li>Make a visual selection any way you like, eg. **vip** or **&lt;shift&gt;+V**;</li>
<li>**:** to enter command mode;</li>
<li>**norm gIxxx &lt;enter&gt;** where **xxx** is **//** or any other characters you prefer.</li>
</ol>
## Answer 2
<ol>
<li>Press <kbd>Esc</kbd> to enter 'command mode'</li>
<li>Use <kbd>Ctrl</kbd>+<kbd>V</kbd> to enter visual block mode (try <kbd>Ctrl</kbd>+<kbd>Q</kbd>, if V doesn't work)</li>
<li>Move <kbd>Up</kbd>/<kbd>Down</kbd> to select the columns of text in the lines you want to
comment.</li>
<li>Then hit <kbd>Shift</kbd>+<kbd>i</kbd> and type the text you want to insert (or type **x** to delete)</li>
<li>Then hit <kbd>Esc</kbd>, wait 1 second and the inserted text will appear on every line.</li>
</ol>
For further information and reading, check out &quot;<a href="https://vim.wikia.com/wiki/Inserting_text_in_multiple_lines" rel="noreferrer">Inserting text in multiple lines</a>&quot; in the Vim Tips Wiki.
