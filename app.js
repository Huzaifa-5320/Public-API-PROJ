import express from 'express';
import axios from 'axios';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Homepage with search form
app.get('/', (req, res) => {
  res.render('index', { drinks: null, searchTerm: null });
});

// Search results
app.get('/search', async (req, res) => {
  const searchTerm = req.query.term;
  if (!searchTerm) {
    return res.render('index', { drinks: null, searchTerm: null });
  }

  try {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`;
    const response = await axios.get(url);
    res.render('index', { drinks: response.data.drinks, searchTerm });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error fetching drinks.');
  }
});

// Drink details
app.get('/cocktail/:id', async (req, res) => {
  try {
    const url = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${req.params.id}`;
    const response = await axios.get(url);
    res.render('cocktail', { drink: response.data.drinks[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error fetching drink details.');
  }
});

app.listen(3000, () => console.log('Server running at http://localhost:3000'));
