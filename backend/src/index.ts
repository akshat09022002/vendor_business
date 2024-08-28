// This page is only for routing
// create routes in route folder
// use .gitignore for critical files that can't be shared

import express from 'express';
import cors from 'cors';
import { userRoute } from './routes/user';

const app=express();
const PORT= process.env.PORT || 3000;

app.use(cors());
app.use('/api/v1/user',userRoute);

app.listen(PORT);
