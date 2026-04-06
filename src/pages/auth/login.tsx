import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      {/* Left section */}
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        {/* Logo */}
        <div className='flex justify-center gap-2 md:justify-start'>
          <a href='#' className='flex items-center gap-2 font-medium'>
            <div className='text-primary-foreground flex size-14 items-center justify-center'>
              <img src='/assets/image/logos/asa-logo.png' alt='' />
            </div>
            <p className='font-semibold whitespace-pre-line leading-4.5'>
              {`Asa
                Kreasi 
                Interasia`}
            </p>
          </a>
        </div>

        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-sm'>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={cn('flex flex-col gap-6', className)}
              {...props}
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
                  <div className='flex items-center'>
                    <Label htmlFor='password'>Password</Label>
                    <Link
                      to='/forgot-password'
                      className='ml-auto text-xs underline-offset-4 hover:underline'
                    >
                      Forgot your password?
                    </Link>
                  </div>
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
              {/* <div className='text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link to='/register' className='underline underline-offset-4'>
            Sign up
          </Link>
        </div> */}
            </form>
          </div>
        </div>
      </div>

      <div className='bg-muted relative hidden lg:block'>
        <img
          src={randomImage}
          alt='Image'
          loading='eager'
          fetchPriority='high'
          className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
        />
      </div>
    </div>
  )
})