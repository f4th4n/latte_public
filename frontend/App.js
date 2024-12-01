import React, { useEffect, useState } from "react";
import {
  NativeBaseProvider,
  IconButton,
  Text,
  Heading,
  CheckIcon,
  Skeleton,
} from "native-base";
import { StatusBar, StyleSheet, View, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { requestProductDetail, postBudget, getExpenses } from "./latte/request";
import { Audio } from "expo-av";
import * as Font from "expo-font";
import LatteForm from "./components/LatteForm";
import TodayExpenses from "./components/TodayExpenses";
//import { useAudioPlayer } from "expo-audio";

export default function App() {
  //const player = useAudioPlayer(require("./assets/mic2.mp3"));

  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [isPostSuccess, setIsPostSuccess] = useState(false);
  const [todayExpenses, setTodayExpenses] = useState([]);

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [productName, setProductName] = useState("");

  const fetchTodayExpenses = () => {
    const getTodayExpenses = async () => {
      const expenses = await getExpenses();
      setTodayExpenses(expenses.data);
    };

    getTodayExpenses();
  };

  useEffect(() => {
    if (!isPostSuccess) return;

    fetchTodayExpenses();
  }, [isPostSuccess]);

  useEffect(() => {
    fetchTodayExpenses();
  }, []);

  const post = async () => {
    setCategory("");
    setAmount("");
    await postBudget(productName, amount, category);
    setIsPostSuccess(true);
    setTimeout(() => {
      setIsPostSuccess(false);
      setProductName("");
    }, 2000);
  };

  const clear = () => {
    setCategory("");
    setAmount("");
    setProductName("");
  };

  const recordStart = async () => {
    const recordingOptions = {
      android: {
        extension: ".aac",
        outputFormat: "mpeg4",
        audioEncoder: "aac",
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
      },
      ios: {
        extension: ".caf",
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
        sampleRate: 44100.0,
        numberOfChannels: 2,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
      },
    };

    try {
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
      setRecording(recording);
      setIsRecording(true);
      //player.play();
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const recordEnd = () => {
    setTimeout(async () => {
      setIsLoading(true);
      setIsRecording(false);
      await recording.stopAndUnloadAsync();

      const product = await requestProductDetail(recording);
      console.log("product", product);

      if (product) {
        console.log("setting....");
        setCategory(product.category);
        setAmount(product.price.toString());
        setProductName(product.name);
      } else {
        setProductName("network failed");
      }

      console.log("isloading false");
      setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    const requestPermission = async () => {
      await Audio.requestPermissionsAsync();
    };

    requestPermission();
  }, []);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        main: require("./assets/main.otf"),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const printForm = !isLoading;

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <View style={{ flex: 8, marginTop: StatusBar.currentHeight, gap: 10 }}>
          <View>
            <Heading textAlign="center" fontFamily="main" color="#444">
              Latte Daily Expenses
            </Heading>
          </View>
          {isLoading && (
            <Skeleton h={300} startColor="#fae7c8" endColor="#fcd79a" />
          )}
          {printForm && (
            <LatteForm
              setIsFilled={setIsFilled}
              setIsPostSuccess={setIsPostSuccess}
              setCategory={setCategory}
              setAmount={setAmount}
              setProductName={setProductName}
              category={category}
              amount={amount}
              productName={productName}
            />
          )}

          <View display={isPostSuccess ? "flex" : "none"}>
            <Text fontSize={15} textAlign="right">
              Berhasil memasukan {productName}{" "}
              <CheckIcon size={5} color="emerald.500" marginLeft={5} />
            </Text>
          </View>

          <TodayExpenses todayExpenses={todayExpenses} />
        </View>
        <View gap="10" position="absolute" bottom={15} right={15}>
          {isRecording && (
            <Text style={{ color: "gray", alignSelf: "flex-end" }}>
              Recording...
            </Text>
          )}
          <View flexDirection="row" gap={10} justifyContent="flex-end">
            {isFilled && (
              <View>
                <IconButton
                  size="lg"
                  borderRadius="full"
                  bg="gray.600"
                  variant="solid"
                  _hover={{
                    bg: "gray.600",
                  }}
                  _icon={{
                    as: MaterialIcons,
                    name: "close",
                  }}
                  padding={5}
                  onPressOut={clear}
                />
              </View>
            )}
            {isFilled && (
              <IconButton
                size="lg"
                borderRadius="full"
                bg="green.600"
                variant="solid"
                _hover={{
                  bg: "green.600",
                }}
                _icon={{
                  as: MaterialIcons,
                  name: "send",
                }}
                padding={5}
                onPressOut={post}
              />
            )}
            {!isFilled && (
              <IconButton
                size="lg"
                borderRadius="full"
                bg="red.600"
                variant="solid"
                _hover={{
                  bg: "red.600",
                }}
                _icon={{
                  as: MaterialIcons,
                  name: "pets",
                }}
                _pressed={{
                  bg: "red.900",
                }}
                padding={5}
                onPressIn={recordStart}
                onPressOut={recordEnd}
              />
            )}
          </View>
        </View>
      </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: "main",
    flex: 1,
    padding: 20,
    flexDirection: "column",
    backgroundColor: "#fcf1df",
  },
});
