export const ErrorHandler = async(error, req,res,next)=>{
    if(error){
        return res.status(error.status||500).json({
            message: error.message|| 'Internal server error'
        })
    }
    next()
};

export class HttpError extends Error{
    constructor(status, message){
        super(message);
        this.status = status
    }
}