import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// ✅ API URL for Sports News
const API_KEY = 'pub_8021873baf7e966bdd90e016f2828acdd7e38';
const SPORTS_URL = `https://newsdata.io/api/1/news?apikey=${API_KEY}&q=sports`;

type Article = {
  title: string;
  description: string;
  link: string;
  image_url: string;
  pubDate: string;
};

const Sports = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(SPORTS_URL)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching sports news:', err);
        setLoading(false);
      });
  }, []);

  const renderItem = ({ item }: { item: Article }) => (
    <TouchableOpacity style={styles.card} onPress={() => Linking.openURL(item.link)}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.image} />
      ) : null}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.date}>{new Date(item.pubDate).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#006600" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sports News</Text>
      <FlatList
        data={articles}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.title + index}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default Sports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006600',
    textAlign: 'center',
    marginVertical: 15,
  },
  list: {
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#ffffff',
    marginBottom: 15,
    padding: 15,
    borderRadius: 15,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: width * 0.5,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#006600',
    marginBottom: 5,
  },
  desc: {
    fontSize: 14,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
