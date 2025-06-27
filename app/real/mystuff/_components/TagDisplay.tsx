import { colorsToClass } from "../types";
type Props = {
  tag: Tag;
};
export default function TagDisplay({ tag }: Props) {
  return (
    <p
      className={`truncate rounded-sm px-1 w-fit ${
        colorsToClass[tag.tag_color].class
      }`}
    >
      {tag.tag_name}
    </p>
  );
}
