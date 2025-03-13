+++
title = "Real-time vimdiff Without Saving Files to Compare Clipboard Content"
date = 2025-03-13
description = "Paste text to compare in vimdiff without creating files."
+++

I often want to compare a few lines of text without saving them to files.

Here's a command that creates a two-pane `vimdiff` where you can paste text and see differences highlighted in real-time:

{{ aside(text="Inspired by this [Stack Overflow answer](https://vi.stackexchange.com/a/15861).") }}

```bash
vim -c "set noswapfile" \
    -c "vnew" \
    -c "windo setlocal nobuflisted buftype=nofile noswapfile" \
    -c "set diffopt=filler,iwhite" \
    -c "windo diffthis" \
    -c "wincmd h" \
    -c "autocmd TextChanged,TextChangedI * diffupdate"
```

Here's what each part does:

- `set noswapfile` disables vim's swap files for these buffers
- `vnew` creates a new vertical split window
- `windo setlocal nobuflisted buftype=nofile noswapfile` sets both windows to not appear in buffer list and not be associated with files
- `set diffopt=filler,iwhite` configures diff to show filler lines and ignore whitespace differences
- `windo diffthis` activates diff mode in both windows
- `wincmd h` moves cursor to the left window
- `autocmd TextChanged,TextChangedI * diffupdate` automatically updates diff highlighting whenever text changes. Otherwise you'd need to manually run `:diffupdate`

I added it as an alias to my shell configuration:

```bash,name=~/.bash_aliases
alias dp='vim -c "set noswapfile" -c "vnew" -c "windo setlocal nobuflisted buftype=nofile noswapfile" -c "set diffopt=filler,iwhite" -c "windo diffthis" -c "wincmd h" -c "autocmd TextChanged,TextChangedI * diffupdate"'
```

Now I can run `dp` (for `diff paste`) and get instant diffing.

---

## Extra: VS Code equivalent

There's an equivalent feature in Visual Studio Code: press `⌘+Shift+P` to open the command palette and search for "File: Compare New Untitled Text Files".

Search for `workbench.files.action.compareNewUntitledTextFiles` to set up a keybinding for it.
