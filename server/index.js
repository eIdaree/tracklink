const express = require('express');
const axios = require('axios');
const app = express();

app.get('/track', async (req, res) => {
  const track_url = decodeURIComponent(req.query.track_url);
  const redirect_url = decodeURIComponent(req.query.redirect_url);  

  console.log('track_url:', track_url);
  console.log('redirect_url:', redirect_url);
  
  if (!track_url || !redirect_url) {
    return res.status(400).send('Missing track_url or redirect_url parameters');
  }

  try {
    const urlObj = new URL(track_url);
    const baseUrl = urlObj.origin + urlObj.pathname;
    const params = new URLSearchParams(urlObj.search);

    console.log('Base URL:', baseUrl);
    console.log('Params:', params.toString());

    // Perform the request to track_url
    const response = await axios.get(baseUrl, { params: Object.fromEntries(params.entries()) });

    // Check the response status
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    // Redirect to the original URL
    res.redirect(redirect_url);
  } catch (error) {
    console.error('Error processing request:', error.response ? error.response.data : error.message);
    res.status(500).send('Error processing redirection');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
