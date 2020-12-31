# JavaScript LocalStorage Todo Task Manager

This version saves the state in the browser's LocalStorage, and internally maintains it in an array; the HTML DOM is changed to reflect changes to the items in the array. If you close and re-open the (same) browser your items will be there.

This is closer to how a "real" application would be written, at least in terms of overall function - where LocalStorage stands in for some form of proper storage or a back-end service.

You can see a live example of it [here](https://sansbacher-task-manager.herokuapp.com/LocalStorage-Based/).

The [initial](https://sansbacher-task-manager.herokuapp.com/LocalStorage-Based/initial) version is pure JavaScript, no libraries or modules.

There's also a version [using ReefJS](https://sansbacher-task-manager.herokuapp.com/LocalStorage-Based/using-ReefJS), a light-weight reactive library in Vanilla JS (it's the same, but internally handles the data and updating the DOM differently).