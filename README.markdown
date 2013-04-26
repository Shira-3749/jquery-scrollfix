# jQuery ScrollFix 1.0

jQuery plugin to fix an element based on current scrolling position of the page.

## Browser support

Tested in Firefox, Google Chrome, Safari, Opera and MSIE 7+

## Usage

The plugin provides single jQuery method you can use.

### `$(containerSelector).scrollFix(elementSelector, options);`

Custom CSS is required for this to have effect:

    /* Make the element fixed when it has the scroll-fix class */
    elementSelector.scroll-fix {
        position: fixed;
        top: 0;
    }

    /* Fill empty space left after the element in the container when it is positioned */
    /* Setting the option autoElementSubstitute to true can be used instead (see options below) */
    containerSelector.scroll-fix {
        height: <insert value here>px;
    }

See [demo.html](demo.html) for an example.


## Options

<table>
  <thead>
    <tr>
      <th>
        Name
      </th>
      
      <th>
        Default
      </th>
      
      <th>
        Description
      </th>
    </tr>
  </thead>
  
  <tbody>
    <tr>
      <th>
        scroller
      </th>
      
      <td>
        window
      </td>
      
      <td>
        element to watch for scrolling events
      </td>
    </tr>

    <tr>
      <th>
        autoElementSubstitute
      </th>
      
      <td>
        false
      </td>
      
      <td>
        if set to true, a div with element's dimensions will be created to fill the space when the element is fixed
      </td>
    </tr>

    <tr>
      <th>
        elementFixClass
      </th>
      
      <td>
        scroll-fix
      </td>
      
      <td>
        class added to the element when it is supposed to be fixed
      </td>
    </tr>

    <tr>
      <th>
        containerFixClass
      </th>
      
      <td>
        scroll-fix
      </td>
      
      <td>
        class added to the element's container when it is fixed
      </td>
    </tr>

    <tr>
      <th>
        fixBoundaryOffset
      </th>
      
      <td>
        0
      </td>
      
      <td>
        offset aplied when detecting whether to fix the element
      </td>
    </tr>

    <tr>
      <th>
        unfixBoundaryOffset
      </th>
      
      <td>
        0
      </td>
      
      <td>
        offset aplied when detecting whether to unfix the element
      </td>
    </tr>
  </tbody>
</table>

## Events

### jquery.scrollfix

This event is triggered on the element when its state changes and allows other logic to react to it accordingly.

    $(elementSelector).bind('jquery.scrollfix', function (e, fixed) {
        if (fixed) {
            // element was just fixed
        } else {
            // element was just unfixed
        }
    });
