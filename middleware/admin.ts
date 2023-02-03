import { Response } from 'express'


function checkAdmin(req: any, res: Response, next: any){
    if(!req.user.isAdmin) return res.status(403).send({
        result: 'Unsuccessful',
        data: {
            status: 403,
            message: 'Access denied.',
            data: null
        }
    })
    next()
}

module.exports = checkAdmin