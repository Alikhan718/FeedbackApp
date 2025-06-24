const Tesseract = require('tesseract.js');

const ocrService = {
  async extractTextFromImage(imageBuffer) {
    try {
      const { data: { text } } = await Tesseract.recognize(
        imageBuffer,
        'eng',
        { logger: m => console.log(m) }
      );
      
      return {
        success: true,
        text: text.trim(),
        error: null
      };
    } catch (error) {
      console.error('OCR Error:', error);
      return {
        success: false,
        text: null,
        error: error.message
      };
    }
  }
};

module.exports = ocrService;
