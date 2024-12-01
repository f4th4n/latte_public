import React, { useEffect, useState } from "react";
import {
  NativeBaseProvider,
  Input,
  IconButton,
  Text,
  Heading,
  Select,
  CheckIcon,
  Skeleton,
  Box,
  HStack,
  VStack,
  ScrollView,
  Icon,
  IconComponent,
} from "native-base";
import { StatusBar, StyleSheet, View, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { postBudget } from "../latte/request";

export default function LatteForm({
  setIsFilled,
  setIsPostSuccess,
  setCategory,
  setAmount,
  setProductName,
  category,
  amount,
  productName,
}) {
  const categories = [
    "FOOD",
    "JAJAN",
    "GROCERIES",
    "TRANSPORTASI",
    "HIBURAN",
    "HOME SERVICES",
    "FASHION",
    "FURNITURE",
    "SEDEKAH",
    "BILLS",
    "MEDICINE",
  ];

  useEffect(() => {
    if (category != "" && amount != "" && productName != "") {
      setIsFilled(true);
    } else {
      setIsFilled(false);
    }
  }, [category, amount, productName]);

  return (
    <View style={{ gap: 5 }}>
      <View>
        <Text fontFamily="main" fontSize={17} marginBottom={1}>
          Item
        </Text>
        <Input
          size="lg"
          value={productName}
          onChangeText={(text) => setProductName(text)}
          bg="orange.100"
          borderRadius="xl"
          _focus={{
            borderColor: "orange.400",
            bg: "orange.50",
          }}
          _hover={{
            borderColor: "orange.400",
            bg: "orange.50",
          }}
          focusOutlineColor="orange.300"
          placeholderTextColor="orange.200"
        />
      </View>
      <View>
        <Text fontFamily="main" fontSize={17} marginBottom={1}>
          Category
        </Text>
        <Select
          selectedValue={category}
          _selectedItem={{
            bg: "cyan.200",
            endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          onValueChange={(itemValue) => setCategory(itemValue)}
          fontFamily="main"
          bg="orange.100"
          borderRadius="xl"
          _focus={{
            borderColor: "orange.400",
            bg: "orange.50",
          }}
          _hover={{
            borderColor: "orange.400",
            bg: "orange.50",
          }}
          focusOutlineColor="orange.300"
          placeholderTextColor="gray.400"
          _item={{
            bg: "orange.100",
          }}
        >
          {categories.map((category) => (
            <Select.Item
              key={category}
              label={category}
              value={category}
              fontFamily="main"
            />
          ))}
        </Select>
      </View>
      <View>
        <Text fontFamily="main" fontSize={17} marginBottom={1}>
          Amount
        </Text>
        <Input
          size="lg"
          InputLeftElement={
            <Text marginLeft={3} color="orange.400" fontFamily="main">
              Rp
            </Text>
          }
          value={amount}
          onChangeText={(text) => setAmount(text)}
          placeholder="Enter amount"
          borderRadius="xl"
          bg="orange.100"
          _focus={{
            borderColor: "orange.400",
            bg: "orange.50",
          }}
          _hover={{
            borderColor: "orange.400",
            bg: "orange.50",
          }}
          focusOutlineColor="orange.300"
          placeholderTextColor="gray.400"
          keyboardType="numeric"
        />
      </View>
    </View>
  );
}
