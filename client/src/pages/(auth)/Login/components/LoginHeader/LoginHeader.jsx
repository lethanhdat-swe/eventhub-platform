import { CardDescription, CardTitle } from "@/components/ui/card";

export default function LoginHeader() {
  return (
    <>
      <CardTitle className="text-2xl font-black text-(--text-primary)">
        Đăng nhập
      </CardTitle>

      <CardDescription className="mt-2 text-sm text-(--muted-text)">
        Chào mừng bạn quay lại Beetic.
      </CardDescription>
    </>
  );
}