export async function convertPayloadToQueryString(payload) {
  console.log(payload);
  let queryString = "";
  payload.forEach((item, index) => {
    queryString += `attr_id[]=${item.id}&attribute_value[]=${item.attribute_value}`;
    if (index !== payload.length - 1) {
      queryString += "&";
    }
  });
  return queryString;
}

export const fixChar = (text, num) => {
  if (!text) return;
  if (num < 0) {
    return text;
  }
  if (text.length <= num) {
    return text;
  }

  return text.slice(0, num) + "...";
};

export const nameToSlug = (string) => {
  if (!string) return;
  const lowerCaseString = string.toLowerCase();
  const words = lowerCaseString.split(" ");
  const slug = words.join("-");
  return slug;
};
