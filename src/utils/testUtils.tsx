import React from 'react';
import { render as rtlRender } from '@testing-library/react-native';

// Simple render function without complex wrappers for now
function render(ui: React.ReactElement, renderOptions = {}) {
  return rtlRender(ui, renderOptions);
}

// Re-export everything from @testing-library/react-native
export * from '@testing-library/react-native';

// Override render method
export { render }; 