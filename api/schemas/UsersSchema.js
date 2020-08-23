import { BasicJoiSchema } from '../../classes/BasicJoiSchema'

class UsersApiSchema extends BasicJoiSchema {
    constructor(action) {
        super(action)

    }

    schema() {
        return this.Joi.object().keys({
            test: this.Joi.string().required()
        })
    }
}

export default UsersApiSchema
