import mongoose from "mongoose";
import app from './app';

const uri = process.env.MONGOURI || 'mongodb://127.0.0.1:27017/repair-shop';
const options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.set('useFindAndModify', false);

const PORT: string | number = process.env.PORT || 4000;

mongoose
  .connect(uri, options)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server has started on port:${PORT}`)
    )
  )
  .catch(error => {
    throw error
  });

