const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/excuseWizard', { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(console.error);

let excuseSchema = new mongoose.Schema({
  excuse: String,
  likes: Number
});

const Excuse = mongoose.model('Excuse', excuseSchema);

exports.listAll = async () => {
  let results = await Excuse.find();
  return results;
};






