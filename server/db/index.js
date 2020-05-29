const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost/excuseWizard', { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(console.error);

let excuseSchema = new mongoose.Schema({
  excuse: String,
  likes: {
    type: Number,
    default: 1,
    min: 0
  }
}, { timestamps: true });

const Excuse = mongoose.model('Excuse', excuseSchema);

exports.listTopN = async (n = 10) => {
  let results = await Excuse.find().sort({ likes: -1, updatedAt: -1 }).limit(n).exec();
  return results;
};

exports.incrementLikes = async (_id, excuse) => {
  return Excuse.updateOne(
    { excuse },
    { $inc: { likes: 1 }},
    { upsert: true }
  )
    .then(res => {
      if (res.upserted) {
        return res.upserted[0]._id;
      } else {
        return _id;
      }
    })
    .catch(err => { throw err; });
};

exports.decrementLikes = async (_id, excuse) => {
  return Excuse.updateOne(
    { excuse },
    { $inc: { likes: -1 }}
  )
    .then(res => res.ok ? _id : null)
    .catch(err => { throw err; });
};

exports.getExcuseId = async (excuse) => {
  return Excuse.findOne({ excuse })
    .exec()
    .then(res => res ? res._id : null)
    .catch(err => { throw err; });
};






