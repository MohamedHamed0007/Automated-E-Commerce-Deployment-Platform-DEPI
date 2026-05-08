import Cookies from "js-cookie";

export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";

const accessTokenCookieOptions = {
  expires: 1,
  sameSite: "strict" as const,
};

export function getAccessTokenCookie(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return Cookies.get(ACCESS_TOKEN_COOKIE_NAME) ?? null;
}

export function setAccessTokenCookie(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  Cookies.set(ACCESS_TOKEN_COOKIE_NAME, token, accessTokenCookieOptions);
}

export function removeAccessTokenCookie() {
  if (typeof window === "undefined") {
    return;
  }

  Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
}
