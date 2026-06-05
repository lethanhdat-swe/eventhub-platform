export default function LoginErrorAlert({ message }) {
  if (!message) return null;

  return (
    <p
      role="alert"
      className="px-4 py-3 text-sm text-red-500 rounded-xl bg-red-500/10"
    >
      {message}
    </p>
  );
}