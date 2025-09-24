import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import avatar1 from "../assets/avatar-1.png";
import avatar2 from "../assets/avatar-2.png";
import avatar3 from "../assets/avatar-3.png";
import avatar4 from "../assets/avatar-4.png";
import avatar5 from "../assets/avatar-5.png";
import avatar6 from "../assets/avatar-6.png";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { LoaderComp } from "./Loader";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

interface LoginFormInputs {
  username: string;
  email: string;
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const [selectedImage, setSelectedImage] = useState<string>(avatars[0]);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    setIsLoggingIn(true);
    setTimeout(() => {
      const userData = {
        username: data.username,
        email: data.email,
        avatar: selectedImage,
      };
      localStorage.setItem("userData", JSON.stringify(userData));

      setIsLoggingIn(false);
      navigate("/dashboard");
    }, 5000);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-6 text-orange-800"
      aria-label="Login form"
    >
      {isLoggingIn && (
        <div
          aria-label="loading spinner"
          className="flex flex-col items-center justify-center h-screen space-y-4 p-6"
        >
          <img
            src={logo}
            alt="App Logo"
            className="h-72 w-auto animate-pulse"
          />
          <LoaderComp size={48} color="text-orange-500" />
          <span className="text-lg font-semibold">Logging you in...</span>
        </div>
      )}

      {!isLoggingIn && (
        <>
          <div className="flex justify-center -mt-15">
            <img
              src={logo}
              alt="App Logo"
              className="h-40 w-auto"
              aria-hidden="false"
            />
          </div>

          <h1 className="text-3xl font-semibold text-center -mt-10">Login</h1>

          <div className="space-y-2">
            <Label htmlFor="username" className="">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              className=""
              placeholder="Enter your username"
              {...register("username", { required: true })}
              aria-invalid={errors.username ? "true" : "false"}
            />
            {errors.username && (
              <span role="alert" className="text-sm text-red-500">
                Username is required
              </span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="">Email</Label>
            <Input
              id="email"
              type="email"
              className=""
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Enter a valid email",
                },
              })}
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && (
              <span role="alert" className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <Label className="">Select an Avatar</Label>
            <div className="flex gap-4 mt-2">
              {avatars.map((avatar, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(avatar)}
                  aria-label={`Select avatar ${index + 1}`}
                  className={`rounded-full border-2 p-1 transition ${
                    selectedImage === avatar
                      ? "border-orange-900"
                      : "border-transparent"
                  }`}
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                    <AvatarFallback>AV</AvatarFallback>
                  </Avatar>
                </button>
              ))}
            </div>
          </div>

          {selectedImage && (
            <div className="text-center">
              <Avatar className="w-16 h-16 mx-auto">
                <AvatarImage src={selectedImage} alt="Selected avatar" />
                <AvatarFallback>AV</AvatarFallback>
              </Avatar>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-amber-800"
            disabled={isLoggingIn}
            variant="default"
            size="default"
          >
            Continue
          </Button>
        </>
      )}
    </form>
  );
}
