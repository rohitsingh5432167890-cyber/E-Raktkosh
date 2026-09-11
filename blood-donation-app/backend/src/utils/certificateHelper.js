const crypto = require('crypto');
const QRCode = require('qrcode');

const generateCertificateNumber = () => {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  return `ERK-CERT-${year}-${randomSuffix}`;
};

const createCertificatePayload = async ({
  donorName,
  donorId,
  bloodGroup,
  bloodBankName,
  component,
  donationDate,
  verifiedBy,
  certificateId: existingCertId
}) => {
  const certificateId = existingCertId || generateCertificateNumber();
  const verificationHash = crypto
    .createHash('sha256')
    .update(`${certificateId}:${donorId || 'DONOR'}:${donationDate}`)
    .digest('hex')
    .substring(0, 16);

  const verificationUrl = `https://eraktkosh.in/verify-cert/${certificateId}`;

  // QR Code payload contains cryptographic verification token
  const qrPayload = {
    standard: 'MoHFW_ERAKTKOSH_CERT_V1',
    certificateId,
    donor: donorName,
    bloodGroup,
    facility: bloodBankName,
    component: component || 'Whole Blood',
    date: donationDate,
    hash: verificationHash,
    verificationUrl
  };

  let qrCodeDataUrl = null;
  try {
    qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload), {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      scale: 6,
      color: {
        dark: '#8b0000',
        light: '#ffffff'
      }
    });
  } catch (err) {
    console.error('Failed to generate certificate QR code:', err);
  }

  return {
    certificateId,
    donorName,
    donorId,
    bloodGroup,
    bloodBankName,
    component: component || 'Whole Blood',
    donationDate,
    verifiedBy: verifiedBy || 'Chief Medical Officer, Transfusion Medicine',
    issuedAt: new Date().toISOString(),
    verificationHash,
    authorizedBy: 'Ministry of Health and Family Welfare (MoHFW), Govt. of India',
    verificationUrl,
    qrCode: qrCodeDataUrl
  };
};

module.exports = {
  generateCertificateNumber,
  createCertificatePayload
};
