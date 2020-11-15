# Second JavaScript Front-End for a REST API Based Todo Task Manager

This is the second version of the API based Front-End.

It's designed to fulfill basically all the API end-points of the [The Complete Node.js Developer Course](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/) on Udemy ... up to (and including) the end of Section 13 -- which added Sorting, Pagination, and Filtering.

I also added a bonus features on the "Profile" page which can inject a bunch of dummy Mad-Lib style Tasks. Such as "Slowly imitate 4 hardworking dogs" or "Cheerfully jump over 15 crispy potatoes!" Just click the "Add Tasks" button :)

## Making it work

No changes should be required to make this work _except_ adding a `public` folder for the front-end files and an Express `app.use()` for the static files. For instructions see under the [Initial](https://github.com/sansbacher/todo-task-manager/tree/master/API-Based/Initial) folder.

## If you don't have the same Back-End

If you're building your own API you can see from the `client-XXXX.js` code which API end-points are used. All that's been added is that the Users and Tasks objects returned now have `"createdAt": "2020-11-13T23:42:32.386Z"` and `"updatedAt": "2020-11-13T23:42:32.386Z"` fields. These allow Sorting by Creation Date or Last Edited Date. 

And the GET /tasks end-point now supports up to 3 Search Parameters:  
_GET /tasks?completed=false&sortBy=updatedAt:desc&limit=5&skip=15_

But otherwise it's the same as before.