import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUuidValidation } from '../useUuidValidation';

describe('useUuidValidation', () => {
  it('should initialize with empty uuid and no error', () => {
    const { result } = renderHook(() => useUuidValidation());

    expect(result.current.uuid).toBe('');
    expect(result.current.error).toBe('');
  });

  it('should update uuid when handleUuidChange is called', () => {
    const { result } = renderHook(() => useUuidValidation());

    act(() => {
      result.current.handleUuidChange({
        target: { value: '123e4567-e89b-12d3-a456-426614174000' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.uuid).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should set error for invalid UUID format', () => {
    const { result } = renderHook(() => useUuidValidation());

    act(() => {
      result.current.handleUuidChange({
        target: { value: 'invalid-uuid' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.error).toBe('Please enter a valid UUID');
  });

  it('should clear error for valid UUID format', () => {
    const { result } = renderHook(() => useUuidValidation());

    // First set an invalid UUID
    act(() => {
      result.current.handleUuidChange({
        target: { value: 'invalid-uuid' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.error).toBe('Please enter a valid UUID');

    // Then set a valid UUID
    act(() => {
      result.current.handleUuidChange({
        target: { value: '123e4567-e89b-12d3-a456-426614174000' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.error).toBe('');
  });

  it('should not set error when uuid is empty', () => {
    const { result } = renderHook(() => useUuidValidation());

    act(() => {
      result.current.handleUuidChange({
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.error).toBe('');
  });
});
