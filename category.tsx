import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Pressable,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {RouteProp, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

type RootStackParamList = {
  Categories: {username: string} | undefined;
  Politics: undefined;
  Sports: undefined;
  International: undefined;
  Blog: undefined;
  LiveNews: undefined;
  Profile: undefined;
};

type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'Categories'>;
type CategoryScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Categories'
>;

type CategoryScreenProps = {
  route: CategoryScreenRouteProp;
  navigation: CategoryScreenNavigationProp;
};

const {width} = Dimensions.get('window');

const CategoryScreen: React.FC<CategoryScreenProps> = ({navigation, route}) => {
  const {username} = route.params || {username: 'Guest'};

  return (
    <ImageBackground
      source={require('./assets/db14b912-56a3-4ce8-a37f-36bbce5a6cc0.jpg')}
      style={styles.background}
      resizeMode="cover"> 
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Categories</Text>
          </View>
          <Text style={styles.welcomeText}>
            Welcome, <Text style={styles.boldUsername}>{username}</Text>!
          </Text>

          <View style={styles.buttonGroup}>
            {[
              {label: 'Politics', route: 'Politics'},
              {label: 'Sports', route: 'Sports'},
              {label: 'International', route: 'International'},
            ].map(item => (
              <View key={item.route} style={styles.outerButton}>
                <Pressable
                  style={({pressed}) => [
                    styles.pixelButton,
                    pressed && styles.pixelButtonHover,
                  ]}
                  onPress={() => navigation.navigate(item.route as any)}>
                  <Text style={styles.pixelText}>+ {item.label}</Text>
                </Pressable>
              </View>
            ))}
          </View>

          <View style={styles.bottomBar}>
            <Pressable>
              <FontAwesome name="rocket" size={24} color="white" />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Blog')}>
              <FontAwesome name="plus-circle" size={24} color="#fff" />
            </Pressable>
            <Pressable onPress={() => navigation.navigate('LiveNews')}>
              <Text style={styles.liveText}>LIVE</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('Profile')}>
              <FontAwesome name="user" size={24} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  titleWrapper: {
    backgroundColor: '#c45d37',
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 20,
    marginHorizontal: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  welcomeText: {
    fontSize: 30,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  boldUsername: {
    fontWeight: 'bold',
    color: '#f78359',
  },
  buttonGroup: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  outerButton: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  pixelButton: {
    backgroundColor: '#994628',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  pixelButtonHover: {
    backgroundColor: '#fff',
    opacity: 0.8,
    cursor: 'pointer', // This works only in web
  },
  pixelText: {
    color: '#fff',
     fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Courier', // Optional to match pixel style
  },
  bottomBar: {
    position: 'absolute',
    bottom: 15,
    width: width * 0.9,
    height: 60,
    backgroundColor: '#ad4b28',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  liveText: {
    backgroundColor: 'black',
    color: 'red',
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default CategoryScreen;
