# ScrollFix

jQuery plugin for making an element fixed when it goes out of view.


## Demo

See `demo.html` for an example.


## Features

- detecting when an element goes out of view and making it fixed
- replacing the element with an invisible clone that will temporarily occupy space the original spot
- updating size and position of the fixed element


## Browser support

Tested in Mozilla Firefox, Google Chrome, Safari, Opera and MSIE 7+


## Usage

The plugin provides a single jQuery method you can use:


### $(element).scrollFix([options])

- **element** - element that will be fixed
- **options** - object with various settings (see list below)

**Returns:** an instance of `Shira.ScrollFix.Watcher` or `false` if no element was given / matched.


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
            <th>fixClass</th>
            <td>"scroll-fix"</td>
            <td>Class added to the element when it is fixed.</td>
        </tr>
        <tr>
            <th>syncSize</th>
            <td>true</td>
            <td>Update element's size when it is fixed.</td>
        </tr>
        <tr>
            <th>syncPosition</th>
            <td>0</td>
            <td>Update element's position when it is fixed.</td>
        </tr>
        <tr>
            <th>fixOffset</th>
            <td>0</td>
            <td>Offset aplied when detecting whether to fix the element.</td>
        </tr>
        <tr>
            <th>unfixOffset</th>
            <td>0</td>
            <td>Offset aplied when detecting whether to unfix the element.</td>
        </tr>
        <tr>
            <th>onUpdateFixed</th>
            <td>null</td>
            <td>Custom function to call when the fixed element is updated. The function is passed an instance of <code>Shira.ScrollFix.Watcher</code>.</td>
        </tr>
    </tbody>
</table>
