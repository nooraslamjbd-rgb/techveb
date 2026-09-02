const CLOUD_NAME = "buccb3t4";

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  let publicId = src;

  const match = src.match(
    /cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+)$/
  );
  if (match) {
    publicId = match[1];
  }

  if (publicId.startsWith("/")) {
    publicId = publicId.slice(1);
  }

  const params = [
    "f_auto",
    "c_limit",
    `w_${width}`,
    `q_${quality || "auto"}`,
  ];

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params.join(",")}/${publicId}`;
}
