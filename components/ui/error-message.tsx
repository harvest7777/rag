export default function ErrorMessage({ message }: { message: string }) {
  return <span className="text-destructive italic text-sm">{message}</span>;
}
