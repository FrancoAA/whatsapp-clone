
export function toJSON(collection) {
  return collection.map(item => item.toJSON);
}
