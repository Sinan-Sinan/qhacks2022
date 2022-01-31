import express from 'express';
import morgan from 'morgan';
// TODO: What is cors?????
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import db from './database.js';
import userRouter from './routes/user.js';
import fileUpload from 'express-fileupload';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

db.schema.hasTable('users').then(function(exists) {
  if (!exists) {
      db.schema.createTable('users', function(user) {
          user.string('uid');
          user.string('email');
          user.string('first_name');
          user.string('last_name');
          user.string('video_uri');
          user.string('photo_uri');
          user.string('bio');
          user.boolean('is_online');
          user.string('created_at');
          user.string('updated_at');
      }).then(function(table) {
          console.log('Created Table', table);
      });
  }
});


const port = 8080;

const app = express();
app.use(fileUpload());
app.use(cors());
app.use(cookieParser()); // populates req.cookies.
app.use(morgan('dev')); // give back development data,
app.use(express.json()) // for parsing application/json

// TODO(Noah): WHEN WE ARE DONE BUILDING THE PROJECT
app.use(express.static(`${__dirname}/frontend/build`));
app.get(/.*/, (req, res) => res.sendFile(`frontend/build/index.html`, { root: __dirname }));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

/*
app.post('/login', function(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    /* So, what is going on with the cookies here?
    They are sent on each request, apparently.
    We can set expiration times for cookies.
      - So the auth flow is kind of like this, then. The browser client
      logs in. The server gives it back a cookie. And the browser client
      continues each request with that cookie.
      - And this cookie expires after some time, maybe a few months, lets say.

    Seems that we can use the Set-Cookie header to store a cookie in the client.

    We should always be seing session cookies.

    We want to update this to make it secure and to prevent 
    session fixation attacks: https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks#session_fixation
    SignInWithEmailAndPassword(email, password)
    .then((cookie) => {

    }).catch(() => {
      // what do we even do here lol.
    });
    
    // res.send({email, password});
});
*/