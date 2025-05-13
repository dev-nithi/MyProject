import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
  ScrollView,
  SafeAreaView,
  Linking,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from './types';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

type BlogDetailRouteProp = RouteProp<RootStackParamList, 'BlogDetail'>;

const BlogDetailScreen: React.FC = () => {
  const route = useRoute<BlogDetailRouteProp>();
  const { blog } = route.params;
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    setLiked((prev) => !prev);
    // TODO: Integrate with backend to persist like status
  };

  
const requestManageStoragePermission = async (): Promise<boolean> => {
  const androidVersion = Number(Platform.Version);
  const permission =
    androidVersion >= 30
      ? 'android.permission.MANAGE_EXTERNAL_STORAGE' // Use string to avoid TS error
      : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;

  const result = await request(permission as any); // Cast required to bypass TS error

  if (result !== RESULTS.GRANTED) {
    Alert.alert(
      'Permission Required',
      'You need to allow storage permission from settings.',
      [
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
    return false;
  }

  return true;
};

  const generatePDF = async () => {
    const hasPermission = await requestManageStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Denied',
        'Cannot save PDF without storage permission.'
      );
      return;
    }

    const htmlContent = `
      <h1>${blog.title}</h1>
      <img src="${blog.image}" style="width:100%;height:auto;" />
      <p>${blog.description}</p>
    `;

    try {
      const options = {
        html: htmlContent,
        fileName: blog.title.replace(/\s+/g, '_'),
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      Alert.alert('Success', `PDF saved to ${file.filePath}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
      console.error('PDF Generation Error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={{ uri: blog.image }} style={styles.image} />
        <Text style={styles.title}>{blog.title}</Text>
        <Text style={styles.description}>{blog.description}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleLike}>
            <Text style={styles.likeButton}>
              {liked ? '❤️ Liked' : '🤍 Like'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={generatePDF}>
            <Text style={styles.downloadButton}>📥 Download as PDF</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#444',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  likeButton: {
    fontSize: 16,
    color: '#e91e63',
  },
  downloadButton: {
    fontSize: 16,
    color: '#4caf50',
  },
});

export default BlogDetailScreen;
