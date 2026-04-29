import {Image, ScrollView, StyleSheet, View} from 'react-native';

import React, {useEffect} from 'react';

import {useNavigation} from '@react-navigation/native';
import WebView from 'react-native-webview';

const gyymtrakkprrohtmlloader = `  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: transparent;
        }

        .spinner {
          width: 44px;
          height: 44px;
          animation: spinner-y0fdc1 2s infinite ease;
          transform-style: preserve-3d;
          position: relative;
        }

        .spinner div {
          background-color: rgba(0,77,255,0.2);
          height: 100%;
          position: absolute;
          width: 100%;
          border: 2px solid #004dff;
        }

        .spinner div:nth-of-type(1) {
          transform: translateZ(-22px) rotateY(180deg);
        }

        .spinner div:nth-of-type(2) {
          transform: rotateY(-270deg) translateX(50%);
          transform-origin: top right;
        }

        .spinner div:nth-of-type(3) {
          transform: rotateY(270deg) translateX(-50%);
          transform-origin: center left;
        }

        .spinner div:nth-of-type(4) {
          transform: rotateX(90deg) translateY(-50%);
          transform-origin: top center;
        }

        .spinner div:nth-of-type(5) {
          transform: rotateX(-90deg) translateY(50%);
          transform-origin: bottom center;
        }

        .spinner div:nth-of-type(6) {
          transform: translateZ(22px);
        }

        @keyframes spinner-y0fdc1 {
          0% {
            transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
          }
          50% {
            transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
          }
          100% {
            transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
          }
        }
      </style>
    </head>

    <body>
      <div class="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
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
              width: 240,
              height: 240,
              borderRadius: 120,
              top: 50,
              right: 5,
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
