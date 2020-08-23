import { BasicApiRoute } from '../../classes/BasicApiRoute'

class UsersRoute extends BasicApiRoute {
    /**
     * @returns {Router}
     */
    constructor() {
        super()

        this.baseApi = '/users'

        this.addCall('/', async (req, res) => {
            return "users route api test jhhjgg"
        })

        this.addCall('/error', async () => {
            throw new UsersRoute.errors.BasicError("my message", 510)
        })
    }
}

export default UsersRoute
