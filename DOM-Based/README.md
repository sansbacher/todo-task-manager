# JavaScript DOM Based Todo Task Manager

This version directly manipulates the HTML's DOM, adding/removing/editing List Items directly. There's no state saved - if you refresh the page everything is gone.

A "real" application wouldn't be written this way, but it's quick and simple to experiment and test out a basic idea.

You can see a live example of it [here](https://sansbacher-task-manager.herokuapp.com/DOM-Based/).

The [initial](https://github.com/sansbacher/todo-task-manager/tree/main/DOM-Based/initial) version is pure JavaScript, no libraries or modules.

There's also a version [using a Modal Popup](https://github.com/sansbacher/todo-task-manager/tree/main/DOM-Based/using-Modal-Popup) instead of the plain Alert popup, and it has been modified to use ES modules and the Mustache Template library. Internally it operates the same.

And a version using [Bootstrap 4 CSS](https://github.com/sansbacher/todo-task-manager/tree/main/DOM-Based/using-Bootstrap) instead of W3.CSS - it also has a Bootstrap Modal pop-up and ES modules. It's otherwise the same.