import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authMiddleware= (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    // let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZjQ3ZGI4MDRkNjM3N2IxM2FkYzljYyIsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImlhdCI6MTcyNzMyMzgwNywiZXhwIjoxNzI3MzI0NzA3fQ.2gDRkHYel0RF60vYBtHrd9iZ9jFblvWazxpviJiVQ6c'
    if (!token) return res.sendStatus(401); 
    console.log(token,'tok')
    console.log(process.env.ACCESS_TOKEN_SECRET,'access')

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
        if (err) return res.status(403).json(err); 
        // @ts-ignore
        req.user = user as { id: string; email: string }; 
        next();
    });
};

export default authMiddleware;
