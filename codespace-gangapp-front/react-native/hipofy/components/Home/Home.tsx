
import { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import AsyncStorage from '@react-native-async-storage/async-storage';
import CardImageBackground from "../core/Card/CardImageBackground";
import Card from "../core/Card/Card";
import {useRouter} from "expo-router";
import Config from "../../constants/Config";
import { store } from "../../store";
import Screen from "../../constants/Screen";


const Home = () => {

  let listStore = store.useState(state => state.list.create.id)
  const router = useRouter()
  //UseStates
  const [dataResponseLists, setDataResponseLists] = useState<any>([]);
  const [hiddeButton, setHideButton] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [idUser, setIdUser] = useState(null)

  //Const declarations
  const endpoint = "random";

  const loginDataFromStorage = async (): Promise<any> => {
      await AsyncStorage.getItem("Response", (error, result) => {
        if(result){
          const auxResult = JSON.parse(result)
          setIdUser(auxResult.data.id)
          setToken(auxResult.data.token ? auxResult.data.token : '')
          setRefreshToken(auxResult.data.refreshToken ? auxResult.data.refreshToken : '')
          return
        }
      })
  }

  //Fetch functions
//  useEffect(() => {
//   AsyncStorage.removeItem("Token");
//         AsyncStorage.removeItem("Refresh_Token");
//         AsyncStorage.removeItem("Response");
//         AsyncStorage.removeItem("idUser");
//         AsyncStorage.removeItem("id_list");
//         AsyncStorage.removeItem("product_quantity");
//  }, []);
  //Id del usuario logueado (AsyncStorage)
  const fetchLastLists = async (id: any) => {
    try {
      setIsLoading(true);
      const tokenAux = await AsyncStorage.getItem("Token")
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token")
      const response = await fetch(`${Config.baseURL}/lastlist/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        } as any,
      });
      if (response.ok) {
        const dataResponseListsAux = await response.json();
        const dataResponseLists = dataResponseListsAux.data.filter((list: any) => list.status != 'Finalizada')
        if (dataResponseLists && dataResponseLists.length > 0) {
          setDataResponseLists(dataResponseLists.data);
          store.update((state) => {state.list.create.id = dataResponseLists[0]._id})
          setHideButton(false);
        }else{
          throw new Error("Array list is empty");
        }
      } else {
        // console.log(response)
        throw new Error("Something went wrong");
      }
    } catch (error: any) {
      console.log(error);
      setError(error);
      // AsyncStorage.removeItem("idUser");
      // AsyncStorage.removeItem("Token");
      // AsyncStorage.removeItem("Refresh_Token");
      // router.replace('/')
    }
    setIsLoading(false);
  };

  const pressCard = () => {
    console.log('pressed')
    router.replace('/list/')
  }

  const pressMisListas = () => {
    router.replace('/list/')
  }

  useEffect(() => {
    setHideButton(false);
    const initRequest = async () => {
      await loginDataFromStorage()
      await fetchLastLists(idUser);
    }
    initRequest()
  }, []);
  useEffect(() => {

    fetchLastLists(idUser);
  },[idUser,listStore])

  return (
    <View style={{height: Screen.height, backgroundColor: '#FFF'}}>
      {(listStore != '') ? (
        <Pressable onPress={pressCard}>
          <Card/> 
        </Pressable>
      ) : null }

      <Pressable onPress={() => {pressMisListas()}}>
        <CardImageBackground title='Mis listas de la compra' imageUrl='../../assets/images/home/productPrice.png' typeCard='shoppingList'/>
      </Pressable>

      <Pressable onPress={() => {router.replace('/(tabs)/products')}}>
        <CardImageBackground title='Precios de productos' imageUrl='../../assets/images/home/shoppingList.png' typeCard='productPrices'/>
      </Pressable>
    </View>
  );
};

export default Home;


const styles = StyleSheet.create({

})