import { Image as ImageIcon } from "lucide-react";

export default function DestinationImage({ images }) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div>

      <h2 className="text-xl font-bold mb-4">
        Destination
      </h2>

      <div className="grid grid-cols-1 gap-4">

        {images.map((image, index) => (

          <div
            key={index}
            className="overflow-hidden rounded-2xl shadow-md"
          >

            <img
              src={image.imageUrl}
              alt={`Destination ${index + 1}`}
              className="w-full h-56 object-cover"
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
              </a>

              {" "}on Pexels

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}