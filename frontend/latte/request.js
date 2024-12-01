import { Platform } from "react-native";
import config from "../config.json";

export async function requestProductDetail(recording) {
  const body = new FormData();
  const blob = await fetch(recording.getURI()).then((r) => r.blob());

  if (Platform.OS === "web") {
    body.append("audio_file", blob, "item.m4a");
  } else if (Platform.OS === "android") {
    body.append("audio_file", {
      uri: recording.getURI(),
      name: "media.m4a",
      type: "audio/m4a",
    });
  }

  body.append(
    "categories",
    "FOOD, JAJAN, GROCERIES, TRANSPORTASI, HIBURAN, HOME SERVICES, FASHION, FURNITURE, SEDEKAH, BILLS, MEDICINE"
  );

  try {
    const response = await fetch(`${config.endpoint}/product`, {
      method: "POST",
      body,
      redirect: "follow",
    });

    if (!response.ok) {
      return null;
    }

    const responseJSON = await response.json();
    console.log("responseJSON", responseJSON);
    if (responseJSON.status === "success") {
      return responseJSON.data;
    }

    return null;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export function postBudget(productName, amount, category) {
  return new Promise(async (resolve, reject) => {
    const formdata = new FormData();
    formdata.append("product_name", productName);
    formdata.append("amount", amount);
    formdata.append("category", category);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch(`${config.endpoint}/budget`, requestOptions);
      const result = await response.text();
      resolve(result);
    } catch (error) {
      console.error(error);
      resolve(null);
    }
  });
}

export async function getExpenses() {
  const response = await fetch(`${config.endpoint}/today_expenses`);
  const result = await response.json();
  return result;
}
