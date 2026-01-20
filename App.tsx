import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

// Suppress InteractionManager deprecation warning from React Navigation
console.warn = (function(oriLogFunc) {
  return function(str) {
    if (str && str.toString().includes('InteractionManager has been deprecated')) {
      return;
    }
    oriLogFunc.apply(console, [...arguments]);
  };
})(console.warn);

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
