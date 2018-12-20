const graph = require('fbgraph');
const UserAllMedia = require('../models/UserAllMedia');
const InstagramPhotos = require('../models/InstagramPhotos');
const AdminTask = require('../models/AdminTask');
var Jimp = require('jimp');
const Utils = require('../util/util.js')
/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
    // res.render('api/index', {
    //     title: 'API Examples'
    // });
    res.status(200).send();

};


getAllInstagramMedia = (req, res, next, instagramBusinessAccountId) => {

    const token = req.user.tokens.find(token => token.kind === 'facebook');
    graph.setAccessToken(token.accessToken);
    const uri = instagramBusinessAccountId + '/media?fields=media_url,media_type,like_count,thumbnail_url,timestamp,permalink,caption,username';
    graph.get(uri, (err, data) => {
        if (err) {
            return next(err);
        }
        let val = saveUserMediaLiks(req, res, next, data);
    });
}


getInstagramMediaToUrl = (req, res, next, instagramBusinessAccountId) => {
    const token = req.user.tokens.find(token => token.kind === 'facebook');
    graph.setAccessToken(token.accessToken);
    const uri = instagramBusinessAccountId + '/media';
    graph.get(uri, (err, data) => {
        if (err) {
            return next(err);
        }
        res.send(data);
    });
}





/**
 * POST /account/importUserPhotos
 * Post User Photos.
 */
saveUserMediaLiks = (req, res, next, data) => {
    let allMedia = []

    data.data.forEach((media) => {
        var counter = 0;

        Jimp.read(media.media_url)
            .then(image => {
                // Do stuff with the image.
                // counter++;
                image
                    .resize(256, 256) // resize
                    .quality(100) // set JPEG quality
                    .getBase64(Jimp.MIME_JPEG, (err, res) => {
                        // console.log(res)
                        if(err){
                            console.log(err);
                        }
                        if(!err){
                            var temp = media;
                            temp.image = res;
                            ++counter;
                            if(counter<=1)
                            // console.log( temp.image);
                            // console.log('-------------------\n');
                            allMedia.push(createMedia(temp, req.user.facebook));
                        }
                       
                    });

            })
            .catch(err => {
                // Handle an exception.
                console.log('image upload error');
                console.log(err);
            });

        // allMedia.push(createMedia(media, req.user.facebook));


    })
    Promise.all(allMedia)
        .then((data) => {
            console.log(data);
            res.status(200).send('successfully impoted all the photos');
        }).catch((err) => {
            res.status(489).send('failed import photos')
        });
}

createMedia = async (mediaObject, userId) => {
    if (mediaObject.image) {
        //console.log(mediaObject.image)
    }
    const userAllMedia = new UserAllMedia({
        facebookId: userId,
        media_url: mediaObject.media_url,
        permalink: mediaObject.permalink,
        like_count: mediaObject.like_count,
        datePosted: mediaObject.timestamp,
        caption: mediaObject.caption,
        _id: mediaObject.id,
        image: ''
    });

    return UserAllMedia.findOne({
            _id: mediaObject.id
        })
        .then(existingMedia => {
            if (!existingMedia) {
                return userAllMedia.save((res) => {}, (err) => {
                    //console.log(err);
                });
            } else {

                return Promise.resolve(true);
            }
            // return

        })
        .catch(err => {
            console.log(err);
            return Promise.reject(err);
        })


}


/**
 * GET /api/getAllPhotoss
 * List getAllPhotoss of API examples.
 */
exports.getAllPhotos = (req, res) => {

    InstagramPhotos.find({}).then((result) => {
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(200).send([]);
        }
    }, (err) => {
        res.status(489).send(err);

    })

};

exports.getAllAdminTask = (req, res) => {

    AdminTask.find({}).then((result) => {
        if (result) {
            res.status(200).send(result);
        } else {
            res.status(200).send([]);
        }
    }, (err) => {
        res.status(489).send(err);

    });

};
exports.deleteAdminTask = (req, res) => {

    AdminTask.deleteMany({}).then((result) => {
        if (result) {
            res.status(200).send([{
                'result': 'sucess'
            }]);
        } else {
            res.status(200).send([]);
        }
    }, (err) => {
        res.status(489).send(err);

    })

};

/**
 * GET /api/facebook
 * Facebook API example.
 */
exports.getFacebook = (req, res, next) => {
    const token = req.user.tokens.find(token => token.kind === 'facebook');
    graph.setAccessToken(token.accessToken);
    graph.get(`me/accounts?fields=instagram_business_account`, (err, profile) => {
        if (err) {
            return next(err);
        }
        // console.log(profile);
        var instagramBusinessAccountId = profile.data[0].instagram_business_account.id;
        // console.log(instagramBusinessAccountId);

        let returnoffun = getAllInstagramMedia(req, res, next, instagramBusinessAccountId);
    });
};


//
// /**
//  * GET /api/scraping
//  * Web scraping example using Cheerio library.
//  */
// exports.getScraping = (req, res, next) => {
//   request.get('https://news.ycombinator.com/', (err, request, body) => {
//     if (err) { return next(err); }
//     const $ = cheerio.load(body);
//     const links = [];
//     $('.title a[href^="http"], a[href^="https"]').each((index, element) => {
//       links.push($(element));
//     });
//     res.render('api/scraping', {
//       title: 'Web Scraping',
//       links
//     });
//   });
// };