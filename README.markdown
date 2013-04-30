# jQuery ScrollFix 1.1

jQuery plugin to fix an element based on current scrolling position of the page when simple `position: fixed` is not enough.

See [demo.html](demo.html) for an example.

## Functionality

- adding a CSS class when the element is supposed to be fixed (its top coordinate is less than the current scroll position)
- positioning the fixed element correctly even if scrolling horizontally
- resizing the fixed element if needed (the `outerContainer` option)

## Browser support

Tested in Mozilla Firefox, Google Chrome, Safari, Opera and MSIE 7+

## Known limitations

- custom "scrollers" (e.g. a `div` with `overflow: scroll`) are not supported (yet)


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

    containerSelector.scroll-fix {
        /* Fill empty space left after the element in the container when it is positioned */
        /* Setting the option autoElementSubstitute to true can be used instead (see options below) */
        height: <insert value here>px;
    }

## Return value

The `$().scrollFix()` call returns an object with following methods:

- **update()** - perform scroll position check and update the element
- **updateScroll()** - perform scroll position check and update the element if necessary
- **updateSize()** - update the element

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
      <th>autoElementSubstitute</th>
      <td>false</td>
      <td>If set to true, a div with element's dimensions will be created to fill the space when the element is fixed.</td>
    </tr>

    <tr>
      <th>outerContainer</th>
      <td>null</td>
      <td>Element used to determine correct position and width of the fixed element (<code>body</code> can be used too).</td>
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
      <th>onResize</th>
      <td>null</td>
      <td>Custom function to call when the fixed element is resized.</td>
    </tr>
  </tbody>
</table>

