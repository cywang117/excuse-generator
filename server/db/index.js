const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/excuseWizard', { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(console.error);

let excuseSchema = new mongoose.Schema({
  excuse: String,
  likes: { type: Number, default: 1 }
});

const Excuse = mongoose.model('Excuse', excuseSchema);

exports.listTopN = async (n = 10) => {
  let results = await Excuse.find().sort({ likes: -1 }).limit(n).exec();
  return results;
};

exports.incrementLikes = async ({ _id, excuse }) => {
  return Excuse.updateOne(
    { excuse },
    { $inc: { likes: 1 }},
    { upsert: true }
  )
    .then(res => {
      if (res.upserted) {
        return res.upserted[0]._id;
      } else {
        return null;
      }
    })
    .catch(err => { throw err; });
};

exports.decrementLikes = async ({ _id }) => {
  Excuse.updateOne(
    { _id },
    { $inc: { likes: -1 }}
  )
    .catch(err => { throw err; });
};






