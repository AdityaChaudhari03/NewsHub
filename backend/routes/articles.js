// routes/articles.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Article = require('../models/Article');

// Function to Fetch and Store Articles from NewsData.io API
const fetchArticles = async () => {
    try {
        const response = await axios.get('https://newsdata.io/api/1/latest?apikey=pub_5568635786392019614c59b9877a60aa5ee14&q=pizza');
        
        const articles = response.data.results;

        if (!articles || articles.length === 0) {
            console.log('No articles found.');
            return;
        }

        // Clear existing articles to avoid duplicates
        await Article.deleteMany({});

        // Map and Insert New Articles
        const formattedArticles = articles.map(article => ({
            title: article.title || 'No Title',
            description: article.description || 'No Description',
            content: article.content || 'No Content',
            link: article.link,
            image_url: article.image_url || '',
            pubDate: article.pubDate ? new Date(article.pubDate) : new Date(),
            source_id: article.source_id || '',
            category: Array.isArray(article.category) ? article.category : [article.category],
            country: Array.isArray(article.country) ? article.country : [article.country],
            language: Array.isArray(article.language) ? article.language : [article.language]
        }));

        const insertedArticles = await Article.insertMany(formattedArticles);

        console.log(`Articles fetched and stored successfully. Count: ${insertedArticles.length}`);
    } catch (error) {
        console.error('Error fetching articles:', error.message);
    }
};

// Route: Fetch and Store Articles
router.get('/fetch', async (req, res) => {
    try {
        await fetchArticles();
        res.status(200).json({
            message: 'Articles fetched and stored successfully'
        });
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        res.status(500).json({ error: 'Failed to fetch and store articles' });
    }
});

// Route: Get All Articles with Optional Filtering and Sorting
router.get('/', async (req, res) => {
    try {
        const { source, sortBy } = req.query;
        let filter = {};
        let sort = {};

        if (source) {
            filter['source_id'] = source;
        }

        if (sortBy) {
            if (sortBy === 'date') {
                sort['pubDate'] = -1; // Descending
            } else if (sortBy === 'title') {
                sort['title'] = 1; // Ascending
            }
        }

        const articles = await Article.find(filter).sort(sort);
        res.status(200).json(articles);
    } catch (error) {
        console.error('Error retrieving articles:', error.message);
        res.status(500).json({ error: 'Failed to retrieve articles' });
    }
});

module.exports = router;
module.exports.fetchArticles = fetchArticles;
