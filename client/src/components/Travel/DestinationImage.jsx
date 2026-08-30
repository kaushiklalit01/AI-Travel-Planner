import { Image as ImageIcon } from "lucide-react";

export default function DestinationImage({ image }) {
  if (!image?.imageUrl) {
    return null;
  }

  return (
    <div className="mb-6 overflow-hidden rounded-3xl shadow-xl">
      <img
        src={image.imageUrl}
        alt="Destination"
        className="w-full h-72 object-cover"
      />

      <div className="bg-white px-4 py-3 text-sm text-gray-500 flex items-center gap-2">
        <ImageIcon size={16} />
        Photo by{" "}
        <a
          href={image.photographerUrl}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-blue-600 hover:underline"
        >
          {image.photographer}
        </a>{" "}
        on Pexels
      </div>
    </div>
  );
}