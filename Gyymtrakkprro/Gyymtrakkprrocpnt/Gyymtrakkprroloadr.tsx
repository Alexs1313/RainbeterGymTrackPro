import {Image, ScrollView, StyleSheet, View} from 'react-native';

import React, {useEffect} from 'react';

import {useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';

const gyymtrakkprrohtmlloader = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  body {
    margin: 0;
    padding: 0;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .loading-wave {
    width: 300px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .loading-bar {
    width: 20px;
    height: 10px;
    margin: 0 5px;
    background-color: #3498db;
    border-radius: 5px;
    animation: loading-wave-animation 1s ease-in-out infinite;
  }

  .loading-bar:nth-child(2) {
    animation-delay: 0.1s;
  }

  .loading-bar:nth-child(3) {
    animation-delay: 0.2s;
  }

  .loading-bar:nth-child(4) {
    animation-delay: 0.3s;
  }

  @keyframes loading-wave-animation {
    0% { height: 10px; }
    50% { height: 50px; }
    100% { height: 10px; }
  }
</style>
</head>
<body>
  <div class="loading-wave">
    <div class="loading-bar"></div>
    <div class="loading-bar"></div>
    <div class="loading-bar"></div>
    <div class="loading-bar"></div>
  </div>
</body>
</html>`;

const Gyymtrakkprroloadr = () => {
  const gyymtrakkprroNavigation = useNavigation();

  useEffect(() => {
    const gyymtrakkprroTimer = setTimeout(() => {
      gyymtrakkprroNavigation.navigate('Gyymtrakkprroonb' as never);
    }, 6000);

    return () => {
      clearTimeout(gyymtrakkprroTimer);
    };
  }, [gyymtrakkprroNavigation]);

  return (
    <View style={styles.gyymtrakkprroimageBg}>
      <ScrollView
        contentContainerStyle={styles.gyymtrakkprroscrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image
            source={require('../../assets/i/gyymtrakkprroload.png')}
            style={{
              top: 20,
            }}
          />
        </View>
        <View style={styles.gyymtrakkprrobottomWrap}>
          <WebView
            source={{html: gyymtrakkprrohtmlloader}}
            scrollEnabled={false}
            originWhitelist={['*']}
            style={{width: 260, height: 150, backgroundColor: 'transparent'}}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Gyymtrakkprroloadr;

const styles = StyleSheet.create({
  gyymtrakkprroimageBg: {
    flex: 1,
    backgroundColor: '#1A1E3D',
  },
  gyymtrakkprroscrollContent: {
    flexGrow: 1,
  },

  gyymtrakkprrobottomWrap: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  gyymtrakkprrobottomText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'DmSans-Regular',
    marginTop: 11,
    textAlign: 'center',
  },
  gyymtrakkprrowebviewDock: {
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
  },
});
