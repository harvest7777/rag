type Props = {
  tag: string;
};
export default function TagDisplay({ tag }: Props) {
  return (
    <p className=" truncate bg-pink-200 rounded-sm text-pink-600 px-1">{tag}</p>
  );
}
