const QRCode = require('qrcode');

const generateQRCode = async (data) => {
  try {
    const textData = typeof data === 'string' ? data : JSON.stringify(data);
    const qrDataUrl = await QRCode.toDataURL(textData, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 2,
      scale: 8,
      color: {
        dark: '#8b0000', // Deep crimsonGov theme
        light: '#ffffff'
      }
    });
    return qrDataUrl;
  } catch (err) {
    console.error('QR Generation failed:', err);
    throw new Error('Failed to generate QR code pass.');
  }
};

module.exports = {
  generateQRCode
};
