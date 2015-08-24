/**
 * @Author: Geoffrey Bauduin <bauduin.geo@gmail.com>
 */
 
(function () {
	
	var express = require("express");
	var aws = require("aws-sdk");
	var config = require("./config.json");
	var bodyParser = require("body-parser");
	
	var app = express();
	
	app.use(function (req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "127.0.0.1");
		res.setHeader("Access-Control-Allow-Methods", "POST");
		res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
		res.setHeader("Access-Control-Allow-Credentials", true);
		res.setHeader("Content-Type", "application/json");
		next();
	});
	
	app.use(bodyParser.json())
	
	app.post("/s3/put", function (req, res) {
		aws.config.update({
			accessKeyId: req.body.access_key_id,
			secretAccessKey: req.body.secret_access_key
		})
		var bucket = new aws.S3({
			params: {
				Bucket: req.body.bucket,
				region: req.body.region
			}
		});
		var data = {
			Key: req.body.key,
			Body: req.body.body,
			ContentEncoding: req.body.content_encoding,
			ContentType: req.body.content_type
		}
		bucket.putObject(data, function (err, data) {
			if (err) {
				console.log(err);
				console.log("Error while uploading", data);
				res.status(500).send();
			}
			else {
				console.log("Successfully uploaded image");
				res.status(200).send();
			}
		});
	});
	
	app.listen(config.port, function () {
		console.log("Server is listening on port", config.port);
	})
	
}).call(this);