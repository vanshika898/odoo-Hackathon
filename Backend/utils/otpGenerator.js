const otpGenerator = require("otp-generator");

const otp = otpGenerator.generate(4, {
  digits: true,
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false,
});
module.exports = otp;
