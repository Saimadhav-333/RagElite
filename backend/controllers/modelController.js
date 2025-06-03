const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

exports.uploadPDF = async (req, res) => {
  try {
    const file = req.file;
    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.path));
    console.log(file);
    

    const response = await axios.post(`${process.env.FLASK_SERVER_URL}/train`, formData, {
      headers: formData.getHeaders(),
    });

    res.json({ message: "PDF sent to model", response: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};

exports.queryModel = async (req, res) => {
  try {
    const { question } = req.body;
    const response = await axios.post(`${process.env.FLASK_SERVER_URL}/query`, { question });
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Query failed" });
  }
};
