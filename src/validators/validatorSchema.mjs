export const validatorSchema = {
    username:{
        isString:{
            errorMessage:"Just string"
        },
        noEmpty:{
            errorMessage:"User cannot be empty"
        }
    },
    password:{
        isLength:{
            options:{min:5},
            errorMessage:"Minimum length 5 characters"
        },
        noEmpty:true
    }
}