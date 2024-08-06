const notFound = (req,res, next) => {
    res.status(400).json({msg: "route does not exist"});
}

module.exports = notFound;