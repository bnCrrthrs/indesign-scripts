# InDesign Scripts

These are InDesign scripts that might be useful to others

## Base Line Expand/Shrink/Move Up/Move Down

These four scripts calculate the size between lines in the baseline grid of the current document, then move an object or increase/decrease its height by that ammount.

## fitImagesToFrames.js

Probably a bit janky as it was made for a very specific purpose, but (ideally) it scales all images to fill their frames proportionally, rotating them depending on whether the frames are portrait or landscape.

## goToPage / goToNextPage / goToPreviousPage

This will change the active page for **all** open documents, and set the view to see the whole page and pasteboard. It's useful when you're working on different drafts of the same template.

## importStyles

This will allow you to choose a file and what to import from it: Paragraph/Character/Object/Table styles etc

## jongware_textInFrame

Originally taken from a forum post by Jongware, but built upon. It places the cursor inside a selected text frame. If no text frame is selected, then any object on the page is selected.

## removeDuplicateSwatches

Consolidates swatches that have the same colour space and value.

## selectNext / selectPrevious.js

Selects the object above or below **each** item in the selection. This is useful when working on layouts with multiple layers.

## stackOrderByArticle.js

Will look at each item in each article in the articles panel, and move them one by one to a chosen layer. This allows you to set the stacking/reading order to match the tag order very easily. If an item is a threaded text frame, each frame in the thread is moved sequentially too, so the story stays in the correct order.

## stackOrderBySelection.js

Takes the selected items in the order they were selected, and moves them in that order to the top of the layer of the first item in the selection. When an item is a threaded text frame, each frame in that story is moved sequentially too. Allows the same result as stackOrderByArticle, but applies just to the selection.

## trailingLineBreakAdd / trailingLineBreakRm.js

Adds or removes line breaks to the end of the selected story. This can be useful for breaking/linking text threads.

## widthExpand / widthShrink.js

This increases or decreases the width of an object based on the same amount as 10 × the keyboard increment (so the same amount as holding **cmd + →**)

## saveAll.js

This simply saves all open documents (after confirmation).
