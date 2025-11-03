import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

// Lazy load all page components
const Layout = lazy(() => import('@/components/organisms/Layout'))
const Dashboard = lazy(() => import('@/components/pages/Dashboard'))
const Contacts = lazy(() => import('@/components/pages/Contacts'))
const Pipeline = lazy(() => import('@/components/pages/Pipeline'))
const Deals = lazy(() => import('@/components/pages/Deals'))
const Login = lazy(() => import('@/components/pages/Login'))
const Signup = lazy(() => import('@/components/pages/Signup'))
const Callback = lazy(() => import('@/components/pages/Callback'))
const ErrorPage = lazy(() => import('@/components/pages/ErrorPage'))
const ResetPassword = lazy(() => import('@/components/pages/ResetPassword'))
const PromptPassword = lazy(() => import('@/components/pages/PromptPassword'))
const NotFound = lazy(() => import('@/components/pages/NotFound'))

// Suspense fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
)

// Main routes configuration
const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "contacts",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Contacts />
      </Suspense>
    ),
  },
  {
    path: "pipeline",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Pipeline />
      </Suspense>
    ),
  },
  {
    path: "deals",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Deals />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
  },
]

// Routes array with Layout wrapper
const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Layout />
      </Suspense>
    ),
    children: [...mainRoutes],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Signup />
      </Suspense>
    ),
  },
  {
    path: "/callback",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <Callback />
      </Suspense>
    ),
  },
  {
    path: "/error",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ErrorPage />
      </Suspense>
    ),
  },
  {
    path: "/prompt-password/:appId/:emailAddress/:provider",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PromptPassword />
      </Suspense>
    ),
  },
  {
    path: "/reset-password/:appId/:fields",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <ResetPassword />
      </Suspense>
    ),
  },
]

export const router = createBrowserRouter(routes)