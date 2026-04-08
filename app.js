const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/users');

const MONGODB_URI =
  'mongodb+srv://binhxuan1896:admin@cluster0.1qpr2.mongodb.net/practice_node?retryWrites=true&w=majority&appName=Cluster0';

const app = express()

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connect successfully')

        const store = new MongoDBStore({
            uri: MONGODB_URI,
            collection: 'sessions'
        })

        store.on('error', (error) => {
            console.log('Session store error', error)
        })

        app.use(session({
            secret: 'my secret',
            resave: false,
            saveUninitialized: false,
            store: store,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24
            }
        }))

        app.use((req, res, next) => {
            if (!req.session.user) {
                return next()
            }
            
            User.findById(req.session.user_id)
                .then(user => {
                    if (!user) {
                        return next()
                    }
                    req.user = user
                    next()
                })
                .catch(err => {
                    next(new Error(err))
                })
        })

        const adminData = require('./routes/admin');
        // const shopRoutes = require('./routes/shop');
        const authRoutes = require('./routes/auth');

        app.use('/admin', adminData)
        // app.use(shopRoutes)
        app.use(authRoutes)

        // app.use(errorController.get404)

        app.listen(3020, () => console.log('🚀 Server running on port 3020'))

    })
    .catch((err) => {
        console.log(err)
        console.error('Connect failed')
    })