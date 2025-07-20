// vigenere.js
export default function VigenereModule({ encryptedText, onSuccess, print }) {
  let solved = false;

  function handleInput(input) {
    const match = input.trim().match(/^try key ([a-zA-Z]+)$/);
    if (!match) {
      return print(`Invalid command. Use: try key <word>`);
    }

    const key = match[1].toUpperCase();
    const decrypted = vigenereDecrypt(encryptedText, key);
    print(`Decrypted (${key}): ${decrypted}`);

    if (!solved && /drop|bastion|carving|gate/i.test(decrypted)) {
      solved = true;
      print(`✔ Decryption successful.`);
      if (onSuccess) onSuccess(decrypted);
    }
  }

  function vigenereDecrypt(ciphertext, key) {
    let output = '';
    key = key.toUpperCase();
    let j = 0;

    for (let i = 0; i < ciphertext.length; i++) {
      const c = ciphertext[i];
      if (c.match(/[a-z]/i)) {
        const base = c === c.toUpperCase() ? 65 : 97;
        const cCode = c.toUpperCase().charCodeAt(0) - 65;
        const kCode = key[j % key.length].charCodeAt(0) - 65;
        const pCode = (cCode - kCode + 26) % 26;
        const pChar = String.fromCharCode(base + pCode);

        output += pChar;
        j++;
      } else {
        output += c;
      }
    }

    return output;
  }

  print(`> Vigenère Cipher loaded.`);
  print(`> Use: try key <word> to attempt decryption.`);

  return {
    handleInput
  };
}
