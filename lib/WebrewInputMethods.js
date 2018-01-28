class WebrewInputDbMethods
{
    static GetDropdownList(options)
    {
        let sort = {};
        let reg = new RegExp(options.search, "i");
        let query = {};
        
        sort[options.valueProperty] = 1;
        query[options.valueProperty] = { $regex: reg };

        if (options.key != null && options.key != "") {
            query = { _id: options.key }
        }

        return options.document.find(query, { sort: sort})
        .fetch().map((item) => {
            return {
                key: item._id, value: item[options.valueProperty]
            }
        });
    }
}

module.exports = WebrewInputDbMethods;