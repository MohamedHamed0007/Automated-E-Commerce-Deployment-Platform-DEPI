"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { hydrateAccessToken } from "@/store/authSlice";
import { getAccessTokenCookie } from "@/lib/authCookies";

export function AuthBootstrap() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hydrateAccessToken(getAccessTokenCookie()));
  }, [dispatch]);

  return null;
}
