const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedhelpers");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

//fn. to get random element from array
const randItem = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	//overwrite old ones
	await Campground.deleteMany({});
	//write new 50 camps
	for (let i = 0; i < 500; i++) {
		const randCity = randItem(cities);
		const camp = new Campground({
			author: "6489c8dabb7e7de17d895910",
			location: `${randCity.city}, ${randCity.state}`,
			title: `${randItem(descriptors)} ${randItem(places)}`,
			geometry: {
				type: "Point",
				coordinates: [randCity.longitude, randCity.latitude],
			},
			price: Math.floor(Math.random() * 20) + 10,
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet necessitatibus, cupiditate voluptatum sed iure culpa perferendis quam dolore modi fugiat, debitis possimus totam? Maxime nulla maiores reiciendis eum architecto nobis.",
			images: [
				{
					url: "https://res.cloudinary.com/du5fu8jnf/image/upload/v1687247289/Yelpcamp/dsctgqsp2kjgyanljeeu.jpg",
					filename: "Yelpcamp/dsctgqsp2kjgyanljeeu",
				},
				{
					url: "https://res.cloudinary.com/du5fu8jnf/image/upload/v1687247292/Yelpcamp/dif5xxe07wamthhtq4xm.jpg",
					filename: "Yelpcamp/dif5xxe07wamthhtq4xm",
				},
			],
		});
		await camp.save();
	}
};

seedDB().then(() => {
	db.close();
});
