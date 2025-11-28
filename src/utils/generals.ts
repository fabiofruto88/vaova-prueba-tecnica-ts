export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsDataURL(file);
  });
};

export const base64ToFile = (base64: string, filename = "file"): File => {
  const parts = base64.split(",");
  const meta = parts[0] || "";
  const data = parts[1] || "";
  const mimeMatch = meta.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const binary = atob(data);
  let length = binary.length;
  const u8arr = new Uint8Array(length);
  while (length--) {
    u8arr[length] = binary.charCodeAt(length);
  }
  return new File([u8arr], filename, { type: mime });
};

//Example: "fabio andres fruto jimenez" -> "Fabio Andres Fruto Jimenez"

export const capitalizeName = (name: string): string => {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  const capitalizeToken = (token: string) => {
    // Keep delimiters '-' and '\'' when splitting
    const parts = token.split(/(-|')/);
    return parts
      .map((p) => {
        if (p === "-" || p === "'") return p;
        return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
      })
      .join("");
  };
  return words.map(capitalizeToken).join(" ");
};
