import {
  createNavigationContainerRef,
  CommonActions,
  StackActions,
} from '@react-navigation/native';
import type { RootStackParamList } from './types';

/**
 * Global navigation container reference for programmatic navigation outside components.
 */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Navigates immediately to the Home screen.
 * Uses instant stack popping to reveal the existing mounted Home screen in memory,
 * avoiding the heavy teardown/re-render penalty of a full stack reset.
 *
 * @returns true if navigation was performed, false if already at Home screen or navigator not ready.
 */
export function navigateToHomeScreen(): boolean {
  if (!navigationRef.isReady()) {
    return false;
  }

  const currentRoute = navigationRef.getCurrentRoute();
  if (currentRoute?.name === 'Home') {
    return false;
  }

  try {
    // Fast path: navigate back to Home (instantly pops the stack to the warm mounted HomeScreen)
    navigationRef.navigate('Home');
    return true;
  } catch {
    // Fallback if not directly navigable
    if (navigationRef.canGoBack()) {
      navigationRef.dispatch(StackActions.popToTop());
      return true;
    }
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      }),
    );
    return true;
  }
}
