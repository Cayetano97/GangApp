import { useState, useEffect } from "react";
import CameraUploader from "../../../NewList/CameraUploader/CameraUploader";
import Spinner from "../../../Spinner/Spinner";
import Alert from "../../../Alert/Alert";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Checkbox from "expo-checkbox";
import Config from "../../../../constants/Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NewList from "../../../NewList/NewList";
import { IconH } from "../../../core/IconH/IconH";
import { store } from "../../../../store";
import { useRouter } from "expo-router";
// import { store } from "../../../../store";

let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height; //full height

const Finished = (props) => {
  let actualStatusList = store.useState((state) => state.list.create.status);
  const router = useRouter()
  //UseStates
  const [patchTicket, setPatchTicket] = useState([]);
  const [addTicket, setAddTicket] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [productSelected, setProductSelected] = useState([]);
  const [viewOptions, setViewOptions] = useState(false);
  const [editListState, setEditListState] = useState(false);
  const [data, setData] = useState(props.data);
  const [productCheckSelectAux, setProductCheckSelectAux] = useState([]);
  const [showTicketAlert, setShowTicketAlert] = useState(false);
  const [showFinishAlert, setShowFinishAlert] = useState(false);

  //Const declarations
  const id_list = data ? data._id : '';
  //Handle checkbox change
  const setEditListStateTrue = () => {
    setEditListState(true);
  };

  const handleCheckboxChange = async (id) => {
    console.log("id", id);
    const productCheckSelectAux = await AsyncStorage.getItem(
      `checked-products-${id_list}`
    );
    let productCheckSelect = productCheckSelectAux
      ? JSON.parse(productCheckSelectAux)
      : [];
    console.log("productCheckSelectEnter: ", productCheckSelect);
    const checkedProducts = data.id_products.map((product) => {
      if (product.id === id) {
        product.addedToCart = !product.addedToCart;
        if (product.addedToCart) {
          productCheckSelect.push(product);
        } else {
          productCheckSelect = productCheckSelect.filter((p) => p.id != id);
        }
      }
      return product;
    });
    setProductCheckSelectAux(productCheckSelect);
    AsyncStorage.setItem(
      `checked-products-${id_list}`,
      JSON.stringify(productCheckSelect)
    );
  };

  const handleAddTicket = () => {
    setAddTicket(!addTicket);
  };

  const handleImageUpload = () => {
    patchList();
    props.updateList();
  };

  const handleFinishWithouTicket = () => {
    setShowFinishAlert(true);
    patchList();
    setTimeout(() => {
      setShowFinishAlert(false);
    }, 3000);
  }

  const handleNavigateMarket = () => {
    // navigate(`/profile/market`);
  };

  //Fetch functions

  const patchList = async () => {
    try {
      const tokenAux = await AsyncStorage.getItem("Token");
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
      const response = await fetch(`${Config.baseURL}/list/${data._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
        body: JSON.stringify({
          status: "Finalizada",
        }),
      });

      if (response.ok) {
        await response.json();
        setPatchTicket(patchTicket);
        AsyncStorage.removeItem("id_list");
        AsyncStorage.removeItem("product_quantity");
        store.update((state) => {
          state.list.create.id = "";
        });
        store.update((state) => {
          state.list.create.status = "";
        });
        setViewOptions(false);
        setData(undefined);
      } else {
        throw new Error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //UseEffect

  useEffect(() => {
    const parseFunction = async () => {
      const checkedProductsAux = await AsyncStorage.getItem(
        `checked-products-${id_list}`
      );
      if (checkedProductsAux) {
        const checkedProducts = JSON.parse(checkedProductsAux);
        console.log("checkedProducts", checkedProducts);
        const singleCheckedProduct = checkedProducts.map(
          (product) =>
            data.id_products.some((checkedProduct) => {
              if (checkedProduct.id === product.id) {
                checkedProduct.addedToCart = true;
              }
            })
          // product.addedToCart === true ? true : false
        );
      }
    };
    parseFunction();
    console.log('stastus: ',store.getRawState())
  }, []);

  const editList = async () => {
    try {
      const tokenAux = await AsyncStorage.getItem("Token");
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
      const response = await fetch(`${Config.baseURL}/list/${id_list}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
        body: JSON.stringify({
          status: "Guardada",
        }),
      });

      if (response.ok) {
        const responseAux = await response.json();

        console.log("data");
        console.log(data);
        console.log("response");
        console.log(responseAux);
        setData(responseAux.data);
        setViewOptions(false);
        store.update((state) => {
          state.list.create.id = responseAux.data._id;
        });
        store.update((state) => {
          state.list.create.status = "EDIT";
        });
        console.log("data");
        console.log(data);
        console.log("response");
        console.log(responseAux);
      } else {
        throw new Error("Error ir a editar la lista");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteList = async () => {
    try {
      const tokenAux = await AsyncStorage.getItem("Token");
      const refreshTokenAux = await AsyncStorage.getItem("Refresh_Token");
      const response = await fetch(`${Config.baseURL}/list/${id_list}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": tokenAux,
          "auth-token-refresh": refreshTokenAux,
        },
      });

      if (response.ok) {
        const responseAux = await response.json();
        AsyncStorage.removeItem("id_list");
        AsyncStorage.removeItem("product_quantity");
        store.update((state) => {
          state.list.create.id = "";
        });
        store.update((state) => {
          state.list.create.status = "";
        });
        setViewOptions(false);
        setData(undefined);
      } else {
        throw new Error("Error borrando la lista");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView>
      <View style={{ height: height }}>
        <View>
          {props.isLoading ? (
            <Spinner />
          ) : props.error ? (
            <Alert text="Lo sentimos, algo salió mal... ¡Inténtalo de nuevo!" />
          ) : props.length === 0 ? (
            <Text>Aún no tienes ninguna lista. ¡Agrega una!</Text>
          ) : data.status === 'Comprando' ? (
            <View>
              <View style={{ marginVertical: 20 }}>
                <Text style={styles.supermarketTitle}>
                  Supermercado: {data.supermarkets}
                </Text>
                <View style={styles.separator} />
              </View>
              <View style={styles.card}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.cardTitle}>Productos</Text>
                  <Pressable onPress={() => setViewOptions(!viewOptions)}>
                    <IconH
                      name="ellipsis-v"
                      color="rgba(0, 0, 0, 0.45)"
                      styleIcon={styles.cardHeaderEllipsis}
                    />
                  </Pressable>
                </View>
                <View style={styles.cardContent}>
                  <View>
                    {data.id_products.map((product, index) => {
                      return (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            marginTop: 20,
                            alignItems: "center",
                          }}
                          key={index}
                        >
                          <Checkbox
                            value={
                              product.addedToCart ? product.addedToCart : false
                            }
                            onValueChange={() =>
                              handleCheckboxChange(product.id)
                            }
                            style={{
                              backgroundColor: "white",
                              borderColor: "white",
                              marginRight: 10,
                              marginLeft: 20,
                            }}
                          />
                          <Text
                            style={{
                              flex: 1,
                              fontSize: 18,
                              marginLeft: 5,
                              marginRight: 16,
                              fontFamily: "RubikBold",
                              color: "rgba(0, 0, 0, 0.45)",
                            }}
                          >
                            {product.name}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                  {viewOptions && (
                    <View style={styles.viewOptionsStyle}>
                      <Pressable onPress={editList}>
                        <Text style={styles.textOptions}>Añadir producto</Text>
                      </Pressable>
                      <View style={styles.separatorOptions} />
                      <Pressable
                        onPress={editList}
                        style={styles.pressableOptions}
                      >
                        <Text style={styles.textOptions}>Editar lista</Text>
                      </Pressable>
                      <View style={styles.separatorOptions} />
                      <Pressable
                        onPress={deleteList}
                        style={styles.pressableOptions}
                      >
                        <Text style={styles.textOptions}>Eliminar lista</Text>
                      </Pressable>
                      <View style={styles.separatorOptions} />
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.uploadTicketCard}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "space-between",
                    paddingHorizontal: 15,
                  }}
                >
                  <IconH
                    name="info-circle"
                    color="#94d2f9"
                    size={35}
                    styleIcon={{
                      // position: "absolute",
                      alignSelf: "center",
                      bottom: 10,
                    }}
                  />
                  <View
                    style={{
                      marginLeft: 15,
                      flexShrink: 1,
                    }}
                  >
                    <Text style={styles.uploadTicketCardText}>
                      ¿Has terminado ya tu compra?
                    </Text>
                    <Text style={styles.uploadTicketCardText}>
                      ¡Sube tu ticket para obtener recompensas!
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => {
                    setShowTicketAlert(true);
                    setTimeout(() => {
                      setShowTicketAlert(false);
                    }, 3000);
                  }}
                >
                  <Text style={styles.uploadTicketButton}>Subir ticket</Text>
                </Pressable>
                {showTicketAlert && (
                  <Alert
                    text="¡Ticket subido con éxito!"
                    setShowTicketAlert={setShowTicketAlert}
                  />
                )}
              </View>
              <View>
                <Pressable
                  onPress={handleFinishWithouTicket}
                >
                  <Text style={styles.noTicketButton}>
                    Continuar sin subir ticket
                  </Text>
                </Pressable>
                {showFinishAlert && (
                  <Alert
                    text="Compra finalizada"
                    setShowFinishAlert={setShowFinishAlert}
                  />
                )}
              </View>
            </View>
          ) : (
            <NewList actualList={data} />
          )}
        </View>
        {addTicket ? (
          <CameraUploader
            title="Añade el ticket de tu compra"
            handleImageUpload={handleImageUpload}
          />
        ) : null}
      </View>
    </ScrollView>
  );
};

export default Finished;

const styles = StyleSheet.create({
  separator: {
    height: 3,
    width: width,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  separatorOptions: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  viewOptionsStyle: {
    backgroundColor: "#FFF",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 6,
    marginTop: 5,
    position: "absolute",
    alignSelf: "flex-end",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  textOptions: {
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 10,
  },
  pressableOptions: {
    marginTop: 20,
  },
  supermarketTitle: {
    fontSize: 24,
    marginHorizontal: 18,
    marginBottom: 5,
    fontFamily: "RubikBold",
    color: "rgba(0, 0, 0, 0.5)",
  },
  card: {
    borderRadius: 6,
    elevation: 3,
    marginHorizontal: 10,
    marginVertical: 6,
    padding: 10,
    backgroundColor: "#83f1dd",
    marginLeft: 20,
    marginRight: 20,
  },
  cardContent: {
    marginHorizontal: 10,
    marginBottom: 50,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: "RubikBold",
    color: "rgba(0, 0, 0, 0.45)",
    marginHorizontal: 18,
    marginTop: 15,
  },
  cardHeaderEllipsis: {
    marginHorizontal: 18,
    marginTop: 15,
  },
  uploadTicketCard: {
    backgroundColor: "#83f1dd",
    borderRadius: 6,
    marginHorizontal: 6,
    marginVertical: 6,
    marginTop: 50,
    marginLeft: 20,
    marginRight: 20,
    padding: 20,
    paddingTop: 30,
    borderWidth: 2,
    borderColor: "#94d2f9",
  },
  uploadTicketCardText: {
    fontSize: 18,
    color: "rgba(0, 0, 0, 0.35)",
    fontFamily: "RubikBold",
    textAlign: "left",
    lineHeight: 25,
  },
  uploadTicketButton: {
    width: 200,
    fontSize: 20,
    alignSelf: "center",
    color: "rgba(0, 0, 0, 0.5)",
    backgroundColor: "#a4fff7",
    shadowColor: "black",
    fontFamily: "RubikRegular",
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 25,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 6,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    padding: 6,
  },
  noTicketButton: {
    width: 300,
    fontSize: 18,
    alignSelf: "center",
    color: "white",
    backgroundColor: "rgba(252, 67, 53, 0.8)",
    shadowColor: "black",
    fontFamily: "RubikRegular",
    textAlign: "center",
    lineHeight: 25,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 6,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    padding: 6,
  },
});
