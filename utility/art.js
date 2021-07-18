exports.shapeArtData = (req) => {
    var {body, files, user} = req;
    var gallery = [];
    files.forEach(({filename}) => {
        gallery.push(filename)
    })
    body.gallery = gallery;
    body.artist = user._id
    return body;
}