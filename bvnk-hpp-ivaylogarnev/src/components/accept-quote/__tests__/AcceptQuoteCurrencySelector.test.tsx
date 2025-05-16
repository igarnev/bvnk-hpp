import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { AcceptQuoteCurrencySelector } from '../AcceptQuoteCurrencySelector';
import { CURRENCY_OPTIONS } from '@utils/constants';

describe('AcceptQuoteCurrencySelector', () => {
  const mockOnCurrencyChange = vi.fn();

  const renderSelector = (selectedCurrency = '') => {
    return render(
      <AcceptQuoteCurrencySelector
        selectedCurrency={selectedCurrency}
        onCurrencyChange={mockOnCurrencyChange}
      />
    );
  };

  it('renders the label and placeholder', () => {
    renderSelector();

    expect(screen.getByText('Pay with')).toBeInTheDocument();
    expect(screen.getByText('Select Currency')).toBeInTheDocument();
  });

  it('renders all currency options', () => {
    renderSelector();

    // Open the select dropdown
    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    // Check that all currency options are rendered
    CURRENCY_OPTIONS.forEach((currency) => {
      expect(screen.getByText(currency.label)).toBeInTheDocument();
    });
  });

  it('calls onCurrencyChange when a currency is selected', () => {
    renderSelector();

    // Open the select dropdown
    const select = screen.getByRole('combobox');
    fireEvent.click(select);

    // Select a currency
    const option = screen.getByText(CURRENCY_OPTIONS[0].label);
    fireEvent.click(option);

    expect(mockOnCurrencyChange).toHaveBeenCalledWith(
      CURRENCY_OPTIONS[0].value
    );
  });

  it('displays the selected currency', () => {
    const selectedCurrency = CURRENCY_OPTIONS[0].value;
    renderSelector(selectedCurrency);

    expect(screen.getByText(CURRENCY_OPTIONS[0].label)).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    renderSelector();

    // Check label styling
    const label = screen.getByText('Pay with');
    expect(label).toHaveClass('block', 'text-sm', 'font-medium', 'mb-2');

    // Check select trigger styling
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('w-full');
  });
});
