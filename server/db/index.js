const mongoose = require('mongoose');
//const dataset = require('../data/excuses.json');

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

// let dataSchema = new mongoose.Schema({
//   data: [String]
// });

const Excuse = mongoose.model('Excuse', excuseSchema);
// const Data = mongoose.model('Data', dataSchema);

// const initializeWithExistingData = async (data) => {
//   try {
//     await Data.updateOne({ data }, { $push: { values: { $each: data }}}, { upsert: true });
//   } catch(e) {
//     console.error(e);
//     return false;
//   }
//   return true;
// };

// initializeWithExistingData(dataset);

// exports.getAllData = async () => {
//   return await Data.find();
// };

// exports.addToData = async (excuse) => {
//   try {
//     const doc = await Data.find();
//     if (doc.length) {
//       doc.data.addToSet(excuse);
//       await doc.save();
//     }
//   } catch(e) {
//     console.error(e);
//     return false;
//   }
//   return true;
// };

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






