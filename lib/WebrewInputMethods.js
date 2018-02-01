class WebrewInputDbMethods {
    static GetDropdownList(options) {
        let sort = {};
        let reg = new RegExp(options.search, "i");
        let query = {};

        sort[options.valueProperty] = 1;
        query[options.valueProperty] = { $regex: reg };

        if (options.key != null && options.key != "") {
            query = { _id: options.key }
        }

        return options.document.find(query, { sort: sort })
            .fetch().map((item) => {
                return {
                    key: item._id, value: item[options.valueProperty]
                }
            });
    }

    static UpdateSource(options) {
        if (options.key != null && options.key != "") {
            let record = options.collection.findOne(options.key);
            let recordInsert = {};
            recordInsert[options.name] = record;

            options.collectionUpdates.forEach((update) => {
                update.collection.update(update.id, { $set: recordInsert })
            });
        }
        else if (options.value != null && options.value != "") {
            let collectionInsert = {};
            collectionInsert[options.valueProperty || "Name"] = options.value;
            var insertCallback = undefined;
            if(options.collectionUpdates){
                insertCallback = (err, id) => {
                    let record = options.collection.findOne(id);
                    let recordInsert = {};
                    recordInsert[options.name] = record;
                    options.collectionUpdates.forEach((update) => {
                        update.collection.update(update.id, { $set: recordInsert })
                    });
                }
            }

            options.collection.insert(collectionInsert, insertCallback);
        }
    }
}

module.exports = WebrewInputDbMethods;