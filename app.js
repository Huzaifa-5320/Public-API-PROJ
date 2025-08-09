import express from 'express';
import axios from 'axios';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

const port = 3000;
const API_URL = "https://www.thecocktaildb.com/api/json/v1/1";

// Homepage with search form
app.get('/', (req, res) => {
  return res.render('index', { drinks: null, searchTerm: null });
});

// Search results
app.get('/search', async (req, res) => {
  const searchTerm = req.query.term;
  if (!searchTerm) {
    return res.render('index', { drinks: null, searchTerm: null });
  }

  try {
    const response = await axios.get(API_URL + `/search.php?s=${searchTerm}`);
    return res.render('index', { drinks: response.data.drinks, searchTerm });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Error fetching drinks.');
  }
});

// Drink details
app.get('/cocktail/:id', async (req, res) => {
  try {
    const response = await axios.get(API_URL + `/lookup.php?i=${req.params.id}`);
    return res.render('cocktail', { drink: response.data.drinks[0] });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('Error fetching drink details.');
  }
});

app.listen(3000, () => 
  console.log(`Server running at http://localhost:${port}`)
);
