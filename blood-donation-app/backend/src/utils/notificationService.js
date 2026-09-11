// Simulated SMS/Email Notification Dispatch Service for e-RaktKosh SOS

const notifyNearbyDonors = async ({ emergencyRequest, matchedDonorCount = 14 }) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`\n======================================================`);
  console.log(`[EMERGENCY SOS BROADCAST DISPATCHED] @ ${timestamp}`);
  console.log(`Patient: ${emergencyRequest.patientName} (${emergencyRequest.bloodGroup})`);
  console.log(`Hospital: ${emergencyRequest.hospitalName}, ${emergencyRequest.district}, ${emergencyRequest.state}`);
  console.log(`Units Required: ${emergencyRequest.unitsNeeded} units of ${emergencyRequest.component}`);
  console.log(`Urgency: ${emergencyRequest.urgency}`);
  console.log(`Target Recipient Reach: ${matchedDonorCount} eligible registered donors notified via MoHFW SMS Gateway & Portal Ticker`);
  console.log(`======================================================\n`);

  return {
    dispatched: true,
    recipientsCount: matchedDonorCount,
    channel: 'SMS_AND_INAPP_PUSH',
    dispatchedAt: new Date().toISOString()
  };
};

module.exports = {
  notifyNearbyDonors
};
