export interface Address {
  readonly address: string;
  readonly tag: string | null;
  readonly protocol: string;
  readonly uri: string;
  readonly alternatives: unknown[];
}
