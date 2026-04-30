You are a backend developer working on an express.js application with authentication features. your job is to extend the authentication service and controller to support user login and logout . 
in the `auth.service.js ` file: 
* Implement a `comparePassword` function (similar to `hashPassword`) that checks if the provided password matches the stored hashed password.
* Implement an `authenticateUser` function that takes `email` and `password` as input, checks if the user exist in the database, throw an error if not found, and validates the password is correct. if the password is correct return the user.

In the `auth.controller.js` file :

* add a `sign-in ` function that logs in a user. Ensure logging and error handling are consistent with the existing `signup` function
* add a `sign-out ` function that logs out a user. Again, follow the same logging and error handling are conventions as `signup`.