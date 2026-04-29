import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const Gyymtrakkprrolay = ({
  children,
  bounces = true,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  bounces?: boolean;
}) => {
  return (
    <LinearGradient
      colors={['rgb(30, 37, 94)', 'rgb(16, 18, 38)']}
      style={styles.gyymtrakkrprrocontainer}>
      <ScrollView
        bounces={bounces}
        contentContainerStyle={styles.gyymtrakkrprroscrollContent}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </LinearGradient>
  );
};

export default Gyymtrakkprrolay;

const styles = StyleSheet.create({
  gyymtrakkrprroscrollContent: {
    flexGrow: 1,
  },
  gyymtrakkrprroflexFill: {
    flex: 1,
  },

  gyymtrakkrprrocontainer: {
    flex: 1,
    backgroundColor: '#1A1E3D',
  },
});
