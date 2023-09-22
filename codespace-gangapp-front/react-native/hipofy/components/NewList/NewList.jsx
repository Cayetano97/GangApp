import React, { useState, useEffect } from "react";

import Alert from "../Alert/Alert";
import Icon from "react-native-vector-icons/FontAwesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons/faArrowLeftLong";
import {
  Button,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Link, router } from "expo-router";
import Market from "../Market/Market";
import Config from "../../constants/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CardProduct from "../Products/CardProduct/CardProduct";
import { store } from "../../store";

let width = Dimensions.get("window").width; //full width
let height = Dimensions.get("window").height; //full height

const NewList = (props) => {
  const [listName, setListName] = useState("");
  const [productName, setProductName] = useState("");
  const [matchingProducts, setMatchingProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [listNameError, setListNameError] = useState(false);
  const [noSelectedProducts, setNoSelectedProducts] = useState(false);
  const [idList, setIdList] = useState("");
  const [alert, setAlert] = useState(false);
  const [savedList, setSavedList] = useState(false);
  const [productsQuantity, setProductsQuantity] = useState(0);
  const [toSelectSupermarket, setToSelectedMarket] = useState(false);

  const handleListNameChange = (e) => {
    setListName(e);
  };

  const handleInputChange = (e) => {
    setProductName(e);
  };

  const handleBack = () => {
    window.history.back();
  };

  const addProductToList = (product) => {
    const isProductAdded = selectedProducts.some(
      (selectedProduct) => selectedProduct._id === product._id
    );

    if (!isProductAdded) {
      setSelectedProducts((prevProducts) => [...prevProducts, product]);
      setProductName("");
    }
  };

  const removeProductFromList = (product) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter(
        (selectedProduct) => selectedProduct._id !== product._id
      )
    );
  };


  const createList = async () => {
    if (listName === "") {
      setListNameError(true);
      return;
    }

    if (selectedProducts.length === 0) {
      setNoSelectedProducts(true);
      return;
    }

    try {
      setToSelectedMarket(true);
      const idUserAux = await AsyncStorage.getItem("idUser");
      const tokenAux = await AsyncStorage.getItem("Token");
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
      const response = await fetch(`${Config.baseURL}/list`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
        body: JSON.stringify({
          id_user: idUserAux,
          id_products: selectedProducts.map((product) => {
            return {
              id: product._id,
              name: product.name_product,
            };
          }),
          name_list: listName,
          status: "Guardada",
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear la lista");
      } else {
        const data = await response.json();
        setIdList(data.datasave._id);
        setProductsQuantity(data.datasave.id_products.length);
        console.log(data.datasave.id_products.length);
        AsyncStorage.setItem("id_list", data.datasave._id);
        AsyncStorage.setItem(
          "product_quantity",
          String(data.datasave.id_products.length)
        );
        console.log('datasave: ')
        console.log(data)
        console.log(`data.datasave._id: ${data.datasave._id}`)
        store.update((state) => {state.list.create.id = data.datasave._id})
        store.update((state) => {state.list.create.status = 'EDIT'})
      }
    } catch (error) {
      console.log("Error creating list:", error);
    }
  };
  const updateList = async () => {
    try {
      setToSelectedMarket(true);
      // setIsLoading(true);
      const tokenAux = await AsyncStorage.getItem("Token");
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
      setIdList(props.actualList._id)
      const response = await fetch(`${Config.baseURL}/list/${props.actualList._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
        body: JSON.stringify({
          name_list: listName,
          id_products: selectedProducts.map((product) => {
            return {
              id: product._id,
              name: product.name_product,
            };
          }),
          status: "Guardada",
        }),
      });

      if (response.ok) {
        await response.json();
        console.log('update list')
        AsyncStorage.setItem("product_quantity", String(selectedProducts.length));
        // props.setAlertGreen(true);
        // props.setAlertRed(false);
      } else {
        // props.setAlertGreen(false);
        // props.setAlertRed(true);
        throw new Error("Error al actualizar la lista");
      }
    } catch (error) {
      console.log(error);
    }
    // setIsLoading(false);
  };
  const handleButtonSave = () => {
    if(props.actualList){
      updateList();
    }else {
      createList();
    }
  };

  useEffect(() => {
    if (idList !== "") {
      console.log(idList);
      AsyncStorage.setItem("id_list", idList);
      setSavedList(true);
    }
  }, [idList]);

  useEffect(() => {
    console.log(props.actualList)
    if(props.actualList){
      setListName(props.actualList.name_list)
      setSelectedProducts(props.actualList.id_products.map((product) => {
        return {
          _id: product.id,
          name_product: product.name
        }
      }))
    }
  },[])

  const handleListNameFocus = () => {
    setListNameError(false);
  };

  const handleInputFocus = () => {
    setNoSelectedProducts(false);
  };

  useEffect(() => {
    const searchMatchingProducts = async () => {
      try {
        const tokenAux = await AsyncStorage.getItem("Token");
        const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
        const response = await fetch(
          `${Config.baseURL}/products/${productName}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": tokenAux,
              "auth-token-refresh": refreshTokenAux,
            },
          }
        );
        const { data } = await response.json();
        setMatchingProducts(data.slice(0, 5));
      } catch (error) {
        console.log("Error searching for products:", error);
      }
    };

    if (productName !== "" && productName.length >= 3) {
      searchMatchingProducts();
    } else {
      setMatchingProducts([]); // Limpiar la lista de productos coincidentes si el campo de búsqueda está vacío
    }
  }, [productName]);

  // const computedPropEditList = () =>{
  //   return !toSelectSupermarket || props.actualList
  // }

  return (
    <ScrollView>
      <View style={styles.container}>
        { !toSelectSupermarket ? (
          <View>
            <View style={styles.crearListaView}>
              { props.actualList ? 
              <Text style={styles.crearLista}>Editar lista</Text> 
              : <Text style={styles.crearLista}>Crear nueva lista</Text>}
            </View>
            <View>
              <TextInput
                placeholder="Nombre de la lista..."
                value={listName.charAt(0).toUpperCase() + listName.slice(1)}
                onChangeText={(text) => handleListNameChange(text)}
                style={styles.input}
              />
              <View style={styles.separator} />
              <TextInput
                placeholder="Escribe producto que deseas buscar..."
                value={
                  productName.charAt(0).toUpperCase() + productName.slice(1)
                }
                onChangeText={(text) => handleInputChange(text)}
                style={styles.input}
              />
              <View style={styles.separator} />
            </View>

            <View style={{marginTop: 10}}>
              <View>
                <View>
                  {matchingProducts && matchingProducts.length > 0
                    ? matchingProducts.map((product) => (
                        <View key={product._id}>
                          <CardProduct
                            nombre={product.name_product}
                            supermercado={product.market[0].name_market}
                            precio={product.market[0].price}
                            imagenUrl={product.img}
                          />
                          <View style={styles.button}>
                            <Button
                              style={styles.buttonFont}
                              onPress={() => addProductToList(product)}
                              title="Agregar a la lista"
                            ></Button>
                          </View>
                        </View>
                      ))
                    : null}
                </View>
              </View>
              <ImageBackground
                source={require("../../assets/FondoLista.jpg")}
                style={styles.backgroundImage}
              >
                <View style={styles.list}>
                  <Text style={styles.listName}>
                    {listName !== "" ? `${listName}:` : "Sin Nombre"}
                  </Text>
                  <View style={{ marginTop: 10, marginLeft: 24 }}>
                    {selectedProducts.map((product) => (
                      <View
                        key={product._id}
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                        }}
                      >
                        <Pressable
                          onPress={() => removeProductFromList(product)}
                        >
                          {/* Puedes usar un icono personalizado o un emoji aquí */}
                          <Text
                            style={{
                              fontSize: 10,
                              backgroundColor: "#c7bcba",
                              borderRadius: 50,
                              paddingLeft: 10,
                              paddingRight: 10,
                              paddingTop: 5,
                              paddingBottom: 5,
                              fontWeight: "bold",
                              textAlign: "center",
                              justifyContent: "center",
                              color: "white",
                              marginLeft: -12,
                            }}
                          >
                            X
                          </Text>
                        </Pressable>
                        <Text
                          style={{
                            marginLeft: 15,
                            marginRight: 5,
                            fontSize: 18,
                            fontFamily: "Escrita",
                            marginBottom: 5,
                            color: "#807c7b",
                          }}
                        >
                          {product.name_product}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </ImageBackground>
            </View>
            <View>
              <View style={styles.buttonContainer}>
                <Pressable style={styles.buttonCreate} onPress={handleButtonSave}>
                  <Text style={styles.textCreate}>
                    Recomiendame un supermercado
                  </Text>
                </Pressable>
                {/* </Link> */}
              </View>
            </View>
            {alert && (
              <Alert text="Lo sentimos, algo no ha ido como debía... ¡Inténtalo de nuevo!" />
            )}
          </View>
        ) : (
          <View>
            <Market />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default NewList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 10
  },
  separator: {
    height: 1,
    width: width,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  buttonCreate: {
    display: "flex",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 3,
    borderRadius: 5,
    backgroundColor: "#22c990",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
  },
  textCreate: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
    color: "white",
    fontFamily: "RubikBold",
  },
  crearListaView: {
    paddingTop: 2,
    paddingBottom: 5,
    paddingLeft: 15,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(0, 0, 0, 0.3)",
    color: "rgba(0, 0, 0, 0.5)",
    marginRight: 100,
    marginBottom: 10,
  },
  crearLista: {
    marginTop: 20,
    fontSize: 20,
    color: "rgba(0, 0, 0, 0.5)",
    fontFamily: "RubikRegular",
  },

  input: {
    height: 40,
    color: "#AFAFAF",
    padding: 6,
    fontSize: 16,
    paddingLeft: 15,
    marginTop: 15,
    fontFamily: "RubikRegular",
  },
  list: {
    flex: 1,
    flexDirection: "column",
  },
  listName: {
    textAlign: "center",
    textDecorationLine: "underline",
    fontFamily: "Escrita",
    fontSize: 26,
    color: "#807c7b",
    marginTop: -10,
    marginBottom: -15,
  },
  backgroundImage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: width,
    padding: 40,
  },
  button: {
    marginTop: 0,
    marginBottom: 15,
    marginLeft: 40,
    marginRight: 40,
  },
});
