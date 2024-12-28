// frontend/app/register/page.tsx

"use client";

export default function RegisterPage() {
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    await fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
  };

  return (
    <div className="flex items-center justify-center h-screen bg-primary">
      <form onSubmit={handleRegister} className="bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Register</h1>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="block w-full mb-4 p-2 border rounded"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="block w-full mb-4 p-2 border rounded"
          required
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
          Register
        </button>
      </form>
    </div>
  );
}
