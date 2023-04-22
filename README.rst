ScrollFix
#########

jQuery plugin for making an element fixed when it goes out of view.

`Online demo (latest version) <https://raw.githack.com/Shira-3749/jquery-scrollfix/master/demo.html>`_

.. HINT::

   Similar behavior can now be achieved without JavaScript by using `CSS position: sticky <https://developer.mozilla.org/en-US/docs/Web/CSS/position#sticky>`_.

.. contents::
   :depth: 2


Features
********

- detecting when an element goes out of view and fixing it:

  a. to the top of the window
  b. to the bottom of the window
  c. to either

- updating size and position of the fixed element when the window is scrolled or resized
- many options to customize the process


Requirements
************

jQuery 1.9.0 or newer


Browser support
***************

Tested in Mozilla Firefox, Google Chrome, Safari, Opera and MSIE 7+.


Usage
*****

The plugin provides a single jQuery method:


``$(element).scrollFix([options])``
===================================

- ``element`` - element that should be fixed
- ``options`` - object with various settings (see list below)

.. NOTE::

   When the element is fixed, an invisible substitute (shallow clone) of it will occupy the original
   location. This helps with size and position synchronization and prevents the page from jumping.

   The element should not have an ``id`` attribute. If it does, there will be multiple elements
   with the same ID and that might break your scripts.


Supported options
=================

=================== ========================= =========================================================
Option              Default                   Description
=================== ========================= =========================================================
``side``            ``"top"``                 Fix element to this side of the window.

                                              Allowed values: ``"top"``, ``"bottom"``, ``"both"``
------------------- ------------------------- ---------------------------------------------------------
``topPosition``     ``0``                     Position the fixed element this many pixels from the top
                                              of the window.
------------------- ------------------------- ---------------------------------------------------------
``bottomPosition``  ``0``                     Position the fixed element this many pixels from the
                                              bottom of the window.
------------------- ------------------------- ---------------------------------------------------------
``topFixClass``     ``"scrollfix-top"``       Class added to the element when it's fixed to the top.
------------------- ------------------------- ---------------------------------------------------------
``bottomFixClass``  ``"scrollfix-bottom"``    Class added to the element when it's fixed to the bottom.
------------------- ------------------------- ---------------------------------------------------------
``substituteClass`` ``"scrollfix-subtitute"`` Class added to the invisible substitute.
------------------- ------------------------- ---------------------------------------------------------
``style``           ``true``                  Use inline styles to set position and top or bottom
                                              offsets.

                                              If you disable this, you'll have to apply these styles
                                              yourself (when the element has the ``topFixClass`` or
                                              ``bottomFixClass`` class).
------------------- ------------------------- ---------------------------------------------------------
``styleSubstitute`` ``true``                  Use inline styles to set visibility and height of the
                                              substitute when it's created.

                                              If you disable this, you'll have to apply these styles
                                              yourself. The substitute will have the
                                              ``substituteClass`` class.
------------------- ------------------------- ---------------------------------------------------------
``syncSize``        ``true``                  Synchronize width with the substitute when the element
                                              is fixed.
------------------- ------------------------- ---------------------------------------------------------
``syncPosition``    ``true``                  Synchronize horizontal position with the substitute
                                              when the element is fixed.
=================== ========================= =========================================================


Advanced options
----------------

===================== =================== =========================================================
Option                Default             Description
===================== =================== =========================================================
``topFixOffset``      ``-topPosition``    Pixel offset applied when detecting whether the element
                                          should be fixed to the top of the window.
--------------------- ------------------- ---------------------------------------------------------
``topUnfixOffset``    ``topPosition``     Pixel offset applied when detecting whether the element
                                          should be unfixed from the top of the window.
--------------------- ------------------- ---------------------------------------------------------
``bottomFixOffset``   ``-bottomPosition`` Pixel offset applied when detecting whether the element
                                          should be fixed to the bottom of the window.
--------------------- ------------------- ---------------------------------------------------------
``bottomUnfixOffset`` ``bottomPosition``  Pixel offset applied when detecting whether the element
                                          should be unfixed from the bottom of the window.
===================== =================== =========================================================

.. WARNING::

   Configuring the offsets incorrectly might cause the fixed element to flicker or jump.

.. HINT::

   Positive offsets result in fixing or unfixing after the element has been reached by the window boundary.

   Negative offsets result in fixing or unfixing before the element is reached by the window boundary.


DOM events
==========

List of dom events dispatched from the element:

- ``fix.shira.scrollfix``

  - fired before the element is fixed; calling ``e.preventDefault()`` will prevent fixing

- ``fixed.shira.scrollfix``

  - fired after the element has been fixed

- ``update.shira.scrollfix``

  - fired after a fixed element has been updated

- ``unfix.shira.scrollfix``

  - fixed before the element is unfixed; calling ``e.preventDefault()`` will prevent unfixing

- ``unfixed.shira.scrollfix``

  - fired after the element has been unfixed

All of the event objects have a property called ``watcher`` that contains an instance of
``Shira.ScrollFix.Watcher``.
