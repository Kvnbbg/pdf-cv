import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const lightTheme = {
  mode: 'light',
  BACKGROUND_COLOR: '#FFFFFF',
  TEXT_COLOR: '#0B0B0B',
  MUTED_TEXT_COLOR: '#5C5C5C',
  PRIMARY_COLOR: '#007AFF',
  SECONDARY_COLOR: '#E0E0E0',
  SECONDARY_SURFACE_COLOR: '#F3F4F7',
  CARD_BACKGROUND_COLOR: '#F9F9F9',
  BORDER_COLOR: '#D6D6D6',
  BUTTON_TEXT_COLOR: '#FFFFFF',
  ERROR_TEXT_COLOR: '#C62828',
  ERROR_BACKGROUND_COLOR: '#FDEAEA',
  ERROR_BORDER_COLOR: '#F8C9C9',
  STAR_COLOR: '#FFC107',
  HEADER_BACKGROUND_COLOR: '#F0F0F0',
  PLACEHOLDER_TEXT_COLOR: '#A0A0A0',
  ACCENT_COLOR: '#1BC47D',
  SUCCESS_BACKGROUND_COLOR: '#E9F8F1',
  SUCCESS_TEXT_COLOR: '#0F7A4B',
  SHADOW_COLOR: '#000000',
};

export const darkTheme = {
  mode: 'dark',
  BACKGROUND_COLOR: '#121212',
  TEXT_COLOR: '#E6E6E6',
  MUTED_TEXT_COLOR: '#A1A1A1',
  PRIMARY_COLOR: '#0A84FF',
  SECONDARY_COLOR: '#333333',
  SECONDARY_SURFACE_COLOR: '#22272E',
  CARD_BACKGROUND_COLOR: '#1E1E1E',
  BORDER_COLOR: '#3A3A3A',
  BUTTON_TEXT_COLOR: '#FFFFFF',
  ERROR_TEXT_COLOR: '#FF8A80',
  ERROR_BACKGROUND_COLOR: '#3A1D1D',
  ERROR_BORDER_COLOR: '#613131',
  STAR_COLOR: '#FFD700',
  HEADER_BACKGROUND_COLOR: '#1C1C1C',
  PLACEHOLDER_TEXT_COLOR: '#707070',
  ACCENT_COLOR: '#2ED57B',
  SUCCESS_BACKGROUND_COLOR: '#123325',
  SUCCESS_TEXT_COLOR: '#7BE1AE',
  SHADOW_COLOR: '#000000',
};

const THEME_STORAGE_KEY = '@theme_preference';

export const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {
    console.log('Default toggleTheme called - Provider not yet initialized?');
  },
});

export const ThemeProvider = ({ children, initialThemeMode }) => {
  const systemColorScheme = useColorScheme();
  const [currentThemeMode, setCurrentThemeMode] = useState(initialThemeMode || systemColorScheme || 'light');

  useEffect(() => {
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
  }, [systemColorScheme, initialThemeMode]);

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

  useEffect(() => {
    if (initialThemeMode) return;

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      AsyncStorage.getItem(THEME_STORAGE_KEY).then((storedPreference) => {
        if (!storedPreference) {
          console.log('[ThemeProvider] System theme changed, no manual override, updating to:', colorScheme);
          setCurrentThemeMode(colorScheme || 'light');
        }
      });
    });
    return () => subscription.remove();
  }, [initialThemeMode]);

  const theme = currentThemeMode === 'light' ? lightTheme : darkTheme;

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
