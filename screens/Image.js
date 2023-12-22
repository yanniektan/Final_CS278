import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const ImageItem = ({ image }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: image.uri }} style={styles.image} />
      <Text style={styles.date}>{image.date.toLocaleDateString()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 300,
  },
  date: {
    textAlign: 'center',
  },
});

export default ImageItem;