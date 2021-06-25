import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../utils/dbConnect';

export default function addEmail(req : NextApiRequest, res : NextApiResponse) {
    dbConnect('SHOW TABLES', (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
        }
    });

  res.status(200).json({ name: 'John Doe' })
}
