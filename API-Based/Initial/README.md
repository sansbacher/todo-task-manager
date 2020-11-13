# Initial JavaScript Front-End for a REST API Based Todo Task Manager

This is the initial version of the API based Front-End.

It's designed to fulfill basically all the API end-points of the [The Complete Node.js Developer Course](https://www.udemy.com/course/the-complete-nodejs-developer-course-2/) on Udemy ... up to (and including) the end of Section 12.

## Making it work

No changes should be required to make this work _except_ adding a `public` folder for the front-end files and an Express `app.use()` for the static files:

1. Create a `public` folder **outside the `src` directory** (so that it is at the same level as `src` and `node_modules`).  

2. **Copy** the files, subfolder, and sub-files from the `public` folder in this repo's folder to your `public` folder (you should have `public/index.html` and `public/assets/client-app.js` for example).  

3. **Edit** `src/index.js`, add the line:  
    `app.use(express.static('public'))`  
	Just before the `app.use(express.json())` line  

**That's it!** Start the app: `node src/index.js` and browse to **http://127.0.0.1:3000/** (or whatever Express port you're using). Either Register or Login and create, edit, complete/check, delete Tasks. Click Profile to edit your User Profile (or remove your account), and Logout when you're done.

The code uses fetch() to send JSON data, so NO need to add "app.use(express.urlencoded({extended: false}))", though there's some example FORMs in some of the HTML files (commented out) which would require that - if you wanted to test.

I've also tested this using Chrome on Android and Safari on Apple iOS - both work fine; you just need to allow the Express port (3000/tcp by default) through your computer's Firewall and connect to your actual IP (usually similar to 192.168.XX.YY) - provided your phone and computer are on the same wifi network.

## Optional addition: Cookies

It also and passes the Token via an _Authorization:_ header (which it saves in a Cookie on the client-side) so no need for _cookie-parser_ but you could **install** that (`npm install cookie-parser`) and **add** `const cookieParser = require('cookie-parser')` _and_ `app.use(cookieParser())` to `src/index.js` if you wanted to test with setting Cookies on the server-side.

You'd also need to **add** `res.cookie('auth_token', token)` to `src/routers/user.js` into the `try { ... }` under both the `router.post('/users')` and `router.post('/users/login')` routes (add after the `const token = ...` lines)

And **add** `res.clearCookie('auth_token')` to `src/routers/user.js` into the `try { ... }` under both the `router.post('/users/logout')` and `router.post('/users/logoutAll')` routes (add after the `await req.user.save()` lines)

Finally, in `src/middleware/auth.js` **change** the `const token = ...` line to:  
`const token = req.cookies.auth_token ? req.cookies.auth_token : req.header('Authorization').replace('Bearer ', '')`  

None of this is _needed_ but it will add the ability for the back-end to set, remove, and check cookies natively (no need for passing an _Authorization:_ header).

## Optional addition: CORS

Right now you must host the Front-End / Client-Side files from the same host as the Back-End Server (which is why they're in the `public/` folder). But if you wanted to host the static front-end files somewhere apart from the back-end server you would need to enable Cross-Origin Resource Sharing (CORS) to make fetch() calls to another site. 

Each of the `public/assets/client-XXXX.js` files has a `const apiUrl = ''` line where you can test this. If you browse to http://127.0.0.1:3000 but if you set apiUrl = 'http://localhost:3000' it _won't_ work (even though 127.0.0.1 = localhost).

You can enable CORS support fairly easily with the NPM `cors` module, but in the interest of DIY I wanted to test handling it manually. You can add CORS support to `src/index.js` by adding these lines (after the other `app.use(...)` lines)

```javascript
// Enable CORS support
// First: for all requests include these Headers using this middleware
app.use( (req, res, next) => {
	let corsHost = req.headers.origin ? req.headers.origin : '*'		// Automatically allow any CORS host if presented with one
	res.header('Access-Control-Allow-Origin', corsHost)
	res.header('Access-Control-Allow-Credentials', 'true')
	next()
})
// Second: Handle the OPTIONS verb for CORS pre-flight for all paths
app.options('*', (req, res) => {
	res.header('Access-Control-Max-Age', '3600')							// In seconds
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since, Cache-Control, Authorization')		// Includes our 'Authorization' header
	res.header('Access-Control-Allow-Methods', 'HEAD, GET, PATCH, PUT, POST, DELETE, OPTIONS')
	res.status(200).end()
})
```

In a production environment I'd just use the `cors` module. NOTE: recent Chrome changes mean you can't pass Cookies via CORS with fetch()'s credentials = 'include' unless the Cookies are sameSite=None and Secure (using HTTPS) but it works with _Authorization:_ headers.

Again, none of this is _needed_ but it's something to try.

## If you don't have the same Back-End

If you're building your own API you can see from the `client-XXXX.js` code which API end-points are used, the `/tasks/*` routes expect / return JSON that looks like:

```json
{
	"completed": false,
	"_id": "5fa8d8ff650501046cd98312",
	"description": "Here is something that needs doing!"
}
```

And the `/users/*` routes expect / return JSON that looks like:

```json
{
  "user": {
    "age": 23,
    "_id": "5fa8d8fb650501046cd9830f",
    "name": "Jane McTesterson",
    "email": "jane@example.com"
  },
  "token": "abcJhb.abc_LONG_JWT_TOKEN_Z9.9houpmblahblahblah1X0_nNoKd-I"
}
```

The authentication is via an HTTP Header called _Authorization:_ that should be like "Bearer the_big_long_JWT_token"

Hopefully you can adjust the code to fit what your API returns.