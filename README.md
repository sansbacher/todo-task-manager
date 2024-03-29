# JavaScript Todo Task Manager App
![Task list logo](images/checklist-title.png)

It seems everyone writes a Todo / Task Manager app when learning Web/HTML/CSS/JavaScript - this is a one of those. Done **three** ways.

The three versions are:  
1. A simple [DOM-Based](https://github.com/sansbacher/todo-task-manager/tree/master/DOM-Based) version
2. A version saves the state by being [LocalStorage-Based](https://github.com/sansbacher/todo-task-manager/tree/master/LocalStorage-Based)
3. And a Front-end for a REST [API-Based](https://github.com/sansbacher/todo-task-manager/tree/master/API-Based) implementation

Bonus #4: There's now a [React API-Based](https://github.com/sansbacher/react-todo-app) version as well, which uses React Bootstrap.

All three are very similar in style and function, and fairly well commented so you can see the progression. There's some variations in separate sub-folders for each.

![Task Manager screen shot](images/screenshot.png)

The style/look is fairly plain (I discovered that I'm much less interested in graphics/web design or learning much CSS so I just used a simple [CSS framework](https://www.w3schools.com/w3css/default.asp) - one that had a decent reference and quick "Try it" buttons). All are Vanilla JavaScript, no JS Frameworks. But I added features like Editing a Task, an Empty State prompt, and logging in/out or editing a Profile (for the API-Based version). And then added a second version with more features like sorting and pagination. A third version adds a profile picture / avatar option. There's a separate version for LocalStorage that uses a light-weight reactive library too. And the DOM-Based one has an option using a pop-up modal dialogue box instead of an alert, and the modal using Bootstrap 4 CSS.

I mainly use these to test and try-out new modules or methods, and leave them as a reminder for myself.

The HTML/CSS/JavaScript should work in any modern browser, like Chrome, Opera Chromium, Firefox, or Legacy Edge - even Chrome on Android or Safari on iOS. It can't be used with Internet Explorer, but then neither should you. There are live versions of each hosted on Heroku:  
* Try [DOM-Based](https://sansbacher-task-manager.herokuapp.com/DOM-Based/)
* Try [LocalStorage-Based](https://sansbacher-task-manager.herokuapp.com/LocalStorage-Based/)
* Try the latest version of the [Rest API-Based version](https://sansbacher-task-manager.herokuapp.com/) with back-end MongoDB
* BONUS: Try the [React API-Based version](https://sansbacher-task-manager.herokuapp.com/API-React-Based/) which connects to the same back-end

I hope these are useful for someone!
