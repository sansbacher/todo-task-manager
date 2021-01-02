# JavaScript LocalStorage Todo Task Manager using ReefJS

This is the same as the main LocalStorage Todo Task Manager except that the internal data management and the rendering to the DOM is handled with a light-weight reactive library called [ReefJS](https://reefjs.com/). It's similar to how React/Vue/Angular work, but all Vanilla JS. The end result is identical but Reef takes care of updating the DOM when the data changes. This version was also refactored into modules.

For a larger application it could be useful to eliminate needing to sort out which elements have changed and when to update just those elements on the page - ReefJS does that automatically.

I used Reef's data Store getters and setters to then separate it into more of a Model-View-Controller (MVC) application and the Placeholders function.

But the original ReefJS (with direct access to the data Store) and without Placeholders is is still there as [Initial-without-MVC](https://github.com/sansbacher/todo-task-manager/tree/main/LocalStorage-Based/using-ReefJS/Initial-without-MVC). It operates the same.