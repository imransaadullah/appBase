import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { render } from '../../src/utils/testUtils';
import Button from '../../src/components/common/Button';

describe('Button Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Button title="Test Button" />);
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    const { getByTestId } = render(
      <Button title="Test Button" loading testID="button" />
    );
    
    expect(getByTestId('button')).toBeTruthy();
  });

  it('disables button when disabled prop is true', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} disabled />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('applies custom styles', () => {
    const customStyle = { backgroundColor: 'red' };
    const { getByTestId } = render(
      <Button title="Test Button" style={customStyle} testID="button" />
    );
    
    const button = getByTestId('button');
    expect(button.props.style).toEqual(expect.objectContaining(customStyle));
  });
}); 