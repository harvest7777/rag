export const colors: { name: Colors; class: string; ring: string }[] = [
  { name: "gray", class: "bg-gray-300 text-gray-800", ring: "ring-gray-600" },
  {
    name: "orange",
    class: "bg-orange-300 text-orange-900",
    ring: "ring-orange-800",
  },
  {
    name: "yellow",
    class: "bg-yellow-300 text-yellow-900",
    ring: "ring-yellow-800",
  },
  {
    name: "green",
    class: "bg-green-300 text-green-900",
    ring: "ring-green-800",
  },
  { name: "blue", class: "bg-blue-300 text-blue-900", ring: "ring-blue-800" },
  {
    name: "purple",
    class: "bg-purple-300 text-purple-900",
    ring: "ring-purple-800",
  },
  { name: "pink", class: "bg-pink-300 text-pink-900", ring: "ring-pink-800" },
  { name: "red", class: "bg-red-300 text-red-900", ring: "ring-red-800" },
];

export const colorsToClass: Record<Colors, { class: string; ring: string }> = {
  gray: { class: "bg-gray-300 text-gray-800", ring: "ring-gray-600" },
  orange: { class: "bg-orange-300 text-orange-900", ring: "ring-orange-800" },
  yellow: { class: "bg-yellow-300 text-yellow-900", ring: "ring-yellow-800" },
  green: { class: "bg-green-300 text-green-900", ring: "ring-green-800" },
  blue: { class: "bg-blue-300 text-blue-900", ring: "ring-blue-800" },
  purple: { class: "bg-purple-300 text-purple-900", ring: "ring-purple-800" },
  pink: { class: "bg-pink-300 text-pink-900", ring: "ring-pink-800" },
  red: { class: "bg-red-300 text-red-900", ring: "ring-red-800" },
};
