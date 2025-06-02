// constants/ResponsiveTheme.ts
import { StyleSheet, Platform } from 'react-native';

export const ResponsiveStyles = StyleSheet.create({
  // Web Container
  webContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center' as 'center',
    alignItems: 'center' as 'center',
    padding: 20
  },

  // Web Cards
  webCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: 500,
    width: '100%'
  },

  webCardLarge: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 40,
    width: '100%',
    maxWidth: 800,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  // Responsive Grid
  webGrid: {
    flexDirection: 'row' as 'row',
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'space-between' as 'space-between',
    gap: 16,
  },

  webGridItem: {
    width: '48%',
    minWidth: 200,
  },

  // Web Navigation
  webHeader: {
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },

  // Responsive Text
  webTitle: {
    fontSize: 28,
    fontWeight: 'bold' as 'bold',
    textAlign: 'center' as 'center',
    marginBottom: 8,
    color: '#333',
  },

  webSubtitle: {
    fontSize: 16,
    textAlign: 'center' as 'center',
    marginBottom: 32,
    color: '#666',
  },

  // Web Buttons
  webButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center' as 'center',
    marginVertical: 8,
    minWidth: 200,
  },

  webButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as '600',
  },

  webButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },

  webButtonSecondaryText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600' as '600',
  },

  // Web Forms
  webFormGroup: {
    marginBottom: 20,
  },

  webLabel: {
    fontSize: 14,
    fontWeight: '600' as '600',
    marginBottom: 8,
    color: '#333',
  },

  webInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },

  webInputFocused: {
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

// Platform-specific helpers
export const getResponsiveWidth = (webWidth: number | string, mobileMultiplier: number) => {
  if (Platform.OS === 'web') {
    return webWidth;
  }
  return `${mobileMultiplier * 100}%`;
};

export const getResponsiveFontSize = (webSize: number, mobileSize: number) => {
  return Platform.OS === 'web' ? webSize : mobileSize;
};