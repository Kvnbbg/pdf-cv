import React from 'react';
import { render } from '@testing-library/react-native';
import DetailsScreen from '../../pdf-cv/src/screens/DetailsScreen'; // Adjust path as necessary

// Mock react-navigation's useRoute and useNavigation hooks if needed,
// or pass params directly as shown if the component is simple enough.
// For this snapshot, we'll pass params directly.

describe('DetailsScreen', () => {
  it('renders correctly with given params (stars and tips)', () => {
    const mockRoute = {
      params: {
        stars: 4,
        tips: [
          'This is tip 1.',
          'This is tip 2.',
          'Another great tip here.',
        ],
      },
    };
    const tree = render(<DetailsScreen route={mockRoute} navigation={jest.fn()} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when tips are empty', () => {
    const mockRoute = {
      params: {
        stars: 3,
        tips: [],
      },
    };
    const tree = render(<DetailsScreen route={mockRoute} navigation={jest.fn()} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly when params are missing (or stars/tips undefined)', () => {
    const mockRoute = {
      params: {}, // Or params: { stars: undefined, tips: undefined }
    };
     // Suppress console.warn for this specific test case as we expect a warning
    const originalWarn = console.warn;
    console.warn = jest.fn();

    const tree = render(<DetailsScreen route={mockRoute} navigation={jest.fn()} />).toJSON();
    expect(tree).toMatchSnapshot();

    console.warn = originalWarn;
  });

  // Theme-based snapshot tests
  it('renders correctly in explicit light mode', () => {
    const mockRoute = {
      params: { stars: 4, tips: ['Use action verbs', 'Quantify achievements'] },
    };
    const tree = render(
      <ThemeProvider initialThemeMode="light">
        <DetailsScreen route={mockRoute} navigation={jest.fn()} />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly in dark mode', () => {
    const mockRoute = {
      params: { stars: 4, tips: ['Use action verbs', 'Quantify achievements'] },
    };
    const tree = render(
      <ThemeProvider initialThemeMode="dark">
        <DetailsScreen route={mockRoute} navigation={jest.fn()} />
      </ThemeProvider>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
