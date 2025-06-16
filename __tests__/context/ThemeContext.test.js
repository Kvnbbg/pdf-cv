import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text, View, useColorScheme as useRNCoreColorScheme } from 'react-native'; // Renamed import
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme, lightTheme, darkTheme } from '../../context/ThemeContext';

// Mock react-native's useColorScheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});
const mockedUseColorScheme = useRNCoreColorScheme; // Keep original name for clarity in mocking

// Test component to consume the theme
const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <View>
      <Text testID="themeMode">{theme.mode}</Text>
      <Text testID="backgroundColor">{theme.BACKGROUND_COLOR}</Text>
      <Text testID="textColor">{theme.TEXT_COLOR}</Text>
      <Text testID="toggleTheme" onPress={toggleTheme}>Toggle</Text>
    </View>
  );
};

describe('ThemeContext', () => {
  beforeEach(() => {
    // Reset mocks before each test
    AsyncStorage.getItem.mockResolvedValue(null); // Default to no stored theme
    AsyncStorage.setItem.mockClear();
    mockedUseColorScheme.mockReturnValue('light'); // Default system theme
  });

  it('provides light theme by default (no system preference, no AsyncStorage)', () => {
    mockedUseColorScheme.mockReturnValueOnce(null); // Simulate no system preference
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(getByTestId('themeMode').props.children).toBe('light');
    expect(getByTestId('backgroundColor').props.children).toBe(lightTheme.BACKGROUND_COLOR);
  });

  it('respects system light theme preference on initial load', () => {
    mockedUseColorScheme.mockReturnValueOnce('light');
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(getByTestId('themeMode').props.children).toBe('light');
  });

  it('respects system dark theme preference on initial load', () => {
    mockedUseColorScheme.mockReturnValueOnce('dark');
    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(getByTestId('themeMode').props.children).toBe('dark');
    expect(getByTestId('backgroundColor').props.children).toBe(darkTheme.BACKGROUND_COLOR);
  });

  it('loads and applies theme from AsyncStorage if available', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('dark');
    let getByTestId;
    await act(async () => {
      const rendered = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      getByTestId = rendered.getByTestId;
    });
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@theme_preference');
    expect(getByTestId('themeMode').props.children).toBe('dark');
  });

  it('overrides system and AsyncStorage with initialThemeMode prop', () => {
    mockedUseColorScheme.mockReturnValueOnce('dark'); // System is dark
    AsyncStorage.getItem.mockResolvedValueOnce('dark'); // AsyncStorage is dark
    const { getByTestId } = render(
      <ThemeProvider initialThemeMode="light"> {/* Explicitly set to light */}
        <TestComponent />
      </ThemeProvider>
    );
    // Should be light due to prop
    expect(getByTestId('themeMode').props.children).toBe('light');
    expect(getByTestId('backgroundColor').props.children).toBe(lightTheme.BACKGROUND_COLOR);
  });


  it('toggles theme from light to dark and saves to AsyncStorage', async () => {
    const { getByTestId, findByText } = render(
      <ThemeProvider initialThemeMode="light">
        <TestComponent />
      </ThemeProvider>
    );
    expect(getByTestId('themeMode').props.children).toBe('light');

    await act(async () => {
      getByTestId('toggleTheme').props.onPress();
    });

    expect(getByTestId('themeMode').props.children).toBe('dark');
    expect(getByTestId('backgroundColor').props.children).toBe(darkTheme.BACKGROUND_COLOR);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@theme_preference', 'dark');
  });

  it('toggles theme from dark to light and saves to AsyncStorage', async () => {
     const { getByTestId } = render(
      <ThemeProvider initialThemeMode="dark">
        <TestComponent />
      </ThemeProvider>
    );
    expect(getByTestId('themeMode').props.children).toBe('dark');

    await act(async () => {
      getByTestId('toggleTheme').props.onPress();
    });

    expect(getByTestId('themeMode').props.children).toBe('light');
    expect(getByTestId('backgroundColor').props.children).toBe(lightTheme.BACKGROUND_COLOR);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('@theme_preference', 'light');
  });
});
