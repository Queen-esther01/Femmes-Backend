
function asyncMiddleware(handler: any){
    return async (req: Request, res: Response, next: any) => {
        try {
            await handler(req, res)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = asyncMiddleware