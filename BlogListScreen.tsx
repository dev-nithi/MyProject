import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebaseconfig';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Blog } from './types';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Blog'>;

const BlogListScreen: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [likedBlogs, setLikedBlogs] = useState<{ [key: string]: boolean }>({});
  const navigation = useNavigation<NavigationProp>();
  const timersRef = useRef<{ [key: string]: NodeJS.Timeout }>({});

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogSnapshot = await getDocs(collection(db, 'blogs'));
        const blogList = blogSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Blog)
        );
        setBlogs(blogList);

        blogList.forEach((blog) => {
          if (!timersRef.current[blog.id]) {
            timersRef.current[blog.id] = setTimeout(() => {
              setBlogs((prevBlogs) =>
                prevBlogs.filter((item) => item.id !== blog.id)
              );
              delete timersRef.current[blog.id];
            }, 600000); // 10 minutes
          }
        });
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();

    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
    };
  }, []);

  const handleLike = (blogId: string) => {
    setLikedBlogs((prev) => ({
      ...prev,
      [blogId]: !prev[blogId],
    }));
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

  const generatePDF = async (blog: Blog) => {
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
    <View style={styles.container}>
      <FlatList
        data={blogs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('BlogDetail', { blog: item })}
          >
            <View style={styles.blogCard}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.title}>{item.title}</Text>
              <Text numberOfLines={2} style={styles.description}>
                {item.description}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleLike(item.id)}>
                  <Text style={styles.likeButton}>
                    {likedBlogs[item.id] ? '❤️ Liked' : '🤍 Like'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => generatePDF(item)}>
                  <Text style={styles.downloadButton}>📥 Download as PDF</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('AddBlog')}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  blogCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  image: {
    height: 150,
    width: '100%',
    borderRadius: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  likeButton: {
    fontSize: 16,
    color: '#e91e63',
  },
  downloadButton: {
    fontSize: 16,
    color: '#4caf50',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#007bff',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
});

export default BlogListScreen;
