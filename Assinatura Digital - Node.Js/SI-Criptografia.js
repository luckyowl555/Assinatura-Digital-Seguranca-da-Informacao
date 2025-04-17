const crypto = require('crypto');
const { generateKeyPairSync } = crypto;

const { privateKey, publicKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048, 
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

function assinarMensagem(mensagem, chavePrivada) {

  const sign = crypto.createSign('SHA256');

  sign.update(mensagem);

  const assinatura = sign.sign(chavePrivada, 'hex');
  return assinatura;
}

function verificarAssinatura(mensagem, assinatura, chavePublica) {

  const verify = crypto.createVerify('SHA256');
 
  verify.update(mensagem);

  const isValid = verify.verify(chavePublica, assinatura, 'hex');
  return isValid;
}

const mensagemOriginal = "Esta é uma mensagem importante para ser assinada digitalmente.";

const assinatura = assinarMensagem(mensagemOriginal, privateKey);
console.log('Mensagem original:', mensagemOriginal);
console.log('Assinatura digital:', assinatura);

const isValidOriginal = verificarAssinatura(mensagemOriginal, assinatura, publicKey);
console.log('\nVerificação com mensagem original:', isValidOriginal ? '✅ Assinatura válida!' : '❌ Assinatura inválida!');

const mensagemAlterada = mensagemOriginal + " (Esta parte foi adicionada depois da assinatura)";

const isValidAlterada = verificarAssinatura(mensagemAlterada, assinatura, publicKey);
console.log('\nVerificação com mensagem alterada:', isValidAlterada ? '✅ Assinatura válida!' : '❌ Assinatura inválida! (como esperado, pois a mensagem foi alterada)');