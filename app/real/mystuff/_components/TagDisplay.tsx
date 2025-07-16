import { colorsToClass } from "../types";
type Props = {
  tag: Tag;
};
export default function TagDisplay({ tag }: Props) {
  return (
    <p
      className={`truncate text-sm rounded-sm px-1 w-fit shrink-0 ${
        colorsToClass[tag.tag_color].class
      }`}
    >
      {tag.tag_name}
    </p>
  );
}
