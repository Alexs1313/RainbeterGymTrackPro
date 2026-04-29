import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

const Gyymtrakkprrolay = ({
  children,
  bounces = true,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  bounces?: boolean;
}) => {
  return (
    <View style={styles.gyymtrakkrprrocontainer}>
      <ScrollView
        bounces={bounces}
        contentContainerStyle={styles.gyymtrakkrprroscrollContent}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </View>
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
