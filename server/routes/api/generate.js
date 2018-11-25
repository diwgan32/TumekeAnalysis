const SubjectData = require('../../models/SubjectData');
const base64Img = require('base64-img');

module.exports = (app) => {

  app.get('/api/generate', (req, res, next) => {
    // Get the token
    const { query } = req;
    // ?token=test
    // Verify the token is one of a kind and it's not deleted.
    SubjectData.find({
      id: query['id'],
    }, (err, results) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      if (results.length != 1) {
      	console.log(results)
        return res.send({
          success: false,
          message: 'Error: Invalid',
        });
      } else {
      	//console.log('Path of file in parent dir:', require('path').resolve(__dirname, "../../static/" + results[0]["fileName"]))
        var imgData = base64Img.base64Sync(require('path').resolve(__dirname, "../../static/" + results[0]["fileName"]));
        return res.send({
          success: true,
          points: results,
          imgDisp: imgData
        });
      }
    });
  }); // end of verify


};