import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightTheme = {
  mode: 'light',
  BACKGROUND_COLOR: '#FFFFFF',
  TEXT_COLOR: '#000000',
  PRIMARY_COLOR: '#007AFF', // Blue
  SECONDARY_COLOR: '#E0E0E0', // Light gray for collapsible headers, etc.
  CARD_BACKGROUND_COLOR: '#F9F9F9',
  BORDER_COLOR: '#CCCCCC',
  ERROR_TEXT_COLOR: 'red',
  STAR_COLOR: '#FFC107', // Gold for stars
  HEADER_BACKGROUND_COLOR: '#F0F0F0',
  PLACEHOLDER_TEXT_COLOR: '#A0A0A0',
};

export const darkTheme = {
  mode: 'dark',
  BACKGROUND_COLOR: '#121212', // Very dark gray, almost black
  TEXT_COLOR: '#E0E0E0', // Light gray for text
  PRIMARY_COLOR: '#0A84FF', // Slightly brighter blue for dark mode
  SECONDARY_COLOR: '#333333', // Darker gray for collapsible headers
  CARD_BACKGROUND_COLOR: '#1E1E1E', // Dark gray for cards
  BORDER_COLOR: '#444444',
  ERROR_TEXT_COLOR: '#FF6B6B', // Lighter red
  STAR_COLOR: '#FFD700', // Brighter gold
  HEADER_BACKGROUND_COLOR: '#1C1C1C',
  PLACEHOLDER_TEXT_COLOR: '#707070',
};

const THEME_STORAGE_KEY = '@theme_preference';

export const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {
    console.log("Default toggleTheme called - Provider not yet initialized?");
  },
});

export const ThemeProvider = ({ children, initialThemeMode }) => { // Added initialThemeMode prop
  const systemColorScheme = useColorScheme();
  const [currentThemeMode, setCurrentThemeMode] = useState(initialThemeMode || systemColorScheme || 'light');

  useEffect(() => {
    // If an initialThemeMode is explicitly passed (e.g., for testing), don't try to load from AsyncStorage or system.
    if (initialThemeMode) {
      setCurrentThemeMode(initialThemeMode);
      return;
    }

    const loadThemePreference = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedPreference) {
          console.log('[ThemeProvider] Loaded theme preference from AsyncStorage:', storedPreference);
          setCurrentThemeMode(storedPreference);
        } else {
          console.log('[ThemeProvider] No theme preference in AsyncStorage, using system:', systemColorScheme);
          setCurrentThemeMode(systemColorScheme || 'light');
        }
      } catch (error) {
        console.error('[ThemeProvider] Error loading theme preference:', error);
        setCurrentThemeMode(systemColorScheme || 'light');
      }
    };
    loadThemePreference();
  }, [systemColorScheme, initialThemeMode]); // Add initialThemeMode to dependency array

  const toggleTheme = async () => {
    const newThemeMode = currentThemeMode === 'light' ? 'dark' : 'light';
    console.log('[ThemeProvider] Toggling theme to:', newThemeMode);
    setCurrentThemeMode(newThemeMode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeMode);
      console.log('[ThemeProvider] Saved theme preference to AsyncStorage:', newThemeMode);
    } catch (error) {
      console.error('[ThemeProvider] Error saving theme preference:', error);
    }
  };

  // This effect listens to system theme changes if no manual override is set.
  // However, once a manual override is set, we stick to it.
  // The current logic prioritizes stored preference over live system changes after first load.
  // To make it more dynamic with system changes when no manual override exists:
  useEffect(() => {
    // If initialThemeMode is set, this listener might not be needed or behave differently.
    // For simplicity in this change, keeping it. It primarily affects non-manual override scenarios.
    if (initialThemeMode) return; // Don't run this effect if initialThemeMode is provided

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      AsyncStorage.getItem(THEME_STORAGE_KEY).then(storedPreference => {
        if (!storedPreference) {
          console.log('[ThemeProvider] System theme changed, no manual override, updating to:', colorScheme);
          setCurrentThemeMode(colorScheme || 'light');
        }
      });
    });
    return () => subscription.remove();
  }, [initialThemeMode]); // Add initialThemeMode to dependency array


  const theme = currentThemeMode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
