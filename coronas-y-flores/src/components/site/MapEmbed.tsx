export function MapEmbed({ address, title }: { address: string; title: string }) {
  const q = encodeURIComponent(address);
  return <iframe title={title} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${q}&output=embed`} />;
}
