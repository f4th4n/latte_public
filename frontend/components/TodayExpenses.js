import React, { useEffect, useState } from "react";
import {
  NativeBaseProvider,
  IconButton,
  Text,
  Heading,
  CheckIcon,
  Skeleton,
  Box,
  HStack,
  VStack,
  ScrollView,
} from "native-base";
import { StatusBar, StyleSheet, View, TouchableOpacity } from "react-native";
import { Icons as LucideIcon, icons as lucideIcons } from "lucide-react-native";

function rupiah(x) {
  return "Rp " + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function TodayExpenses({ todayExpenses }) {
  const tableData = todayExpenses
    .map((expense) => ({
      item: expense.product_name,
      category: expense.category,
      price: rupiah(parseInt(expense.amount.replace(/[^0-9]/g, ""), 10)),
      priceInt: parseInt(expense.amount.replace(/[^0-9]/g, ""), 10),
    }))
    .reverse();

  const total = tableData.reduce((acc, expense) => {
    return acc + expense.priceInt;
  }, 0);

  const PrintIcon = (params) => {
    if (!params.category) return null;

    const getCategoryIcon = () => {
      switch (params.category) {
        case "FOOD":
          return "Coffee";
        case "JAJAN":
          return "Cookie";
        case "GROCERIES":
          return "ShoppingCart";
        case "TRANSPORTASI":
          return "Car";
        case "HIBURAN":
          return "Tv";
        case "HOME SERVICES":
          return "House";
        case "FASHION":
          return "Shirt";
        case "FURNITURE":
          return "Sofa";
        case "SEDEKAH":
          return "Heart";
        case "BILLS":
          return "Receipt";
        case "MEDICINE":
          return "Pill";
        default:
          return "ShoppingCart";
      }
    };

    const categoryIcon = getCategoryIcon();
    const MyIcon = lucideIcons[categoryIcon];
    if (!MyIcon) {
      console.log("categoryIcon", categoryIcon);
      return <Text>No Icon</Text>;
    }
    return <MyIcon color={"#e6ab4c"} size={25} />;
  };

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      <Heading fontFamily="main" size="md" color="#444">
        Today Expenses
      </Heading>
      <Text fontFamily="main" fontSize={13} textAlign="right" color="amber.700">
        Total: {rupiah(total)}
      </Text>
      <ScrollView flex={1}>
        <VStack space={4} alignItems="center">
          <Box width={"100%"}>
            {/* <HStack p={2} justifyContent="space-between">
              <Text bold width="70%">
                Item
              </Text>
              <Text bold width="30%">
                Price
              </Text>
            </HStack> */}
            <VStack divider={<Box height={"2px"} bg="#fde4c3" />}>
              {tableData.map((item, index) => (
                <HStack key={index} p={2}>
                  <Box marginRight={3}>
                    <PrintIcon category={item.category} />
                  </Box>
                  <Text fontFamily="main" fontSize={17}>
                    {item.item}
                  </Text>
                  <Box flex={1} alignItems="flex-end">
                    <Text fontFamily="main" fontSize={17}>
                      {item.price}
                    </Text>
                  </Box>
                </HStack>
              ))}
            </VStack>
          </Box>
        </VStack>
      </ScrollView>
    </View>
  );
}
