// caesar.js
export default function CaesarModule({ encryptedText, onSuccess, print }) {
  let solved = false;
  let attempts = 0;
  const maxAttempts = 3;

  function handleInput(input) {
    if (solved) return;
    if (attempts >= maxAttempts) {
      print(`❌ No attempts remaining. Decryption failed.`);
      return;
    }

    const match = input.trim().match(/^shift (\d{1,2})$/i);
    if (!match) {
      return print(`Invalid command. Use: shift <number>`);
    }

    const shift = parseInt(match[1], 10);
    if (isNaN(shift) || shift < 1 || shift > 25) {
      return print(`Shift must be a number between 1 and 25.`);
    }

    const decrypted = caesarDecrypt(encryptedText, shift);
    print(`Decrypted (${shift}): ${decrypted}`);

    if (/drop|bastion|carving|gate/i.test(decrypted)) {
      solved = true;
      print(`✔ Decryption successful.`);
      if (onSuccess) onSuccess(decrypted);
    } else {
      attempts++;
      const remaining = maxAttempts - attempts;
      print(`✖ Incorrect. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`);

      if (attempts >= maxAttempts) {
        print(`❌ File Corrupted. Too many failed attempts.`);
      }
    }
  }

  function caesarDecrypt(str, shift) {
    return str.split('').map(char => {
      if (char.match(/[a-z]/i)) {
        const base = char === char.toUpperCase() ? 65 : 97;
        const code = char.charCodeAt(0);
        const shifted = ((code - base - shift + 26) % 26) + base;
        return String.fromCharCode(shifted);
      }
      return char;
    }).join('');
  }

  // Initial output
  print(`> Caesar Cipher loaded.`);
  print(`> Use: shift <1–25> to attempt decryption. You have ${maxAttempts} attempts.`);

  return {
    handleInput
  };
}
