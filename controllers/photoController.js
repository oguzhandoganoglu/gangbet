const upload = require('../utils/s3Upload');

// Tek fotoğraf yükleme controller'ı
const uploadBetPhoto = async (req, res) => {
  try {
    // multer-s3 middleware'i tarafından req.file eklenmiş olacak
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    // req.file.location, S3'teki dosyanın URL'sini içerir
    const photoUrl = req.file.location;
    
    res.status(200).json({ 
      message: "Photo uploaded successfully", 
      photoUrl 
    });
  } catch (error) {
    console.error("Upload Photo Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = {
  uploadBetPhoto
};