import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  ToastAndroid,
  Button,
  Text,
  Image,
  Alert,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

import {LoginButton, AccessToken} from 'react-native-fbsdk';

GoogleSignin.configure({
  webClientId:
    '669017854791-ekra5ltm96lo72dmad67qtig37aojbpe.apps.googleusercontent.com',
  androidClientId:
    '669017854791-fsq8iebusmem6isrral03arlvs974kuk.apps.googleusercontent.com',
  offlineAccess: true, // if you want to access Google API on behalf
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userGoogleInfo: {},
      loaded: false,
    };
  }

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({
        userGoogleInfo: userInfo,
        loaded: true,
      });
      console.log(this.state.userGoogleInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('e 1');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('e 2');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('e 3');
      } else {
        console.log(error.message);
      }
    }
    {
      Alert.alert('Successfull SignedIn');
    }
  };

  signOut = async () => {
    if (this.state.loaded === true) {
      Alert.alert('Successfull Logout');
    }

    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({userGoogleInfo: ''}); // Remember to remove the user from your app's state as well
      this.setState({loaded: false});
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <View>
        <GoogleSigninButton
          style={{width: 222, height: 48}}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.signIn}
        />
        {this.state.loaded ? (
          <View>
            <Text>SignedIn</Text>
          </View>
        ) : (
          <View>
            <Text>Not SignedIn</Text>
          </View>
        )}

        <Text style={{fontSize: 24}} onPress={() => this.signOut()}>
          Logout Google
        </Text>

        <LoginButton
          onLoginFinished={(error, result) => {
            if (error) {
              console.log('login has error: ' + result.error);
            } else if (result.isCancelled) {
              console.log('login is cancelled.');
            } else {
              AccessToken.getCurrentAccessToken().then((data) => {
                console.log(data.accessToken.toString());
              });
            }
          }}
          onLogoutFinished={() => console.log('logout.')}
        />
      </View>
    );
  }
}
