# Third JavaScript Front-End for a REST API Based Todo Task Manager

This is the third version of the API based Front-End.

It's designed to fulfill basically all the API end-points of the [The Complete Node.js Developer Course](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/) on Udemy ... up to (and including) the end of Section 14 -- which added a Profile Avatar / Picture.

## Making it work

No changes should be required to make this work _except_ adding a `public` folder for the front-end files and an Express `app.use()` for the static files. For instructions see under the [Initial](https://github.com/sansbacher/todo-task-manager/tree/master/API-Based/Initial) folder.

## If you don't have the same Back-End

If you're building your own API you can see from the `client-XXXX.js` code which API end-points are used. All that's been added is that there are specific end-points related to uploading, deleting, and retriving (to display as an aimage) the Avatar Pictures - which are always returned as a 250x250 pixel PNG file.

But otherwise it's the same as before.