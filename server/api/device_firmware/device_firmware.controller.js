const DeviceFirmware = require('./device_firmware.model')

// // // //

// Query / Sort / Paginate
const buildQuery = (opts) => {

    // Defines return payload object
    let payload = {};

    // Defines Mongoose query
    query = opts.schema.find(opts.query || {});

    // Sort
    if (opts.sort) {
        query.sort(opts.sort);
    }

    // Pagination
    if (opts.paginate) {

        // Default pagination options
        let page = Number(opts.page) || 0;
        let per_page = Number(opts.per_page) || 10;
        let skip = per_page * page;

        // Applies pagination options to query
        query.limit(per_page);
        query.skip(skip);

        // Assigns pagination parameters to payload
        payload.page = page;
        payload.per_page = per_page;

    }

    // Assigns query to payload
    payload.query = query;

    // Returns payload
    return payload;

}

// // // //

// GET /device_firmware
// TODO - pagination (middleware?)
module.exports.list = (req, res, next) => {
    // return Device.find({}).then(function(response) {
    //     return res.status(200).send(response).end();
    // }).catch(next);

    // Build paginated query
    let payload = buildQuery({
        schema:     DeviceFirmware,
        paginate:   true,
        page:       req.query.page,
        per_page:   req.query.per_page
    });

    // Returns paginated query
    return payload.query.lean().exec().then( (response) => {
        return res.status(200).send({
            page:       payload.page,
            per_page:   payload.per_page,
            items:      response })
        .end();
    }).catch(next);
};

// // // //

// POST /device_firmware
module.exports.create = (req, res, next) => {
    return new DeviceFirmware(req.body).save().then(function(response) {
        return res.status(200).send(response).end();
    }).catch(next);
};

// // // //

// GET /device_firmware/:id
module.exports.show = (req, res, next) => {
    return DeviceFirmware.findById(req.params.id).then(function(response) {
        return res.status(200).send(response).end();
    }).catch(next);
};

// // // //

// PUT /device_firmware/:id
module.exports.update = (req, res, next) => {
    return DeviceFirmware.findByIdAndUpdate(req.params.id, {$set: req.body}, { new: true }).then(function(response) {
        return res.status(200).send(response).end();
    }).catch(next);
};

// // // //

// DELETE /device_firmware/:id
module.exports.delete = (req, res, next) => {
    return DeviceFirmware.remove({_id: req.params.id }).then(function(response) {
        return res.status(200).send(response).end();
    }).catch(next);
};
