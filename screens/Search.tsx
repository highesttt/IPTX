import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { getMaterialYouCurrentTheme } from '../utils/theme';

function SearchScreen(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const theme = getMaterialYouCurrentTheme(isDarkMode);

  return (
    <SafeAreaView style={{backgroundColor: theme.background}}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{backgroundColor: theme.background}}>
        <View
          className='flex-1 flex-col h-full'
          style={{
            backgroundColor: theme.background,
          }}>
          <Text className='text-2xl p-4 font-bold items-start' style={{
            color: theme.primary,
          }}>Search</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default SearchScreen;
