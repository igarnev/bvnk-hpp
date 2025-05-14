export const handleCopyText = (
  value: string,
  buttonId: string,
  setCopied: (prev: { [clickedButton: string]: boolean }) => void
) => {
  navigator.clipboard.writeText(value);
  setCopied({ ...setCopied, [buttonId]: true });

  // Reset button state after 1 second
  setTimeout(() => {
    setCopied({ ...setCopied, [buttonId]: false });
  }, 1000);
};
