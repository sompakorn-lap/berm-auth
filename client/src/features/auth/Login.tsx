import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as v from "valibot";

const SignInSchema = v.object({
  username: v.pipe(v.string(), v.minLength(1, "username is required.")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "password must be long at least 8 characters."),
    v.regex(/^(?=.*[0-9])/, "password must be contained number")
  ),
});

type SignInType = v.InferOutput<typeof SignInSchema>;

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInType>({
    resolver: valibotResolver(SignInSchema),
  });

  const { mutate } = useMutation({
    mutationKey: ["auth"],
    mutationFn: (data: SignInType) =>
      fetch("/api/auth/simple/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
  });

  const { mutate: signout } = useMutation({
    mutationKey: ["auth"],
    mutationFn: () =>
      fetch("/api/auth/simple/signout", {
        method: "DELETE",
      }),
  });

  const { data: auth } = useQuery({
    queryKey: ["auth"],
    queryFn: () => fetch("/api/auth/simple/refresh").then((res) => res.json()),
  });

  return (
    <section>
      {JSON.stringify(auth)}
      <form onSubmit={handleSubmit((data) => mutate(data))}>
        <div>
          <label>Username</label>
          <input {...register("username")} />
          <span>{errors.username?.message}</span>
        </div>
        <div>
          <label>Password</label>
          <input {...register("password")} />
          <span>{errors.password?.message}</span>
        </div>
        <button type="submit">login</button>
      </form>
      {auth ? <button onClick={() => signout()}>signout</button> : null}
    </section>
  );
}

export default Login;
