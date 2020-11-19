# JavaScript API Based Todo Task Manager

This is just the _Front-End_ client for a Todo Task Manager web app with a REST API based Back-End (which has some database storing the data and users).

The state is saved/retrieved via API and, like the LocalStorage version, internally it's maintained in an array and the HTML DOM is updated to reflect changes. But all changes are sent back to the server via the API.

This is more or less how a "real" application would work - though obviously a very simple one. It currently has authentication, reading and updating data, and editing your user profile.

There's an [Initial](https://github.com/sansbacher/todo-task-manager/tree/master/API-Based/Initial) folder because it's all working at this point, and I want to save things as-is, in case future changes take a different turn. **So start there.**

And now there's a [Second-Sorting-Filtering-Pagination](https://github.com/sansbacher/todo-task-manager/tree/master/API-Based/Second-Sorting-Filtering-Pagination) folder that has additional features added - Sorting, Filtering, and Pagination. Setup is the same, just a different "public" folder.

There's also a [Third-Profile-Avatar](https://github.com/sansbacher/todo-task-manager/tree/master/API-Based/Third-Profile-Avatar) folder that has added a Profile Picture / Avatar. Setup remains the same, just a new "public" folder.

There may be other versions with additional functions/features to come!
