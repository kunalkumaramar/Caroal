const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const initiatePaymentRoute = require('./routes/paymentInitiate');
const paymentSuccessRoute = require('./routes/paymentSuccess');
const webhookRoute = require('./routes/paymentWebhook');

dotenv.config();

const app = express();

// ✅ Log all incoming requests
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  next();
});

app.use(bodyParser.json());
app.use(express.json());

// ✅ Mount each route file explicitly
app.use('/payments', initiatePaymentRoute);  // Should export / POST /
app.use('/payments', paymentSuccessRoute);    // Should export / POST /
app.use('/payments', webhookRoute);           // Should export / POST /

app.get('/', (req, res) => {
  res.send('Backend running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
