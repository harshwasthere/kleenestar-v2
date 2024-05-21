import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ForgotPasswordForm } from "@/components/custom/ForgotPasswordForm";
import GridBackground from "@/components/ui/background-grid";

const ForgotPasswordPage: React.FC = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center flex-1 bg-background p-2">
            <GridBackground />
            <Link href="/login">
                <Button
                    variant="secondary"
                    className="absolute right-4 top-[34px] md:right-8 max-xs:top-[30px]"
                >
                    Login
                </Button>
            </Link>
            <ForgotPasswordForm />
        </div>
    );
};

export default ForgotPasswordPage;
