import dns from 'dns'
import { Counter, Url } from '../models'

function getCountAndIncrement(req, res, callback) {
	Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, (err, data) => {
		if (err) return
		if (data) {
			callback(data.count)
		} else {
			const newCounter = new Counter()
			newCounter.save(err => {
				if (err) return
				Counter.findOneAndUpdate({}, { $inc: { count: 1 } }, (err, data) => {
					if (err) return
					callback(data.count)
				})
			})
		}
	})
}
