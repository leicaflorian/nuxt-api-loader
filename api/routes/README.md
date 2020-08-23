In this folder you'll have to add your routes. 

You can create a single file containing all your ruotes, or you could organize them in separate files.

In any case, each file has to export as default, a class that extends `BasicApiRoute`.
In the constructor of this class you'll have to call the method `addCall` specifying the path and the function to execute.

The best part of this is that all the error handling is managed in background and for this reason you won't need to use the try/catch becausa is already used internally.

Each class that extends `BasicApiRoute` has 2 static getters: 
- errors - that return a list of available errors to dispatch
- httpCodes - that returns a list of HTTP STATUS codes that can be used when dispatching an error


## Routes response
Each response will be a JSON object containing at last 3 properties:
- data: any - contains the data to return to the user. This can be any type.
- message: string - contains the error message if any, otherwise is empty
- error: object - contains the errors details like the stack, type and other data



```javascript
import { BasicApiRoute } from '[module name]/classes/BasicApiRoute'

class UsersRoute extends BasicApiRoute {
    /**
     * @returns {Router}
     */
    constructor() {
        super()

        /*
        Specifying the baseApi will create the route like so:
        /api/[baseApi]/[callRoute]
        */
        this.baseApi = '/users'

        this.addCall('/', async () => {
            /*
            Note the lack of try/catch, because all the errors are handled internally and returned 
            as needed.
            */

            /*
            You could dispatch an error for any reason so that returns a status different from 200,
            by throwing an error
            */
            throw new UsersRoute.errors.BasicError("my error message", 403)


            /*
            Or return a valid result to the user
             */
            return await {} // here should be called a controller that fetches data from a DB.
        })
    }
}

export default UsersRoute
```