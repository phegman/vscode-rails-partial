This is a fork that adds support for two new settings:

`railsPartial.renderMethods` - The render methods that this plugin detects. Useful for custom render methods.
`railsPartial.viewFilePaths` - The paths where the partials are. Helpful if they are in multiple directories.

### How to install this fork?

1. Clone this repository
2. Make sure this repository is your working directory and run `code --install-extension rails-partial-0.3.4.vsix`

# Rails Partial

Definition, Completion and CodeAction provider for Rails Partial.

## Features

### Definition

![Definition](https://i.gyazo.com/f47ef367e1b2b26a9bb566b3be0e5034.gif)

### Completion

![Completion](https://i.gyazo.com/c4ab035dd8a47b3c1de0ebf2160e78d7.gif)

### CodeAction

![CodeAction](https://i.gyazo.com/6e68f3249bb0b208954eb9b909353283.gif)

## Extension Settings

If you want to change template engine like haml, override default setting in setting view.

- `railsPartial.viewFileExtensions`: `[html.haml, html.slim, html.erb]`
