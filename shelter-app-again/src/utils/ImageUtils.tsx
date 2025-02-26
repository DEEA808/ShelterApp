/**
 * Adds the appropriate data URL scheme prefix to a base64-encoded image string.
 * @param base64String - The base64-encoded image string.
 * @param imageType - The type of the image (e.g., 'png', 'jpeg').
 * @returns The complete data URL string.
 */
export function addDataUrlPrefix(
    base64String: string,
    imageType: "png" | "jpeg" | "jpg"
  ): string {
    return `data:image/${imageType};base64,${base64String}`;
  }
  