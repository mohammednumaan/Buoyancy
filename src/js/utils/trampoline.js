export default function trampoline(func) {
  return function enclose(...args) {
    let result = func(...args);
    while (typeof result === "function") {
      result = result();
    }
    return result;
  };
}
