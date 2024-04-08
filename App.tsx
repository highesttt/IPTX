import React from 'react';
import {
  StatusBar,
  useColorScheme,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';

import LiveScreen from './screens/Live.tsx';
import MoviesScreen from './screens/Movies.tsx';
import SeriesScreen from './screens/Series.tsx';
import SearchScreen from './screens/Search.tsx';

import { SafeAreaProvider } from 'react-native-safe-area-context';

import {getMaterialYouCurrentTheme} from './utils/theme.ts';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LiveCategoryScreen from './screens/LiveCategory.tsx';
import PlayerScreen from './screens/Player.tsx';
import { useDeviceOrientation } from '@react-native-community/hooks';
import MoviesCategoryScreen from './screens/MoviesCategory.tsx';
import MoviesViewScreen from './screens/MoviesView.tsx';
import ProfileScreen from './screens/Profile.tsx';

const Tab = createMaterialBottomTabNavigator();

function LiveStackScreen() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'simple_push',
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Streams" component={LiveScreen} />
      <Stack.Screen name="Category" component={LiveCategoryScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
    </Stack.Navigator>
  );
}
function MoviesStackScreen() {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'simple_push',
        contentStyle: {backgroundColor: 'transparent'},
      }}>
      <Stack.Screen name="Streams" component={MoviesScreen} />
      <Stack.Screen name="Category" component={MoviesCategoryScreen} />
      <Stack.Screen name="View" component={MoviesViewScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
    </Stack.Navigator>
  );
}

function App(): React.JSX.Element {
  var orientation = useDeviceOrientation()


  const isDarkMode = useColorScheme() === 'dark';
  const style = getMaterialYouCurrentTheme(isDarkMode)

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={style.background}
        />
          <Tab.Navigator
            initialRouteName="Live"
            activeColor={style.primary}
            inactiveColor={style.text}
            barStyle={{
              backgroundColor: style.background,
              display: orientation == 'landscape' ? 'none' : 'flex',
            }}
            theme={{
              dark: isDarkMode,
              colors: {
                primary: style.primary,
                background: style.background,
                notification: style.primary,
                accent: style.primary,
                surface: style.background,
                placeholder: style.text,
                backdrop: style.background,
                secondary: style.primary,
                secondaryContainer: style.card,
              },
            }}
          >
            <Tab.Screen
              name="Live"
              component={LiveStackScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="television" color={color} size={24} />
                ),
              }}
            />
            <Tab.Screen
              name="Movies"
              component={MoviesStackScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="movie" color={color} size={24} />
                ),
              }}
            />
            <Tab.Screen
              name="Series"
              component={SeriesScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="television-classic" color={color} size={24} />
                ),
              }}
            />
            <Tab.Screen
              name="Search"
              component={SearchScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="magnify" color={color} size={24} />
                ),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account" color={color} size={24} />
                ),
              }}
            />
          </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
