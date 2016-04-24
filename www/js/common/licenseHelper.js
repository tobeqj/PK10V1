/**
 * Created by Felix on 2016/4/23.
 */
var licenseHelper = function(){

     var getRSAKey = function(passPhrase){
         // 公钥长度
         var Bits = 512;
         // 生成RSA密钥
         var RSAkey = cryptico.generateRSAKey(passPhrase, Bits);
         return RSAkey;
     }

    var getEncryptTtext = function(passPhrase, plainText){
        // 生成RSA密钥
        var RSAkey = getRSAKey(passPhrase);
        // RSA公钥:
        var PublicKeyString = cryptico.publicKeyString(RSAkey);
        //使用公钥加密
        var EncryptionResult = cryptico.encrypt(plainText, PublicKeyString);
        var encryptText = EncryptionResult.cipher;//密文

        return encryptText;
    };

    var getDecryptText = function(passPhrase, encryptText){
        // 生成RSA密钥
        var RSAkey = getRSAKey(passPhrase);
        //使用私钥解密
        var DecryptionResult = cryptico.decrypt(encryptText, RSAkey);
        var decryptText = DecryptionResult.plaintext;//明文

        return decryptText;
    }

    var properties = {
        createLicense: getEncryptTtext,
        checkLicense: function(passPhrase, license){
            var decryptText = getDecryptText(passPhrase, license);
            return decryptText == passPhrase;
        }
    };

    return properties;
}();