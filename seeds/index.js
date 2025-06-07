const mongoose=require('mongoose');
const cities=require('./cities');
const {places,descriptors}=require('./seedHelpers');
const Campground=require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log('Database connected');
    })
    .catch(err => {
        console.log('Database connection error:', err);
    });

const sample=array =>array[Math.floor(Math.random()*array.length)];    

const seedDB =  async () => {
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const rand1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*100)+1;
        const camp=new Campground({
            author:'68400891f84872d44b55bf2f',
            location:`${cities[rand1000].city}, ${cities[rand1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.',
            price,
            images: [
                {
                url: 'https://res.cloudinary.com/dlduepgha/image/upload/v1749190143/YelpCamp/wmmk7zbamj4ojqkhd0ta.jpg',
                filename: 'YelpCamp/wmmk7zbamj4ojqkhd0ta',
                },
                {
                url: 'https://res.cloudinary.com/dlduepgha/image/upload/v1749190155/YelpCamp/kkpqqhf2uiyp8iw4jjb5.jpg',
                filename: 'YelpCamp/kkpqqhf2uiyp8iw4jjb5',
                }
            ]
        })
        await camp.save();
    }
}    

seedDB().then(() => {
    mongoose.connection.close();
});
