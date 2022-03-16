export function format(code: string) {
  const lines = code.split('\n');

  lines.splice(0, 1);
  const whitesAtTheBeginning = lines[0].search(/\S/);

  let newCode = '';
  lines.forEach((line) => {
    newCode += line.substring(whitesAtTheBeginning) + '\n';
  });

  return newCode.trimEnd() + '\n';
}
