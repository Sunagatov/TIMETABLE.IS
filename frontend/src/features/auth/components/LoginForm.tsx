import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login } from "../api/authApi";
import { readableErrorMessage } from "../../../shared/api/httpClient";

const schema = z.object({
  password: z.string().min(1, "Password is required")
});

type FormValues = z.infer<typeof schema>;

type Props = {
  onLoggedIn: () => void;
};

export function LoginForm({ onLoggedIn }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<FormValues>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await login(values.password);
      onLoggedIn();
    } catch (error) {
      setError("password", { message: readableErrorMessage(error, "Login failed") });
    }
  };

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">Password</label>
        <input
          type="password"
          className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-100"
          {...register("password")}
        />
        {errors.password ? (
          <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
