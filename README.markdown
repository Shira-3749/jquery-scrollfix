# jQuery ScrollFix

jQuery plugin to fix an element based on current scrolling position of the page when simple `position: fixed` is not enough.

See [demo.html](demo.html) for an example.

## Functionality

- adding a CSS class when the element is supposed to be fixed (its top coordinate is less than the current scroll position)
- positioning the fixed element correctly even if scrolling horizontally
- resizing the fixed element if needed

## Browser support

Tested in Mozilla Firefox, Google Chrome, Safari, Opera and MSIE 7+

## Known limitations

- custom "scrollers" (e.g. a `div` with `overflow: scroll`) are not supported


----------


## Usage

The plugin provides single jQuery method you can use.

### `$(container).scrollFix(element, options);`

- **container** - selector of or element that contains the fixed element
- **element** - selector of element inside the container that will be fixed
- **options** - object with various settings (optional)

This method can be called as soon as the given elements exist but usage of `$(document).ready()` is recommended.

## Required HTML

Example:

    <div id="fixed-container">
        <div id="fixed-element">
            Lorem ipsum
        </div>
    </div>

## Required CSS

    /* Make the element fixed when it has the scroll-fix class */
    elementSelector.scroll-fix {
        position: fixed;
        top: 0;
    }

## Return value

The `$().scrollFix()` call returns an object with following methods:

- **update()** - update element's state and dimensions
- **updateState()** - update element's state
- **updateDimensions()** - update element's dimensions

## Options

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th>scroller</th>
      <td>window</td>
      <td>Element to watch for scrolling events, only <code>window</code> is supported now.</td>
    </tr>

    <tr>
      <th>elementSubstitute</th>
      <td>true</td>
      <td>Create invisible clone of the element to fill the space when the element is fixed.</td>
    </tr>

    <tr>
      <th>outerContainer</th>
      <td>null</td>
      <td>Element used to determine correct position of the fixed element (<code>body</code> can be used too).</td>
    </tr>

    <tr>
      <th>elementFixClass</th>
      <td>scroll-fix</td>
      <td>Class added to the element when it is supposed to be fixed.</td>
    </tr>

    <tr>
      <th>containerFixClass</th>
      <td>scroll-fix</td>
      <td>Class added to the element's container when it is fixed.</td>
    </tr>

    <tr>
      <th>fixBoundaryOffset</th>
      <td>0</td>
      <td>Offset aplied when detecting whether to fix the element.</td>
    </tr>

    <tr>
      <th>unfixBoundaryOffset</th>
      <td>0</td>
      <td>Offset aplied when detecting whether to unfix the element.</td>
    </tr>

    <tr>
      <th>updateWidth</th>
      <td>true</td>
      <td>Update element's width dynamically (requires <strong>elementSubstitute</strong> to be enabled).</td>
    </tr>

    <tr>
      <th>onResize</th>
      <td>null</td>
      <td>Custom function to call when the fixed element is resized.</td>
    </tr>
  </tbody>
</table>

