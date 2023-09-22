import { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome"
import { IconH } from "../core/IconH/IconH";

const Alert = (props: any) => {
  const [isAlert, setIsAlert] = useState(true);

  const handleAlert = () => {
    setIsAlert(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsAlert(false);
    }, 5000);

    return () => {
      clearTimeout(1);
    };
  });

  return (
    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
      {/* <Icon name={'faXmark'} onPress={handleAlert} /> */}
      <Pressable>
        <IconH name="warning" color="#000" />
      </Pressable>
      <Text>{props.text}</Text>
    </View>
  );
};

export default Alert;
