import {
  Platform,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  useWindowDimensions,
  View,
  TextInput,
  Text,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import React from "react";
import { Icon } from "react-native-elements";
import Color from "../theme/Color";
import { GetAllRevisitorsData } from "../requests/recHomeRequest";


export interface SearchResults {
  document: Document;
}

export interface Document {
  _id: string;
  country: string;
  exchange: string;
  exchangeScore: number;
  id: string;
  in_SP_500: number;
  industry: string;
  isActivelyTrading: boolean;
  isEtf: boolean;
  isFund: boolean;
  marketCap: number;
  name: string;
  sector: string;
  ticker: string;
}

export default function SearchScreen() {
  const { top } = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);
  const getSearchResults = async (text:any) => {
    let payload = {
        UserCode: "",
    }

    try {
       await GetAllRevisitorsData(JSON.stringify(payload))?.then((response:any) => {
            console.log(response)
            if (response.data.Status) {
                searchResults(response.data.Data)
            }
        }).catch((error: any) => {
            console.log("error ", error)
        })
    } catch (error) {
        console.log("error ", error)
    }
}

  useEffect(() => {
    async function fetchStocks() {
      setSearchResults(await getSearchResults(searchQuery));
    }

    fetchStocks();
  }, [searchQuery]);

  const handleSubmit = async (text: string) => {
    const stocks = (await getSearchResults(text)) as SearchResults[];
  };

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: top }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 10,
        }}
      >
        <TextInput
          returnKeyType="search"
          placeholder="Search stocks ..."
          autoFocus
          placeholderTextColor={Color.blackRecColor}
          style={{ width: "100%",color:Color.blackRecColor,borderBottomWidth:1 }}
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={async (e) => {
            await handleSubmit(e.nativeEvent.text);
          }}
        />
      </View>

      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        {searchQuery ? (
          <>
            {searchResults.length === 0 ? (
              <View
                style={{
                  flex: 0.75,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.title}>No Stocks Matching Search</Text>
              </View>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.document.ticker}
                renderItem={({ item }) => (
                  <Pressable
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 15,
                      paddingHorizontal: 10,
                    }}
                    onPress={() => console.log("data")}
                  >
                    <View style={{ width: "75%" }}>
                      <Text style={styles.title}>{item.document.ticker}</Text>
                      <Text>{item.document.name}</Text>
                    </View>

                    <Text style={[styles.title, { paddingTop: 5 }]}>
                      {String.fromCodePoint(
                        ...[...item.document.country.toUpperCase()].map(
                          (x) => 0x1f1a5 + x.charCodeAt(0)
                        )
                      )}
                    </Text>
                  </Pressable>
                )}
              />
            )}
          </>
        ) : (
          <View
            style={{
              flex: 0.75,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.title}>Search Stocks ...</Text>
          </View>
        )}
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color:Color.blackRecColor
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});