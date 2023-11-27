const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const axios = require('axios');
const { gpt } = require('gpti');

const PORT = process.env.PORT || 3000;


const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json()); //accepting only json data
// app.use(express.urlencoded());  //accept url encoded data


app.get('/', (req, res) => {
  res.json({
    up: '1'
  })

})

const util = require('util');
const gptPromise = util.promisify(gpt);

app.get('/getAiReport', async (req, res, next) => {
  try {
    const { data } = req.query;
    // console.log(data)

    if (!data) {
      return res.status(400).json({ error: 'AI requires data to analyze' });
    }

    // Using gpt to generate a response based on the provided data
    const response = await gptPromise({
      prompt: `explain how risky the weather risk level ${data} in 2 sentences`,
      model: 'gpt-4',
      type: 'json'
    });
    // console.log('Response from GPT:', response);

    // Send the response from GPT as the API response
    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    next(error);
  }
});



app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    error: "something went wrong",
    stack: error.stack
  })
})



app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
})