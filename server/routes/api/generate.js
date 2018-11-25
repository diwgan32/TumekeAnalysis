const SubjectData = require('../../models/SubjectData');
const base64Img = require('base64-img');

module.exports = (app) => {
  app.get('/api/getsubjects', (req, res, next) => {
    SubjectData.distinct("subjectID", {}, (err, results) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      return res.send({
          success: true,
          subjects: results
      });
    });
  });

  app.get('/api/generate', (req, res, next) => {
    // Get the token
    const { query } = req;
    // ?token=test
    // Verify the token is one of a kind and it's not deleted.

    SubjectData.find({
      id: query['id'], subjectID: query["subjectID"]
    }, (err, results) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      if (results.length != 1) {
      	
        return res.send({
          success: false,
          message: 'Error: Invalid',
        });
      } else {
      	//console.log('Path of file in parent dir:', require('path').resolve(__dirname, "../../static/" + results[0]["fileName"]))
        var imgData = base64Img.base64Sync(require('path').resolve(__dirname, "../../static/" + query["subjectID"] + "/" + results[0]["fileName"]));
        return res.send({
          success: true,
          points: results,
          imgDisp: imgData
        });
      }
    });
  }); // end of get images


};