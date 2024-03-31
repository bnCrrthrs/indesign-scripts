# InDesign Scripts

Scripts for Adobe InDesign. They were developed for InDesign 2024 for Mac, and have only been tested enough to make sure they work for the specific cases I needed them for.

Some are really just ways of adding keyboard shortcuts to actions I do a lot. Others are more complicated. All of them are works in progress that I'm continuing to tweak and play with.

Two I'm particularly pleased with are `stackOrderByArticle.js` and `stackOrderBySelection` in the Layer Order section.

Summaries of them all are below, including my keyboard shortcuts when I've got them.

## colours

### removeDuplicateSwatches.js

Finds colours in your swatches panel that have the same colour space and colour values, and merges them together.

## export

### exportArticleText.js

Saves a text file of all text contained in an Article in the Articles panel. Includes alt-text for images. Currently anchored images have their alt-text placed at the end of the story they are anchored in.

### exportGraphicsList.js

Gives you the option of whether to export a text file containing a simple list of the image links in your indesign document, or a csv file containing details like the page the image appears on, the image format, file path etc.

### exportHyperlinks.js

Saves a csv file containing info on all the web links in your document, including the page the link appears on, the linked text, and the destination URLs.

The plan is/was to make a Perl script that could take this csv and then get and add the titles of the destination web pages, in order to add these titles into the InDesign hyperlink Accessibility Text field. Annoyingly at the minute I don't think you can access the Accessibility Text field through InDesign scripts. I'm still intending to make the Perl script, but they titles will have to be added manually at the minute.

## images

### relinkToFolder.js

Although it's already possible in InDesign to relink all your images to images contained in a different folder, this script allows you append/prepend/find and replace the filenames of the links.

So for example if you have a bunch of images in your document called things like _img1-rgb.jpg_, you can match them to a folder full of images called things like _img1-cmyk.jpg_

## layer-order

These scripts can help improve the accessibility of your pdfs.

When screen readers read pdfs, they use pdf tags to determine the order content should be read in. (One way of setting the order of these tags is using the Articles panel).

But other assistive technologies don't use pdf tags – instead they look at the stacking order of your pdf, starting at the lowest layers and working up.

I wrote these scripts to restack layers of an InDesign document, to make it easier to make sure the stacking order matches the tag order, so that different assistive technologies can use the same logical reading order.

### stackOrderByArticle.js

Asks you to select an existing layer, or create a new one. Then works through each item in each article in your articles panel, sequentially moving each item to the top of the selected layer. When the script has completed, everything in the articles panel is in the same layer, with the first item in the panel at the bottom of that selection, and the last item at the top.

If the item is a threaded text frame, each text frame in the story is moved sequentially to the top of the layer, so the reading order of stories is also preserved.

One difficulty is with grouped items: if an article item is grouped with other items, that item can't be moved to the top of the layer by itself. In this situation the script will ungroup the group before moving the item to the top of the layer. If this happens the script will produce an alert as to how many groups have been ungrouped.

### stackOrderBySelection.js

Looks at the selected page items, then uses the layer containing the first item in the selection to move each selected item to the top of.

This has the same effect as `stackOrderByArticle.js`, but uses the selection rather than the articles panel.

Again, when the selected item is a threaded text frame, each text frame in the story is moved sequentially to the top of the layer. This starts with the first text frame in the story, regardless of which frame was selected.

If multiple text frames from the same story are selected, the collection will only be processed for the first frame selected – subsequent selected frames from the same story will be ignored.

And as above, when an item that's part of a group is selected, the group is ungrouped and the item is moved. (If the group itself is selected, rather than a single item within it, then the whole group is moved and ungrouping is not necessary).

## misc

### importStyles.js

Allows you to select another saved InDesign document and choose sets of styles to import from it: Paragraph / Character / Object / Table and Cell / Table of Contents / Stroke styles. You also have the option to overwrite existing styles with the same name in your current document, or whether to rename imported styles when there is a name conflict.

### unassignEmptyTextFrames.js

Looks at all text frames in the document that have no content and are not threaded, and reassigns their content type to 'unassigned'.

## move-and-resize

This group of scripts all execute very simple actions, but I've found it really helpful to be able to assign shortcut keys to them and perform them quickly and precisely.

### alignBottomToBaseline.js

_My keyboard shortcut: opt + cmd + b_

Moves the selected object(s) so that the bottom edge – or the bottom baseline for text frames – lines up with the nearest line on the baseline grid. Text frames are also resized to fit the content.

### alignLeftColumn.js

_My keyboard shortcut: opt + cmd + n_

Moves the selected object(s) so that the left edge lines up with the nearest page column.

### alignTopToBaseline.js

_My keyboard shortcut: ctrl + opt + cmd + b_

Moves the selected object(s) so that the top edge – or for text frames, the baseline for the top line of text – lines up with the nearest line on the baseline grid.

### baselineExpand.js

_My keyboard shortcut: shift + fn + ctrl + opt + cmd + down_

Increases the height of the selected object(s) by the height of the baseline increment setting in the current document.

### baselineMoveDown.js

_My keyboard shortcut: fn + ctrl + opt + cmd + down_

Moves the position of the selected object(s) down the page by the height of the baseline increment setting in the current document.

### baselineMoveUp.js

_My keyboard shortcut: fn + ctrl + opt + cmd + up_

Moves the position of the selected object(s) up the page by the height of the baseline increment setting in the current document.

### baselineShrink.js

_My keyboard shortcut: shift + fn + ctrl + opt + cmd + up_

Decreases the height of the selected object(s) by the height of the baseline increment setting in the current document.

### widthExpand.js

_My keyboard shortcut: fn + ctrl + opt + cmd + right_

Increases the width of the selected object(s) by 10 × the keyboard increment (the same amount as an object moves when you press `cmd + →`)

### widthShrink.js

_My keyboard shortcut: fn + ctrl + opt + cmd + left_

Decreases the width of the selected object(s) by 10 × the keyboard increment (the same amount as an object moves when you press `cmd + →`)

## navigate

The three page navigation scripts are very useful when comparing two or more versions of the same document, or multiple different documents from the same template.

### goToNextPage.js

_My keyboard shortcut: shift + fn + ctrl + down_

Navigates to the next page of the current document, and navigates all other open documents to the equivalent page where possible.

### goToPage.js

_My keyboard shortcut: ctrl + opt + cmd + j_

Prompts you for a page number, and navigates to that page for each open document where possible.

### goToPreviousPage.js

_My keyboard shortcut: shift + fn + ctrl + up_

Navigates to the previous page of the current document, and navigates all other open documents to the equivalent page where possible.

### viewPasteboard.js

_My keyboard shortcut: ctrl + §_

Sets the zoom so that the whole pasteboard is visible.

### viewSpread.js

_My keyboard shortcut: cmd + §_

Sets the zoom so that the whole spread is visible.

## select

### selectParaContents.js

_My keyboard shortcut: cmd + esc_

Executing once when a text frame is selected will place the cursor at the start of the text frame.

Executing again will select the entire paragraph excluding the paragraph break at the end (this allows you replace the paragraph contents without merging with the subsequent paragraph if there is one).

Executing again will add the paragraph break to the selection, and executing again will add the subsequent paragraph.

### selectTextFrameContents.js

_My keyboard shortcut: opt + esc_

Selects the entire text content of a selected text frame, excluding the last character if it's a space (this allows you to replace the contents without merging with the subsequent paragraph if there is one).
