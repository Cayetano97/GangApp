import Spinner from "../Spinner/Spinner";
import { useState, useEffect } from "react";
import Alert from "../Alert/Alert";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Config from "../../constants/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../../store";

let width = Dimensions.get("window").width; //full width
let height = Dimensions.get("window").height; //full height

const Market = (props) => {
  let actualListId = store.useState(state => state.list.create.id)
  const router = useRouter();
  //UseStates
  const [markets, setMarkets] = useState({});
  const [prices, setPrices] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState(false);
  const [array, setArray] = useState([]);
  const [recomended, setRecomended] = useState({});
  const [isLoadingRecomended, setIsLoadingRecomended] = useState(false);
  const [savedMoney, setSavedMoney] = useState([]);
  const [savedMarket, setSavedMarket] = useState([]);
  const [respuesta, setRespuesta] = useState(null);
  const [id_list, setIdList] = useState(null);
  const [productsQuantity, setProductsQuantity] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const [priceFilterActive, setPriceFilterActive] = useState(false);

  //Const declarations
  const configInit = async () => {
    const respuestaAux =  await AsyncStorage.getItem("Response");
    setRespuesta(respuestaAux)
    const id_listAux =  await AsyncStorage.getItem("id_list");
    setIdList(id_listAux)
    const productsQuantityAux =  await AsyncStorage.getItem("product_quantity");
    setProductsQuantity(productsQuantityAux)
    const respuestaJson = JSON.parse(respuestaAux);
    setIdUser(respuestaJson.data.id);
  };

  const merged = Object.entries(markets).map((market) => {
    return {
      market: market[0],
      products: market[1],
      price: prices[market[0]],
    };
  });

  //Handle functions
  const handleButtonRedirect = (market, price) => {
    if (market && price) {
      updateSupermarketName(market, price);
    }
  };

  //Fetch functions
  const fetchMarkets = async (id) => {
    try {
      const tokenAux = await AsyncStorage.getItem("Token")
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token")
      const idListAsync = await AsyncStorage.getItem("id_list")
      setIsLoading(true);
      const response = await fetch(`${Config.baseURL}/listsmarket/${actualListId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMarkets(data.data.marketCount);
        setPrices(data.data.priceCount);
      }
    } catch (error) {
      console.log(error)
      setError(true);
    }
    setIsLoading(false);
  };

  const updateSupermarketName = async (market, price) => {
    try {
      const tokenAux = await AsyncStorage.getItem("Token")
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token")
      const idListAsync = await AsyncStorage.getItem("id_list")
      setIsLoading(true);
        const response = await fetch(`${Config.baseURL}/list/${actualListId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "auth-token": tokenAux,
            "auth-token-refresh": refreshTokenAux,
          },
          body: JSON.stringify({
            status: "Comprando",
            supermarkets: market,
            price: price,
          }),
        });
        if (response.ok) {
          await response.json();
          store.update((state) => {state.list.create.status = 'Comprando'})
          router.replace('/list')
        }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  //Handle filters functions

  const handlePriceFilter = () => {
    let orderPrice = merged;
    if (priceFilterActive) {
      orderPrice = merged.sort((a, b) => {
        return a.price - b.price;
      });
    } else {
      orderPrice = merged.sort((a, b) => {
        return a.price + b.price;
      });
    }
    setPriceFilterActive(!priceFilterActive);
    setArray(orderPrice);
  };

  const handleProductsFilter = () => {
    const orderProducts = merged.sort((a, b) => {
      return b.products - a.products;
    });
    setArray(orderProducts);
  };

  const recomendedMarket = () => {
    setIsLoadingRecomended(true);
    const products = merged.map((products) => products.products);
    const maxProducts = Math.max(...products); //Mayor producto individual
    const savedMoney = [];

    if (maxProducts == productsQuantity) {
      //Igualdad de productos
      const equalProducts = merged.filter(
        (product) => product.products == productsQuantity
      );

      const equalPrices = equalProducts.sort((a, b) => {
        return a.price - b.price;
      });

      setRecomended(equalPrices[0]);

      //Calcular el ahorro
      for (let index = 1; index < equalPrices.length; index++) {
        savedMoney[equalPrices[index].market] =
          equalPrices[index].price - equalPrices[0].price;
      }

      //Array de los ahorros
      const savedPrice = Object.values(savedMoney);
      const savedMarket = Object.keys(savedMoney);

      //Filtrar los ahorros mayores a 0
      const filteredSavedPrice = savedPrice.filter((price) => price > 0);
      const fixedPrice = filteredSavedPrice.map((price) => price.toFixed(2));
      const filteredSavedMarket = savedMarket.filter(
        (market) => savedMoney[market] > 0
      );

      setSavedMoney(fixedPrice);
      setSavedMarket(filteredSavedMarket);

      setIsLoadingRecomended(false);
    } else if (maxProducts < productsQuantity) {
      //Menor producto individual filtrado por cantidad y precio
      const lessProducts = merged.filter(
        (product) => product.products < productsQuantity
      );

      //Filtrar entre los de menor cantidad por cantidad y precio
      const sortLessProducts = lessProducts.sort((a, b) => {
        if (a.products != b.products) {
          return b.products - a.products;
        } else {
          return a.price - b.price;
        }
      });

      setRecomended(sortLessProducts[0]);

      //Calcular el ahorro
      for (let index = 1; index < sortLessProducts.length; index++) {
        savedMoney[sortLessProducts[index].market] =
          sortLessProducts[index].price - sortLessProducts[0].price;
      }

      //Array de los ahorros
      const savedPrice = Object.values(savedMoney);
      const savedMarket = Object.keys(savedMoney);

      //Filtrar los ahorros mayores a 0
      const filteredSavedPrice = savedPrice.filter((price) => price > 0);
      const fixedPrice = filteredSavedPrice.map((price) => price.toFixed(2));
      const filteredSavedMarket = savedMarket.filter(
        (market) => savedMoney[market] > 0
      );

      setSavedMoney(fixedPrice);
      setSavedMarket(filteredSavedMarket);

      setIsLoadingRecomended(false);
    } else {
      //Caso que nunca pasaría
      const never = merged.sort((a, b) => {
        return a.price - b.price;
      });
      setRecomended(never[0]);
      setIsLoadingRecomended(false);
    }
  };

  //UseEffects

  useEffect(() => {
    console.log('primer useeffect')
    fetchMarkets(id_list);
  }, [actualListId]);

  useEffect(() => {
    console.log('segundo useeffect')
    setArray(merged);
    recomendedMarket();
  }, [markets, prices]);

  useEffect(() => {
    console.log('tercero useeffect')
    configInit()
  }, [isLoading])

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          marginBottom: 10,
        }}
      >
        <View>
          <Text style={styles.headerSupermarketsOutCard}>
            Supermercado más barato
          </Text>
        </View>

        <View style={styles.separator} />

        <View>
          {isLoadingRecomended ? (
            <Spinner />
          ) : (
            recomended && (
              <Pressable
                style={styles.supermarketCard}
                onPress={() =>
                  handleButtonRedirect(recomended.market, recomended.price)
                }
                key={recomended.market}
              >
                <View>
                  <View>
                    <Text style={styles.supermarketCardTitle}>
                      {recomended.market}
                    </Text>
                  </View>
                  <View
                    style={{
                      borderColor: "rgba(0,0,0,0.10)",
                      borderWidth: 2,
                      borderBottomWidth: StyleSheet.hairlineWidth,
                    }}
                  />
                  <View style={styles.supermarketCardContent}>
                    {recomended.products === productsQuantity ? (
                      <View>
                        <Text style={styles.supermarketCardContentText}>
                          Tiene todos tus producto(s)
                        </Text>
                      </View>
                    ) : (
                      <View>
                        <Text style={styles.supermarketCardContentText}>
                          Tiene {recomended.products} productos de{" "}
                          {productsQuantity} que tiene tu lista de la compra
                        </Text>
                      </View>
                    )}
                    <View style={styles.supermarketCardContentPrice}>
                      <Text style={styles.supermarketCardContentText}>
                        Precio total estimado:{" "}
                      </Text>
                      <Text style={styles.supermarketCardContentPriceText}>
                        {recomended.price !== undefined
                          ? recomended.price.toFixed(2)
                          : recomended.price}{" "}
                        €
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            )
          )}
        </View>
        <View style={styles.otrosSupermercados}>
          <View>
            <Text style={styles.headerSupermarketsOutCard}>
              Resto de supermercados
            </Text>
          </View>

          <View style={styles.separator} />

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 15,
            }}
          >
            <View
              style={{
                width: "50%",
                height: "100%",
                borderBottomWidth: 2,
                borderBottomColor: "rgba(0,0,0,0.25)",
              }}
            >
              <Pressable
                onPress={handlePriceFilter}
                style={{ alignSelf: "center", marginBottom: 10 }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "rgba(0,0,0,0.75)",
                    textAlign: "justify",
                  }}
                >
                  Ordenar por precio
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                height: "100%",
                width: 2,
                backgroundColor: "rgba(0,0,0,0.25)",
              }}
            ></View>
            <View
              style={{
                width: "50%",
                height: "100%",
                borderBottomWidth: 2,
                borderBottomColor: "rgba(0,0,0,0.25)",
              }}
            >
              <Pressable
                onPress={handleProductsFilter}
                style={{ alignSelf: "center" }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: "rgba(0,0,0,0.75)",
                    textAlign: "right",
                  }}
                >
                  Ordenar por productos
                </Text>
              </Pressable>
            </View>
          </View>

          {isLoading ? (
            <Spinner />
          ) : error ? (
            <Alert text="Hubo un error. ¡Inténtalo de nuevo!" />
          ) : (
            <View style={{ flex: 1, flexDirection: "column" }}>
              {array &&
                array.length !== 0 &&
                array.map((market) => (
                  <Pressable
                    style={[
                      styles.supermarketCard,
                      styles.supermarketCardOthers,
                    ]}
                    onPress={() =>
                      handleButtonRedirect(market.market, market.price)
                    }
                    key={market.market}
                  >
                    <View>
                      <View>
                        <Text style={styles.supermarketCardTitle}>
                          {market.market}
                        </Text>
                      </View>
                      <View
                        style={{
                          borderColor: "rgba(0,0,0,0.10)",
                          borderWidth: 2,
                          borderBottomWidth: StyleSheet.hairlineWidth,
                        }}
                      />
                      <View style={styles.supermarketCardContent}>
                        {market.products === productsQuantity ? (
                          <View>
                            <Text style={styles.supermarketCardContentText}>
                              Tiene todos tus productos
                            </Text>
                          </View>
                        ) : (
                          <View>
                            <Text style={styles.supermarketCardContentText}>
                              Tiene {market.products} producto(s) de{" "}
                              {productsQuantity} que tiene tu lista de la compra
                            </Text>
                          </View>
                        )}
                        <View style={styles.supermarketCardContentPrice}>
                          <Text style={styles.supermarketCardContentText}>
                            Precio total estimado:{" "}
                          </Text>
                          <Text style={styles.supermarketCardContentPriceText}>
                            {market.price !== undefined
                              ? market.price.toFixed(2)
                              : market.price}{" "}
                            €
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                ))}
            </View>
          )}
        </View>
        {alert && (
          <Alert text="Debes seleccionar un supermercado para continuar." />
        )}
      </View>
    </ScrollView>
  );
};

export default Market;

const styles = StyleSheet.create({
  separator: {
    marginBottom: 30,
    height: 1.75,
    width: width,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  headerSupermarketsOutCard: {
    fontSize: 30,
    marginVertical: 10,
    marginHorizontal: 10,
    color: "rgba(0, 0, 0, 0.5)",

    fontFamily: "RubikBold",
  },
  otrosSupermercados: {
    marginTop: 30,
  },
  supermarketCard: {
    borderWidth: 2,
    borderColor: "#C3E6CB",
    alignSelf: "center",
    width: width - 25,
    borderRadius: 10,
  },
  supermarketCardOthers: {
    marginVertical: 10,
  },
  supermarketCardTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "rgba(0,0,0,0.50)",
    marginHorizontal: 10,
    marginVertical: 9,
  },
  supermarketCardContent: {
    padding: 10,
    flex: 1,
    flexDirection: "column",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  supermarketCardContentPrice: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "",
    marginTop: 10,
  },
  supermarketCardContentText: {
    fontFamily: "RubikRegular",
    fontSize: 20,
  },
  supermarketCardContentPriceText: {
    fontSize: 20,
    fontFamily: "RubikBold",
  },
});
