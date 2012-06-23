# jQuery SafetyNet

*if you lose your connection, you'd better have a safety net!*

jQuery SafetyNet stores form data in localStorage in case you lose network
connectivity (think mobile)

## Getting Started

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/rubysolo/jquery.safetynet/master/dist/jquery.safetynet.min.js
[max]: https://raw.github.com/rubysolo/jquery.safetynet/master/dist/jquery.safetynet.js

In your web page:

    <script src="jquery.js"></script>
    <script src="dist/jquery.safetynet.min.js"></script>
    <script>
    jQuery(function($) {
      $('form[data-safetynet=true]').safetyNet();
    });
    </script>

## Documentation

To activate your mobile safety net, call the `safetyNet` function on a
selector.  (which should probably return a collection of forms)  If any of
these forms are submitted while the browser is offline, the data will be
serialized to localStorage.  Upon reconnection, the data will be submitted
to the server as originally intended.

You may optionally specify callbacks to respond to safety net events.  The
`failure` callback will be called when safety net catches an offline form
submission.  The `success` callback will be called when safety net successfully
submits queued submission from localStorage.

If the `progressive` option is specified, form data will be serialized to
localStorage as elements are changed.  Upon page load, the last serialized
state of the form will be restored.

## Examples

    $('[data-offline-backup=true]')safetyNet({
      'progressive': true,          // store form changes as they happen
      'failure': function() {
        $('#offline-modal').show(); // show "network is offline" modal
      },
      'success': function() {
        $('#offline-modal').hide();
      },
    });

## Dependencies

[jQuery](http://jquery.com)
[jQuery Deserialize Plugin](https://github.com/kflorence/jquery-deserialize)

## Contributing

Pull requests welcome!  SafetyNet is developed in [CoffeeScript][coffee] and
compiled with [Grunt][grunt]

[coffee]: http://coffeescript.org
[grunt]: https://github.com/cowboy/grunt

_Also, please don't edit files in the "dist" subdirectory as they are generated
via grunt. You'll find source code in the "src" subdirectory!_

## Release History

0.1.0 - 23 Jun 2012 - Initial release

## License
Copyright (c) 2012 Solomon White
Licensed under the MIT, GPL licenses.
