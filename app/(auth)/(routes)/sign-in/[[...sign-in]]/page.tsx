import AuthLayout from "@/app/(auth)/Layout";
import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return <AuthLayout><SignIn /></AuthLayout>;
}