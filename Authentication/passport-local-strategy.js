const passport= require('passport');

const LocalStrategy= require('passport-local').Strategy;

const User= require('../models/user');


//authentication using passport
//telling passport to use local Strategy 
passport.use(new LocalStrategy({
    usernameField:'email'     

    },
    //callback function to find username,password
    //done is callback function reporting to passport js
    function(email , password , done){
        //find user and establish identity in mongodb/database
        // second email is value we have passed in call back function & first email is property in db 
        User.findOne({email:email},function(err,user) {
            if(err){
                console.log('error in finding user');
                return done(err);
 
            }
            if(!user ||  user.password != password){
                console.log('Invalid PAssword/Username');
                //false means authentication failse here
                return done(null,false);


            }
            //if user find
            return done(null, user);
            console.log(user);
            
        });
    }
));

//serializing the user to decide which key is to be kept in the cookies
//which property to send to cookie is defined here 
passport.serializeUser(function(user,done){
    done(null,user.id);

});

//deseializing the user from the key in the cookies
//when request ges to serer, use the key from cookies
//check id is present or not 
passport.deserializeUser(function(id,done){
    User.findById(id, function(err,user){
        if(err){
            console.log('error in finding user');
            return done(err);

        }

        return done(null,user);
    });
});


module.exports=passport;
