// fetchNews.js

const axios = require('axios');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Article = require('./models/Article');

dotenv.config();

const fetchNews = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for fetching news');

    // Fetch news from News API
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us',
        apiKey: process.env.NEWS_API_KEY,
        pageSize: 100, // Number of articles to fetch
      },
    });

    const articles = response.data.articles;

    // Clear existing articles
    await Article.deleteMany({});
    console.log('Existing articles cleared');

    // Insert new articles
    await Article.insertMany(articles);
    console.log('New articles inserted');

    // Disconnect
    mongoose.disconnect();
  } catch (error) {
    console.error('Error fetching news:', error.message);
  }
};

fetchNews();
