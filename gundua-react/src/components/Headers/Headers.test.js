import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Headers from './Headers';

describe('<Headers />', () => {
  test('it should mount', () => {
    render(<Headers />);
    
    const headers = screen.getByTestId('Headers');

    expect(headers).toBeInTheDocument();
  });
});