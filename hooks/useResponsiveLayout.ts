// hooks/useResponsiveLayout.ts
import { Dimensions, Platform } from 'react-native';
import { useMemo } from 'react';

export interface ResponsiveLayout {
  isWeb: boolean;
  isMobile: boolean;
  isTablet: boolean;
  screenWidth: number;
  screenHeight: number;
  buttonWidth: number | string;
  fontSize: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
    xlarge: number;
  };
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

export const useResponsiveLayout = (): ResponsiveLayout => {
  const { width, height } = Dimensions.get('window');
  const isWeb = Platform.OS === 'web';

  const layout = useMemo(() => {
    const breakpoints = {
      mobile: 768,
      tablet: 1024,
      desktop: 1200
    };

    const isMobile = width < breakpoints.mobile;
    const isTablet = width >= breakpoints.mobile && width < breakpoints.desktop;

    // Font sizes
    const baseFontSize = isWeb ? 16 : width * 0.04;
    const fontSize = {
      small: isWeb ? 12 : Math.max(width * 0.03, 12),
      medium: isWeb ? 16 : Math.max(width * 0.04, 14),
      large: isWeb ? 20 : Math.max(width * 0.05, 16),
      xlarge: isWeb ? 28 : Math.max(width * 0.07, 20)
    };

    // Spacing
    const spacing = {
      small: isWeb ? 8 : width * 0.02,
      medium: isWeb ? 16 : width * 0.04,
      large: isWeb ? 24 : width * 0.06,
      xlarge: isWeb ? 32 : width * 0.08
    };

    // Button width
    const buttonWidth = isWeb ? '100%' : width * 0.8;

    return {
      isWeb,
      isMobile,
      isTablet,
      screenWidth: width,
      screenHeight: height,
      buttonWidth,
      fontSize,
      spacing,
      breakpoints
    };
  }, [width, height, isWeb]);

  return layout;
};

// Utility functions
export const getResponsiveValue = (
  webValue: any,
  tabletValue: any,
  mobileValue: any,
  layout: ResponsiveLayout
) => {
  if (layout.isWeb && !layout.isMobile) return webValue;
  if (layout.isTablet) return tabletValue;
  return mobileValue;
};

export const getResponsiveMargin = (layout: ResponsiveLayout) => {
  return {
    marginHorizontal: layout.isWeb ? 0 : layout.spacing.medium,
    marginVertical: layout.spacing.small
  };
};

export const getResponsivePadding = (layout: ResponsiveLayout) => {
  return {
    paddingHorizontal: layout.isWeb ? layout.spacing.xlarge : layout.spacing.medium,
    paddingVertical: layout.spacing.medium
  };
};