const cloudinary = require("../configs/cloudinary");
const crypto = require("crypto");
const { client } = require("../configs/redis")

const imageUpload = async (req, res) => {

    try {
        const User = req.User.UserID;
        const userName = req.User.name;
        const path = req.file.path;
        const hash = crypto.createHash('sha256').update(path).digest('hex');
        const publicId = `user_${User}_${hash}`;
        const result = await cloudinary.uploader.upload(path,
            {
                public_id: publicId,
                overwrite: true,
                invalidate: true,
                tags: `createdBy:${User}`
            });
        const url = result.secure_url;

        const existingUrls = await client.hGet(`User ${User}`, 'urls');
        // Combine the new url with the existing urls
        const updatedUrls = existingUrls ? JSON.parse(existingUrls).concat(url) : [url];
        // Store the updated urls back in the hash
        await client.hSet(`User ${User}`, {
            userName,
            urls: JSON.stringify(updatedUrls)
        });
        res.status(200).json({ success: true, message: "uploaded", data: result })
    } catch (err) {
        console.log(err);
    }
     }

const getImage = async (req, res) => {
    try {
        const User = req.User.UserID;
        const result = await client.hGetAll(`User ${User}`)
        res.status(200).json({ success: true, data: result });
    }
    catch (err) {
        throw new Error(err);
    }
}

const userImage = async (req, res) => {
    const { id: TASKID } = req.params;
    const result = await client.hGetAll(`User ${TASKID}`)
    if (!result) {
        throw new Error(err);
    }
    res.status(200).json({ success: true, data: result });

}
module.exports = { imageUpload, getImage, userImage };
