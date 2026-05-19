export default function MessageCard({ item }) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-xl font-semibold">{item.name}</h3>
        <p className="text-sm text-pink-500">{item.relation}</p>
      </div>

      <p className="text-zinc-700 leading-relaxed mb-4">
        {item.message}
      </p>

      {item.mediaUrl && item.mediaType === "image" && (
        <img
          src={item.mediaUrl}
          alt=""
          className="rounded-2xl w-full object-cover"
        />
      )}

      {item.mediaUrl && item.mediaType === "video" && (
        <video
          src={item.mediaUrl}
          controls
          className="rounded-2xl w-full"
        />
      )}
    </div>
  );
}