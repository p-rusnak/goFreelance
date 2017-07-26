var mongoose = require("mongoose"),
    Post = require("./models/post");

var data = [
    {
        autor: "Snaki",
        title: "Write a website",
        descr: "I need a website for freelancers where you can login as employer or employee, the rest you know",
        price: 100
    },
    {
        autor: "Snaki",
        title: "Do a barrel roll",
        descr: "360. Right",
        price: 100
    },
    {
        autor: "Unknown",
        title: "Test for long text",
        descr: "Bacon ipsum dolor amet turkey salami pork belly picanha landjaeger alcatra. Short ribs rump shankle capicola burgdoggen. Drumstick bacon alcatra beef ribs salami. Andouille kielbasa jowl pork loin drumstick short loin corned beef burgdoggen rump pig pork prosciutto. Frankfurter ham burgdoggen porchetta, turkey salami turducken boudin hamburger shank sirloin tri-tip. Landjaeger pancetta tri-tip kevin, jerky sausage flank pork belly. Rump ball tip strip steak frankfurter. Pig turkey frankfurter corned beef pork loin ham pancetta strip steak jerky short loin, capicola tenderloin. Doner boudin picanha pork belly. Pork loin pork belly jowl leberkas tongue fatback pork chop bacon kevin pancetta turducken chuck turkey ground round. Ground round ",
        price: 100
    },
    {
        autor: "Snaki",
        title: "Make an app",
        descr: "Make an app that will add money to my bank account",
        price: 150
    }
];


function seedDB(){
    
    console.log("seeding...");
    
    //drop the table
    
    Post.remove({}, function(err){
        if(err){
            console.log("Error");
        } else {
            console.log("All post removed");
        }
    });
    
    //adding posts
    
    data.forEach(function(seed){
        Post.create(seed, function (err) {
            if(err){
                console.log('error');
            } else {
                console.log('added post');
            }
        })
    });
    
}

module.exports = seedDB;