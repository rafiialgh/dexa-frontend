// import { Link } from "react-router-dom";
import { cn } from "../../../lib/utils";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Eye, EyeOff } from 'lucide-react';
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "../../../services/auth/auth.service";
import { useAuth } from "../../../hooks/useAuth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { mutateAsync: login, isPending } = useAuth();

  const onSubmit = (data: LoginValues) => {
    login(data);
  };

  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <a href='#' className='flex items-center gap-2 font-medium'>
            <div className='text-primary-foreground flex size-28 items-center justify-center'>
              <img src='/image/dexa.png' alt='' />
            </div>
            {/* <p className='font-semibold whitespace-pre-line leading-4.5'>
              {`Dexa 
              Group`}
            </p> */}
          </a>
        </div>

        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-sm'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={cn('flex flex-col gap-6')}
            >
              <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-2xl font-bold'>Login to your account</h1>
                <p className='text-muted-foreground text-sm text-balance'>
                  Enter your email below to login to your account
                </p>
              </div>
              <div className='grid gap-6'>
                <div className='grid gap-3'>
                  <Label htmlFor='email'>Email</Label>
                  <Input
                    id='email'
                    type='email'
                    placeholder='m@example.com'
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className='text-red-500 text-sm'>
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className='grid gap-3'>
                  {/* <div className='flex items-center'>
                    <Label htmlFor='password'>Password</Label>
                    <Link
                      to='/forgot-password'
                      className='ml-auto text-xs underline-offset-4 hover:underline'
                    >
                      Forgot your password?
                    </Link>
                  </div> */}
                  <div className='relative'>
                    <Input
                      id='password'
                      placeholder={'\u2022\u2022\u2022\u2022\u2022\u2022'}
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                    />

                    <button
                      type='button'
                      className='absolute inset-y-0 right-3 flex items-center'
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeOff className='text-gray-500' size={18} />
                      ) : (
                        <Eye size={18} className='text-gray-500' />
                      )}
                    </button>
                  </div>

                  {errors.password && (
                    <p className='text-red-500 text-sm'>
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button type='submit' className='w-full' disabled={isPending}>
                  {isPending ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className='bg-muted relative hidden lg:block'>
        <img
          src={'/image/login-page.webp'}
          alt='Image'
          loading='eager'
          fetchPriority='high'
          className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </div>
    </div>
  )
}