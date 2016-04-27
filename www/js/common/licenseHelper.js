/**
 * Created by Felix on 2016/4/23.
 */
var licenseHelper = function(){
     var _rsaKey;

     document.addEventListener("deviceready", function(){
         var passPhrase = device.uuid;
         // 公钥长度
         var Bits = 512;
         // 生成RSA密钥
         _rsaKey = cryptico.generateRSAKey(passPhrase, Bits);
     });

    var getEncryptTtext = function(plainText){
        // RSA公钥:
        var PublicKeyString = cryptico.publicKeyString(_rsaKey);
        //使用公钥加密
        var EncryptionResult = cryptico.encrypt(plainText, PublicKeyString);
        var encryptText = EncryptionResult.cipher;//密文

        return encryptText;
    };

    var getDecryptText = function(encryptText){
        //使用私钥解密
        var DecryptionResult = cryptico.decrypt(encryptText, _rsaKey);
        var decryptText = DecryptionResult.plaintext;//明文

        return decryptText;
    };

    var properties = {
        checkLicense: function(license){
            var decryptText = getDecryptText(license);
            var licenseInfo = JSON.parse(decryptText);
            var result = new LicenseCheckResult();
            if(!licenseInfo.uuid || !licenseInfo.expirationDate) {
                result.isValid = false;
            } else if(licenseInfo.uuid !== device.uuid) {
                result.isValid = false;
            } else{
                var expirationDate = new Date(licenseInfo.expirationDate);
                result.isValid = new Date().getTime() < expirationDate.getTime();
                result.exirationDate = expirationDate;
            }

            return result;
        }
    };

    return properties;
}();