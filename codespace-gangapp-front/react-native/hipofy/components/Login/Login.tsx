import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/FontAwesome"
import Alert from "../Alert/Alert";
import { Text, TextInput, View, Button, StyleSheet, Dimensions, Image, Pressable } from "react-native";
import { Link } from "expo-router";
import CheckBox from 'expo-checkbox';
import {default as localStorage}  from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import Config from "../../constants/Config";
import LoadingLogin from "./LoadingLogin/LoadingLogin";


let width = Dimensions.get('window').width; //full width
let height = Dimensions.get('window').height; //full height

const Login = () => {
  const router = useRouter()
  
  const [isChecked, setIsChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(true);
  const [isLogging, setIsLogging] = useState(false);
  const [eye, setEye] = useState(true);
  const [alert, setAlert] = useState(false);
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState('')
  

  const handlePassword = () => {
    setEye(!eye);
  };
  const handleInputBlur = () => {
    setAlert(false);
     
  };

  const goToSignUp = () => {
    router.push('/singupPage')
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Reiniciar los estados alert e isLogged
    setAlert(false);
    setIsLogged(true);
    console.log(email)
    console.log(password)
    if (email !== "" && password !== "") {
      setIsLogging(true);
      const response = await fetch(`${Config.baseURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const dataResponse = await response.json();

      if (isChecked) {
        localStorage.setItem("Email", email);
        localStorage.setItem("Password", password);
      } else {
        localStorage.removeItem("Email");
        localStorage.removeItem("Password");
      }

      //Almacenamiento response en localStorage para traerlo en Profile
      if (response.status === 200) {
        localStorage.setItem("Response", JSON.stringify(dataResponse));
        localStorage.setItem("idUser", dataResponse.data.id);
        localStorage.setItem("Token", dataResponse.data.token);
        localStorage.setItem("Refresh_Token", dataResponse.data.refreshToken);
        router.replace('/home')
        setIsLogging(false);
        
        if (dataResponse.data.role === "admin") {
          // navigate("profile/admin/");
        }
        setIsLogged(true);
      } else {
        localStorage.clear();
        setIsLogged(false);
        setIsLogging(false);
      }

      try {
        localStorage.setItem("idUser", dataResponse.data.id);
        localStorage.setItem("Token", dataResponse.data.token);
        localStorage.setItem("Refresh_Token", dataResponse.data.refreshToken);
        setIsLogged(true);
        setIsLogging(false);
      } catch (error) {
        setIsLogging(false);
        setIsLogged(false);
      }
    } else {
      setIsLogging(false);
      setAlert(true);
    }
  };

  //UseEffect LocalStorage - Remember me
  useEffect(() => {
    // localStorage.getItem("Token").then( async (token) => {
    //   if(token){
    //     const responseVerifyToken = await fetch(`${Config.baseURL}/verifyToken`, {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({}),
    //     });

    //   const dataResponse = await responseVerifyToken.json();

    //     if(dataResponse.status === 200){
    //       localStorage.setItem("idUser", dataResponse.data.id);
    //       localStorage.setItem("Token", dataResponse.data.token);
    //       localStorage.setItem("Refresh_Token", dataResponse.data.refreshToken);
    //       router.replace('/home')
    //     }
    //   }
    // })
    // if (localStorage.getItem("Email") && localStorage.getItem("Password")) {
    //   document.querySelector("input[name='email']")!.textContent =
    //     localStorage.getItem("Email");
    //   document.querySelector("input[name='password']")!.textContent =
    //     localStorage.getItem("Password");
    //   setIsChecked(true);
    // }
  }, []);

  return (
    <View style={styles.mainlogin}>
      {isLogging ? 
      (<LoadingLogin />) 
      : 
      ( <View>
        <View style={styles.title}>
          <Image source={require('../../assets/images/hipofy-logo-login.png')} 
            style={{width: 222, height: 192}}
          />
          <Text style={styles.textMain}>Hipofy</Text>
          <Text style={styles.textSubMain}>La manera inteligente de ahorrar</Text>
        </View>
        <View style={styles.login}>
          <TextInput
            inputMode="email"
            value={email}
            onChangeText={setEmail}
            placeholder="Introduce tu email"
            onBlur={handleInputBlur}
            style={styles.textInput}
          />
          <TextInput
            inputMode="text"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={eye ? true : false}
            placeholder="Introduce tu contraseña"
            onBlur={handleInputBlur}
            style={styles.textInput}
          />
          <Icon
            style={styles.svg}
            name={eye ? 'eye' : 'eye-slash'}
            onPress={handlePassword}
          />
            <View style={styles.remember}>
              <CheckBox style={styles.checkbox}
                value={isChecked}
                onValueChange={setIsChecked}
              />
              <Text style={{fontSize: 16}}>Recordar sesión</Text>
            </View>
          {/* <View style={styles.buttonSubmit}>
            <Button
              onPress={handleSubmit}
              color={'#FFF'}
              title="Inicia sesión"
            />
          </View> */}
          <Pressable onPress={handleSubmit}>
            <View style={styles.buttonSubmit}>
              <Text style={styles.buttonSubmitText}>Inicia sesión</Text>
            </View>
          </Pressable>
        </View> 
        <View style={{marginTop: 15, alignSelf:'center'}}>
        <Pressable onPress={goToSignUp}>
          <Text>
            ¿Aún no estás registrado? Regístrate aquí
          </Text>
          </Pressable>
        </View>
      </View>
         )}
         {!isLogged ? <Alert text={"Email o contraseña incorrectos."} /> : null}
         {alert ? <Alert text={"El email y la contraseña son obligatorios."} /> : null}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({   
  mainlogin: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#22C990',
    width: width,
    height: height,
  },
  login: {
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#62d9b0',
    width: width - 50,
    borderRadius: 10,
    padding: 20,
    marginHorizontal:'auto'
  },
  title: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  
  },
  textMain: {
    color: '#A4FFF7',
    fontSize: 64,
    fontWeight: 'bold',
  },
  textSubMain: {
    color: '#A4FFF7',
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center'
  },
  svg : {
    position: 'absolute',
    right: 35,
    top: 122,
    fontSize: 22,
    color: 'rgba(0, 0, 0, 0.5)'
  },
  remember: {
    marginVertical: 20,
    display: 'flex',
    flexDirection: 'row',
  },
  checkbox: {
    marginHorizontal: 10,

  },
  textInput: {
    borderRadius: 6,
    backgroundColor: "#fff",
    padding: 14,
    width: '100%',
    marginTop: 15,
    color: "#000",
    fontSize: 20
  },
  buttonSubmit: {
    borderRadius: 6,
    marginTop: 10,
    backgroundColor: '#017BFE',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    width: width - 100,
    paddingVertical: 10
  },
  buttonSubmitText: { 
    textAlign: 'center',
    fontFamily: 'RubikRegular',
    fontSize: 24,
    color: '#FFF'
  }
});
