

import React from "react";
import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

// This HOC is used to protect routes that require authentication.
// It checks if the user is logged in and redirects to the login page if not.
import { ComponentType } from "react";

function withProtectedRoute<P>(WrappedComponent: ComponentType<P>) {
  return function Wrapper(props: any) {
    const {isLoggedIn}  =   JSON.parse(localStorage.getItem("user") || "{}")
    const router = useRouter();

    useLayoutEffect(() => {
      if (!isLoggedIn) {
        router.push("/");
      }
    }, [isLoggedIn]);

    return <WrappedComponent {...props} />;
  };
}

export default withProtectedRoute;
