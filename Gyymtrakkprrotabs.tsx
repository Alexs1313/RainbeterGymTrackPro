// tab navigation

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import React, {useRef} from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ImageSourcePropType,
  type ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Gyymtrakkprrowrkot from './Gyymtrakkprro/Gyymtrakkprroscreens/Gyymtrakkprrowrkot';
import Gyymtrakkprronutrtn from './Gyymtrakkprro/Gyymtrakkprroscreens/Gyymtrakkprronutrtn';

import Gyymtrakkprrocalndr from './Gyymtrakkprro/Gyymtrakkprroscreens/Gyymtrakkprrocalndr';

import Gyymtrakkprrotipps from './Gyymtrakkprro/Gyymtrakkprroscreens/Gyymtrakkprrotipps';
import Gyymtrakkprroreactntst from './Gyymtrakkprro/Gyymtrakkprroscreens/Gyymtrakkprroreactntst';

const Tab = createBottomTabNavigator();

const GyymtrakkprroAnimatedButton = (props: Record<string, unknown>) => {
  const {children, style, onPress, onLongPress, ...rest} = props;
  const gyymtrakkprroScale = useRef(new Animated.Value(1)).current;

  const gyymtrakkprroHandlePressIn = () => {
    Animated.spring(gyymtrakkprroScale, {
      toValue: 0.88,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const av = new Animated.Value(0);
  av.addListener(() => {
    return;
  });

  const gyymtrakkprroHandlePressOut = () => {
    Animated.spring(gyymtrakkprroScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress as () => void}
      onLongPress={onLongPress as (() => void) | undefined}
      onPressIn={gyymtrakkprroHandlePressIn}
      onPressOut={gyymtrakkprroHandlePressOut}
      style={[style as ViewStyle, styles.gyymtrakkprroButton]}
      {...rest}>
      <Animated.View
        style={[
          styles.gyymtrakkprroButtonInner,
          {transform: [{scale: gyymtrakkprroScale}]},
        ]}>
        {children as React.ReactNode}
      </Animated.View>
    </Pressable>
  );
};

const GyymtrakkprroIcon = ({
  focused,
  source,
  label,
}: {
  focused: boolean;
  source: ImageSourcePropType;
  label: string;
}) => {
  return (
    <View style={styles.gyymtrakkprroIconWrap}>
      <View style={styles.gyymtrakkprroIconImageWrap}>
        <Image source={source} tintColor={focused ? undefined : '#FFFFFF4D'} />
      </View>
      <Text
        style={[
          styles.gyymtrakkprroLabel,
          focused
            ? styles.gyymtrakkprroLabelFocused
            : styles.gyymtrakkprroLabelIdle,
        ]}>
        {label}
      </Text>
    </View>
  );
};

const gyymtrakkprroBarBackground = () => (
  <LinearGradient
    pointerEvents="none"
    colors={['#1A1E3DF2', '#1A1E3DF2']}
    style={StyleSheet.absoluteFill}
  />
);

const gyymtrakkprroIconPlaces = ({focused}: {focused: boolean}) => (
  <GyymtrakkprroIcon
    focused={focused}
    label="Workout"
    source={require('./assets/i/gyymtrakkprrotab1.png')}
  />
);

const gyymtrakkprroIconSaved = ({focused}: {focused: boolean}) => (
  <GyymtrakkprroIcon
    focused={focused}
    label="Nutrition"
    source={require('./assets/i/gyymtrakkprrotab2.png')}
  />
);

const gyymtrakkprroIconMap = ({focused}: {focused: boolean}) => (
  <GyymtrakkprroIcon
    focused={focused}
    label="Calendar"
    source={require('./assets/i/gyymtrakkprrotab3.png')}
  />
);

const gyymtrakkprroIconBlog = ({focused}: {focused: boolean}) => (
  <GyymtrakkprroIcon
    focused={focused}
    label="Tips"
    source={require('./assets/i/gyymtrakkprrotab4.png')}
  />
);

const gyymtrakkprroIconQuiz = ({focused}: {focused: boolean}) => (
  <GyymtrakkprroIcon
    focused={focused}
    label="Game"
    source={require('./assets/i/gyymtrakkprrotab5.png')}
  />
);

const gyymtrakkprroButton = (props: Record<string, unknown>) => (
  <GyymtrakkprroAnimatedButton {...props} />
);

const Gyymtrakkprrotabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [styles.gyymtrakkprroBar],
        tabBarActiveTintColor: '#FFFFFF',
        tabBarButton: gyymtrakkprroButton,
        tabBarBackground: gyymtrakkprroBarBackground,
      }}>
      <Tab.Screen
        name="Gyymtrakkprrowrkot"
        component={Gyymtrakkprrowrkot}
        options={{
          tabBarIcon: gyymtrakkprroIconPlaces,
        }}
      />
      <Tab.Screen
        name="Gyymtrakkprronutrtn"
        component={Gyymtrakkprronutrtn}
        options={{
          tabBarIcon: gyymtrakkprroIconSaved,
        }}
      />
      <Tab.Screen
        name="Gyymtrakkprrocalndr"
        component={Gyymtrakkprrocalndr}
        options={{
          tabBarIcon: gyymtrakkprroIconMap,
        }}
      />
      <Tab.Screen
        name="Gyymtrakkprrotipps"
        component={Gyymtrakkprrotipps}
        options={{
          tabBarIcon: gyymtrakkprroIconBlog,
        }}
      />
      <Tab.Screen
        name="Gyymtrakkprroreactntst"
        component={Gyymtrakkprroreactntst}
        options={{
          tabBarIcon: gyymtrakkprroIconQuiz,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  gyymtrakkprroLabelFocused: {
    color: '#0378DE',
    fontSize: 9,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  gyymtrakkprroBar: {
    elevation: 0,
    paddingTop: 10,
    justifyContent: 'center',
    position: 'absolute',
    paddingHorizontal: 6,
    borderColor: '#FFFFFF14',
    borderTopWidth: 1,
    borderTopColor: '#FFFFFF14',
    backgroundColor: 'transparent',
    height: 80,
    paddingBottom: 20,
    overflow: 'hidden',
  },

  gyymtrakkprroButton: {
    flex: 1,
  },
  gyymtrakkprroButtonInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  gyymtrakkprroIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
  },
  gyymtrakkprroIconImageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  gyymtrakkprroIconCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gyymtrakkprroIconCircleFocused: {
    borderWidth: 1,
    borderColor: '#805CB4',
  },
  gyymtrakkprroLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  gyymtrakkprroLabelIdle: {
    color: '#FFFFFF59',
  },
});

export default Gyymtrakkprrotabs;
