// base64.js
export default function Base64Module({ encryptedText, onSuccess, print }) {
  let solved = false;

  function handleInput(input) {
    const valid = input.trim().toLowerCase() === 'try decode';
    if (!valid) {
      return print(`Invalid command. Use: try decode`);
    }

    try {
      const decoded = atob(encryptedText);
      print(`Decoded: ${decoded}`);

      if (!solved && /drop|bastion|carving|gate/i.test(decoded)) {
        solved = true;
        print(`✔ Decryption successful.`);
        if (onSuccess) onSuccess(decoded);
      }
    } catch (err) {
      print(`Error decoding Base64 string.`);
    }
  }

  print(`> Base64 Cipher loaded.`);
  print(`> Use: try decode`);

  return {
    handleInput
  };
}
