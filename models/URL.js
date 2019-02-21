const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./Counter');

const urlSchema = new Schema ({
  url : {type: String, required: true},
  index : {type: Number, required: false} // index will be determined before saving
});


// Get index before saving new URL
urlSchema.pre('save', function(next){
  
  const url = this;
  
  Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, function(err, counter) {
		if (err) return;
		if (counter) {
			url.index = counter.count;
      next();
		} else {
			const newCounter = new Counter();
			newCounter.save(function(err) {
				if (err) return;
				Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, function(err, counter) {
					if (err) return;
					url.index = counter.count;
          next();
				});
			});
		}
	});
});

module.exports = mongoose.model('URL', urlSchema);