export function ProviderComposer({providers, children}) {
  return providers.reduceRight((acc, {Provider, data = {}}) => <Provider {...data}>{acc}</Provider>, children);
}
